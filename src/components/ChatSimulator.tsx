import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  MapPin,
  Calendar,
  ShieldCheck,
  RotateCcw,
  Bot,
  User,
  Wrench
} from 'lucide-react';
import { AgentStep } from '../types/mcp.js';

interface Message {
  id: string;
  sender: 'user' | 'alexa';
  text: string;
  timestamp: string;
  steps?: AgentStep[];
  requiresConfirmation?: boolean;
  confirmationDetails?: Record<string, unknown>;
  suggestedNextAction?: {
    type: string;
    prompt: string;
    details: Record<string, unknown>;
  };
}

interface ChatSimulatorProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onConfirmAction: (actionDetails: Record<string, unknown>) => void;
  onCancelAction: () => void;
  onReset: () => void;
}

const PRESET_QUERIES = [
  {
    label: '✨ Plan My Day',
    query: 'Alexa, plan my day. I have a meeting at 2 PM, remind me to buy groceries, and suggest a good place for dinner.',
    tag: 'Flagship Multi-Tool Demo'
  },
  {
    label: '🌆 Weekend in Lucknow',
    query: 'Alexa, plan my weekend in Lucknow within ₹2,500 with vegetarian food and heritage spots.',
    tag: 'Multi-Step Itinerary'
  },
  {
    label: '🛡️ Book Restaurant (Safety)',
    query: 'Alexa, book a table for 4 at Royal Cafe Hazratganj for 8:00 PM tonight.',
    tag: 'Human Confirmation Guardrail'
  },
  {
    label: '📋 Pending Tasks',
    query: 'Alexa, what do I need to finish today and what is on my calendar?',
    tag: 'LifeOS Schedule & Tasks'
  }
];

export const ChatSimulator: React.FC<ChatSimulatorProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onConfirmAction,
  onCancelAction,
  onReset
}) => {
  const [inputText, setInputText] = useState('');
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const toggleStepExpand = (msgId: string) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md">
      {/* Header bar */}
      <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Alexa+ Agentic Assistant
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
                MCP LIVE
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">Streamable HTTP • Multi-tool Orchestration • Human Confirmation</p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-md border border-slate-800 hover:border-slate-700 bg-slate-900 flex items-center gap-1.5 transition-colors"
          title="Reset conversation and restore demo database"
        >
          <RotateCcw className="w-3 h-3" /> Reset Demo
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold whitespace-nowrap">
          Quick Demos:
        </span>
        {PRESET_QUERIES.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(preset.query)}
            disabled={isLoading}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 hover:border-cyan-500/50 flex items-center gap-1.5 transition-all shadow-sm group"
          >
            <span>{preset.label}</span>
            <span className="text-[10px] text-cyan-400/80 group-hover:text-cyan-300">
              ({preset.tag})
            </span>
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-start gap-2.5 max-w-[92%] md:max-w-[85%]">
              {msg.sender === 'alexa' && (
                <div className="w-7 h-7 rounded-full bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center flex-shrink-0 mt-0.5 text-cyan-400">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className="flex flex-col">
                {/* Speech bubble */}
                <div
                  className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-tr-none shadow-md shadow-cyan-900/30 font-medium'
                      : 'bg-slate-800/90 text-slate-200 rounded-tl-none border border-slate-700/80 shadow-md'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {/* Agent Execution Trace Accordion (if Alexa message has tool steps) */}
                {msg.steps && msg.steps.length > 0 && (
                  <div className="mt-2.5 bg-slate-950/70 border border-slate-800 rounded-xl p-3 shadow-inner">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium">
                        <Wrench className="w-3.5 h-3.5" />
                        <span>MCP Agent Execution Chain ({msg.steps.length} steps)</span>
                      </div>
                      <button
                        onClick={() => toggleStepExpand(msg.id)}
                        className="text-[11px] text-slate-400 hover:text-cyan-300 underline font-mono"
                      >
                        {expandedSteps[msg.id] !== false ? 'Hide Trace' : 'Show Details'}
                      </button>
                    </div>

                    {expandedSteps[msg.id] !== false && (
                      <div className="mt-3 space-y-2.5 border-t border-slate-800/80 pt-2.5">
                        {msg.steps.map((step) => (
                          <div
                            key={step.id}
                            className={`p-2.5 rounded-lg text-xs border ${
                              step.type === 'thought'
                                ? 'bg-indigo-950/30 border-indigo-500/30 text-indigo-200'
                                : step.type === 'tool_call'
                                ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200'
                                : step.type === 'tool_result'
                                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                                : step.type === 'confirmation_required'
                                ? 'bg-amber-950/50 border-amber-500/60 text-amber-200'
                                : 'bg-slate-900 border-slate-800 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold flex items-center gap-1.5">
                                {step.type === 'thought' && '🧠 Plan & Reasoning'}
                                {step.type === 'tool_call' && `⚡ Call: ${step.toolName}`}
                                {step.type === 'tool_result' && `✓ Output: ${step.toolName}`}
                                {step.type === 'confirmation_required' && '🛡️ Guardrail Intercept'}
                                {step.type === 'synthesis' && '🎙️ Alexa+ Speech Synthesis'}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {step.durationMs ? `${step.durationMs}ms` : step.timestamp}
                              </span>
                            </div>
                            <p className="mt-1 text-slate-300 leading-normal">{step.content}</p>

                            {/* Arguments or Output JSON snippet */}
                            {step.toolArgs && Object.keys(step.toolArgs).length > 0 && (
                              <div className="mt-1.5 p-1.5 bg-black/40 rounded border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
                                <code>args: {JSON.stringify(step.toolArgs)}</code>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Safety Confirmation Card (Human-in-the-Loop) */}
                {msg.requiresConfirmation && msg.confirmationDetails && (
                  <div className="mt-3 p-4 bg-amber-950/40 border border-amber-500/60 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Action Authorization Required (Safety System)</span>
                    </div>
                    <p className="mt-1 text-xs text-amber-200/90 leading-relaxed">
                      Alexa+ requires your confirmation before committing this high-impact action:
                    </p>

                    <div className="mt-2.5 p-2.5 bg-slate-950/80 rounded-lg border border-amber-500/30 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Venue:</span>
                        <span className="text-slate-100 font-semibold">{String(msg.confirmationDetails.placeName)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Party Size:</span>
                        <span className="text-slate-100 font-semibold">{String(msg.confirmationDetails.partySize)} Guests</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Time:</span>
                        <span className="text-slate-100 font-semibold">{String(msg.confirmationDetails.time)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Estimated Cost:</span>
                        <span className="text-slate-100 font-semibold">{String(msg.confirmationDetails.estimatedCost || '₹1,500 - ₹2,000')}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2.5">
                      <button
                        onClick={() => onConfirmAction(msg.confirmationDetails!)}
                        className="flex-1 py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Yes, Confirm Booking
                      </button>
                      <button
                        onClick={onCancelAction}
                        className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                )}

                {/* Suggested follow-up pill */}
                {msg.suggestedNextAction && !msg.requiresConfirmation && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">Next suggested action:</span>
                    <button
                      onClick={() => onSendMessage(msg.suggestedNextAction!.prompt)}
                      className="text-xs px-2.5 py-1 rounded-md bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/60 flex items-center gap-1 transition-colors"
                    >
                      <span>{msg.suggestedNextAction.prompt}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <span className="mt-1 text-[10px] text-slate-500 px-1">{msg.timestamp}</span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-slate-300">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2.5 text-xs text-cyan-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800 w-fit animate-pulse">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>Alexa+ is calling LifeOS MCP tools and compiling response...</span>
          </div>
        )}
      </div>

      {/* Input text form */}
      <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder='Ask Alexa+ (e.g. "Plan my day", "Plan my weekend in Lucknow", "Book table")...'
          className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="p-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl transition-colors shadow-md shadow-cyan-900/30 flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
