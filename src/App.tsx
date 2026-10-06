/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Calendar,
  Layers,
  Terminal,
  Award,
  Radio,
  Volume2,
  VolumeX,
  Mic,
  RotateCcw,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

import { LifeOSData, initialLifeOSData } from './shared/db.js';
import {
  fetchLifeOSSnapshot,
  resetLifeOS,
  orchestrateAgent,
  sendMcpJsonRpc
} from './services/api.js';
import {
  playWakeChime,
  playConfirmationChime,
  speakText,
  stopSpeaking
} from './services/soundService.js';

import { EchoDevice, EchoState } from './components/EchoDevice.js';
import { ChatSimulator } from './components/ChatSimulator.js';
import { LifeOSDashboard } from './components/LifeOSDashboard.js';
import { McpInspector } from './components/McpInspector.js';
import { HackathonSubmissionKit } from './components/HackathonSubmissionKit.js';

interface Message {
  id: string;
  sender: 'user' | 'alexa';
  text: string;
  timestamp: string;
  steps?: Array<{
    id: string;
    type: 'thought' | 'tool_call' | 'tool_result' | 'confirmation_required' | 'synthesis';
    title: string;
    content: string;
    toolName?: string;
    toolArgs?: Record<string, unknown>;
    toolOutput?: unknown;
    timestamp: string;
    durationMs?: number;
  }>;
  requiresConfirmation?: boolean;
  confirmationDetails?: Record<string, unknown>;
  suggestedNextAction?: {
    type: string;
    prompt: string;
    details: Record<string, unknown>;
  };
}

export default function App() {
  const [activeView, setActiveView] = useState<'simulator' | 'lifeos' | 'mcp' | 'submission'>('simulator');
  const [echoState, setEchoState] = useState<EchoState>('idle');
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeSpeechUtterance, setActiveSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [lifeOsData, setLifeOsData] = useState<LifeOSData>(initialLifeOSData);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'alexa',
      text: 'Good morning, Alex. I am Alexa+, powered by the 2025-11-25 Model Context Protocol (MCP) over Streamable HTTP. I have direct access to your calendar, tasks queue, preferences in Lucknow, and place recommendations. Try asking: "Plan my day" or "Plan my weekend in Lucknow".',
      timestamp: 'Just now',
      suggestedNextAction: {
        type: 'query',
        prompt: 'Alexa, plan my day',
        details: {}
      }
    }
  ]);

  const recognitionRef = useRef<any>(null);

  // Initialize data on mount
  const refreshSnapshot = async () => {
    try {
      const data = await fetchLifeOSSnapshot();
      setLifeOsData(data);
    } catch (err) {
      console.warn('Using local fallback state:', err);
    }
  };

  useEffect(() => {
    refreshSnapshot();
  }, []);

  // Web Speech API Voice Recognition setup
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setEchoState('idle');
      return;
    }

    const SpeechRecClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecClass) {
      // Graceful fallback for browsers without SpeechRecognition
      const fallbackPrompt =
        'Alexa, plan my day. I have a meeting at 2 PM, remind me to buy groceries, and suggest a good place for dinner.';
      playWakeChime();
      handleSendMessage(fallbackPrompt);
      return;
    }

    try {
      stopSpeaking();
      playWakeChime();
      const rec = new SpeechRecClass();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setEchoState('listening');
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        if (transcript && transcript.trim()) {
          handleSendMessage(transcript.trim());
        } else {
          setEchoState('idle');
        }
      };

      rec.onerror = () => {
        setIsListening(false);
        setEchoState('idle');
      };

      rec.onend = () => {
        setIsListening(false);
        if (echoState === 'listening') {
          setEchoState('idle');
        }
      };

      recognitionRef.current = rec;
      rec.start();
    } catch {
      setIsListening(false);
      setEchoState('idle');
    }
  };

  const handleToggleMute = () => {
    if (!isMuted) {
      stopSpeaking();
      setIsMuted(true);
      if (echoState === 'speaking') {
        setEchoState('idle');
      }
    } else {
      setIsMuted(false);
    }
  };

  // Main agent orchestration dispatcher
  const handleSendMessage = async (userText: string) => {
    if (!userText.trim()) return;

    setCurrentQuery(userText);
    stopSpeaking();

    // Add user message to thread
    const userMsg: Message = {
      id: 'msg-' + Date.now().toString(36),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setEchoState('thinking');

    try {
      const response = await orchestrateAgent(userText);

      const alexaMsg: Message = {
        id: 'msg-' + (Date.now() + 1).toString(36),
        sender: 'alexa',
        text: response.speechText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        steps: response.steps,
        requiresConfirmation: response.requiresConfirmation,
        confirmationDetails: response.confirmationDetails,
        suggestedNextAction: response.suggestedNextAction
      };

      setMessages((prev) => [...prev, alexaMsg]);

      if (response.snapshot) {
        setLifeOsData(response.snapshot);
      } else {
        refreshSnapshot();
      }

      // Check if action requires human confirmation
      if (response.requiresConfirmation) {
        setEchoState('confirmation');
      } else {
        setEchoState('speaking');
      }

      // Voice output
      if (!isMuted && response.speechText) {
        speakText(response.speechText, () => {
          setEchoState(response.requiresConfirmation ? 'confirmation' : 'idle');
        });
      }
    } catch (err) {
      console.error('Agent error:', err);
      const errorMsg: Message = {
        id: 'msg-' + (Date.now() + 1).toString(36),
        sender: 'alexa',
        text: 'I encountered an error communicating with the LifeOS MCP tools. Please check that the server is online.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
      setEchoState('idle');
    } finally {
      setIsLoading(false);
    }
  };

  // Human-in-the-Loop Confirmation Handler
  const handleConfirmAction = async (actionDetails: Record<string, unknown>) => {
    playConfirmationChime();
    setEchoState('thinking');
    setIsLoading(true);

    try {
      const response = await orchestrateAgent('', actionDetails);

      const alexaMsg: Message = {
        id: 'msg-' + Date.now().toString(36),
        sender: 'alexa',
        text: response.speechText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        steps: response.steps
      };

      setMessages((prev) => [...prev, alexaMsg]);

      if (response.snapshot) {
        setLifeOsData(response.snapshot);
      } else {
        refreshSnapshot();
      }

      setEchoState('speaking');

      if (!isMuted && response.speechText) {
        speakText(response.speechText, () => {
          setEchoState('idle');
        });
      }
    } catch (err) {
      console.error('Confirmation error:', err);
      setEchoState('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAction = () => {
    setEchoState('idle');
    const cancelMsg: Message = {
      id: 'msg-' + Date.now().toString(36),
      sender: 'alexa',
      text: 'Understood. I have cancelled the pending booking and kept your schedule unchanged.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, cancelMsg]);
    if (!isMuted) {
      speakText('Understood, booking cancelled.');
    }
  };

  // Direct LifeOS task actions
  const handleAddTask = async (title: string, priority: 'low' | 'medium' | 'high') => {
    await sendMcpJsonRpc('tools/call', {
      name: 'create_task',
      arguments: { title, priority, category: 'work' }
    });
    refreshSnapshot();
  };

  const handleToggleTask = async (id: string, currentStatus: 'pending' | 'completed') => {
    const nextStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    await sendMcpJsonRpc('tools/call', {
      name: 'update_task',
      arguments: { id, status: nextStatus }
    });
    refreshSnapshot();
  };

  const handleToggleShopping = async (id: string) => {
    const item = lifeOsData.shopping.find((s) => s.id === id);
    if (!item) return;
    setLifeOsData((prev) => ({
      ...prev,
      shopping: prev.shopping.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s))
    }));
  };

  const handleAddShoppingItem = async (name: string, quantity: string) => {
    await sendMcpJsonRpc('tools/call', {
      name: 'add_shopping_item',
      arguments: { name, quantity, category: 'produce' }
    });
    refreshSnapshot();
  };

  const handleResetDemo = async () => {
    await resetLifeOS();
    await refreshSnapshot();
    stopSpeaking();
    setEchoState('idle');
    setMessages([
      {
        id: 'reset-msg',
        sender: 'alexa',
        text: 'LifeOS database and session have been restored to initial state. How can I help you today?',
        timestamp: 'Just now'
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Brand Icon & Title */}
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-md shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                Alexa<span className="text-cyan-400 font-extrabold">+</span> LifeOS
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono font-medium">
                MCP 2025-11-25
              </span>
              <span className="hidden sm:inline-flex text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                Streamable HTTP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              Self-hosted Model Context Protocol server & simulated agentic life assistant
            </p>
          </div>
        </div>

        {/* View Switcher Navigation */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveView('simulator')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'simulator'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Alexa+ Voice</span>
          </button>
          <button
            onClick={() => setActiveView('lifeos')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'lifeos'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>LifeOS Dashboard</span>
          </button>
          <button
            onClick={() => setActiveView('mcp')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'mcp'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>MCP Inspector</span>
          </button>
          <button
            onClick={() => setActiveView('submission')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'submission'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-amber-200'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">Hackathon Kit</span>
          </button>
        </div>
      </header>

      {/* Main App Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Always Visible Echo Device + Quick Context Card (lg: 4 cols) */}
        <aside className="lg:col-span-4 flex flex-col gap-5">
          {/* Echo Device Hardware Unit */}
          <EchoDevice
            state={echoState}
            isListening={isListening}
            isMuted={isMuted}
            onToggleListen={toggleListening}
            onToggleMute={handleToggleMute}
            activeQuery={currentQuery}
          />

          {/* Quick Context / LifeOS Glances */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 space-y-3.5 shadow-lg backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Live LifeOS Context
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Lucknow, UP</span>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80">
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Next Event</div>
                <div className="font-semibold text-cyan-300 truncate mt-0.5">
                  {lifeOsData.calendar[0]?.title || 'Architecture Sync'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {lifeOsData.calendar[0]?.startTime || '02:00 PM'}
                </div>
              </div>

              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80">
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Pending Tasks</div>
                <div className="font-semibold text-amber-300 mt-0.5">
                  {lifeOsData.tasks.filter((t) => t.status === 'pending').length} tasks left
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  Top: {lifeOsData.tasks[0]?.title || 'MCP spec'}
                </div>
              </div>
            </div>

            {/* Active User Preference badges */}
            <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80 space-y-1.5">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Agent Grounding Context:</div>
              <div className="flex flex-wrap gap-1">
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  🌱 Vegetarian Only
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  💰 Budget: ₹₹ Moderate
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  📍 Lucknow Hub
                </span>
              </div>
            </div>

            {/* MCP Endpoint banner */}
            <div className="p-2.5 bg-cyan-950/30 rounded-lg border border-cyan-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="font-mono text-cyan-300 text-[11px]">POST /mcp</span>
              </div>
              <button
                onClick={() => setActiveView('mcp')}
                className="text-[10px] text-cyan-400 hover:text-cyan-200 underline flex items-center gap-0.5"
              >
                Inspect <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </aside>

        {/* Right Column: Dynamic Main View (lg: 8 cols) */}
        <section className="lg:col-span-8 h-[650px] md:h-[720px]">
          {activeView === 'simulator' && (
            <ChatSimulator
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              onConfirmAction={handleConfirmAction}
              onCancelAction={handleCancelAction}
              onReset={handleResetDemo}
            />
          )}

          {activeView === 'lifeos' && (
            <LifeOSDashboard
              data={lifeOsData}
              onRefresh={refreshSnapshot}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onToggleShopping={handleToggleShopping}
              onAddShoppingItem={handleAddShoppingItem}
            />
          )}

          {activeView === 'mcp' && <McpInspector />}

          {activeView === 'submission' && <HackathonSubmissionKit />}
        </section>
      </main>

      {/* Footer info */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 px-6 py-3 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span>Alexa+ LifeOS • Built for Model Context Protocol Hackathon • Spec Version: 2025-11-25 Streamable HTTP</span>
        </div>
        <div className="flex items-center gap-3 font-mono">
          <span>Amazon Bedrock / Gemini</span>
          <span>•</span>
          <span>AWS ECS Fargate</span>
          <span>•</span>
          <span>Open Source</span>
        </div>
      </footer>
    </div>
  );
}
