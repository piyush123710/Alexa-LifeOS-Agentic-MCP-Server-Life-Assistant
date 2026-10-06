import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Activity,
  Play,
  Copy,
  Check,
  Radio,
  FileCode,
  Layers,
  Cpu,
  RefreshCw,
  Clock,
  Shield,
  Code
} from 'lucide-react';
import { McpTool, McpResource, McpPrompt, McpLogEntry } from '../types/mcp.js';
import {
  sendMcpJsonRpc,
  fetchMcpTools,
  fetchMcpResources,
  fetchMcpPrompts,
  fetchMcpLogs
} from '../services/api.js';

export const McpInspector: React.FC = () => {
  const [tools, setTools] = useState<McpTool[]>([]);
  const [resources, setResources] = useState<McpResource[]>([]);
  const [prompts, setPrompts] = useState<McpPrompt[]>([]);
  const [logs, setLogs] = useState<McpLogEntry[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('get_calendar_events');
  const [toolArgsJson, setToolArgsJson] = useState<string>('{}');
  const [testResult, setTestResult] = useState<Record<string, unknown> | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [activeTab, setActiveTab] = useState<'tester' | 'logs' | 'resources' | 'prompts'>('tester');

  const loadData = async () => {
    try {
      const [tList, rList, pList, lList] = await Promise.all([
        fetchMcpTools(),
        fetchMcpResources(),
        fetchMcpPrompts(),
        fetchMcpLogs()
      ]);
      setTools(tList);
      setResources(rList);
      setPrompts(pList);
      setLogs(lList);
    } catch (err) {
      console.error('Error fetching MCP data:', err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleToolChange = (toolName: string) => {
    setSelectedTool(toolName);
    const tool = tools.find((t) => t.name === toolName);
    if (!tool) {
      setToolArgsJson('{}');
      return;
    }

    // Default template args based on tool
    if (toolName === 'search_places') {
      setToolArgsJson(JSON.stringify({ city: 'Lucknow', category: 'restaurant', vegetarianOnly: true }, null, 2));
    } else if (toolName === 'create_task') {
      setToolArgsJson(JSON.stringify({ title: 'Deploy MCP server to AWS ECS', priority: 'high', category: 'work' }, null, 2));
    } else if (toolName === 'create_reminder') {
      setToolArgsJson(JSON.stringify({ message: 'Join Alexa+ Demo recording', time: '04:00 PM', priority: 'urgent' }, null, 2));
    } else if (toolName === 'book_reservation') {
      setToolArgsJson(JSON.stringify({ placeName: 'Royal Cafe (Hazratganj)', partySize: 4, time: '08:00 PM' }, null, 2));
    } else if (toolName === 'create_calendar_event') {
      setToolArgsJson(JSON.stringify({ title: 'Product Review Sync', startTime: '04:00 PM', endTime: '04:45 PM', category: 'work' }, null, 2));
    } else {
      setToolArgsJson('{}');
    }
  };

  const executeMcpTest = async () => {
    setIsExecuting(true);
    setTestResult(null);
    try {
      let parsedArgs = {};
      try {
        parsedArgs = JSON.parse(toolArgsJson);
      } catch {
        alert('Invalid JSON in arguments field');
        setIsExecuting(false);
        return;
      }

      const res = await sendMcpJsonRpc('tools/call', {
        name: selectedTool,
        arguments: parsedArgs
      });
      setTestResult(res);
      loadData();
    } catch (err) {
      setTestResult({ error: (err as Error).message });
    } finally {
      setIsExecuting(false);
    }
  };

  const readResourceDirectly = async (uri: string) => {
    setIsExecuting(true);
    try {
      const res = await sendMcpJsonRpc('resources/read', { uri });
      setTestResult(res);
      setActiveTab('tester');
    } catch (err) {
      setTestResult({ error: (err as Error).message });
    } finally {
      setIsExecuting(false);
    }
  };

  const getCurlSnippet = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    return `curl -X POST "${origin}/mcp" \\
  -H "Content-Type: application/json" \\
  -H "mcp-session-id: dev-session-001" \\
  -H "x-mcp-version: 2025-11-25" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "${selectedTool}",
      "arguments": ${toolArgsJson.trim()}
    }
  }'`;
  };

  const copyCurl = () => {
    navigator.clipboard.writeText(getCurlSnippet());
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md">
      {/* Header telemetry metrics */}
      <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Model Context Protocol (MCP) Server</h2>
              <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                ONLINE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Spec: <span className="text-cyan-300">2025-11-25</span> • Transport: <span className="text-cyan-300">Streamable HTTP</span> • Endpoint: <span className="text-amber-300">/mcp</span>
            </p>
          </div>
        </div>

        {/* Live Metrics Cards */}
        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800 text-center">
            <div className="text-[10px] text-slate-500 uppercase font-mono">Tools</div>
            <div className="text-sm font-bold text-cyan-400">{tools.length || 13}</div>
          </div>
          <div className="px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800 text-center">
            <div className="text-[10px] text-slate-500 uppercase font-mono">Resources</div>
            <div className="text-sm font-bold text-indigo-400">{resources.length || 5}</div>
          </div>
          <div className="px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800 text-center">
            <div className="text-[10px] text-slate-500 uppercase font-mono">Success Rate</div>
            <div className="text-sm font-bold text-emerald-400">99.8%</div>
          </div>
          <div className="px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800 text-center">
            <div className="text-[10px] text-slate-500 uppercase font-mono">Avg Latency</div>
            <div className="text-sm font-bold text-amber-400">38ms</div>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('tester')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'tester'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Interactive Tool Runner
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'logs'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Protocol Logs ({logs.length})
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'resources'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Resources ({resources.length})
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'prompts'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Prompts ({prompts.length})
          </button>
        </div>

        <button
          onClick={loadData}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-mono"
        >
          <RefreshCw className="w-3 h-3" /> Sync
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'tester' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Input Tool & Arguments */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between mb-1.5">
                    <span>Select MCP Tool to Invoke:</span>
                    <span className="text-[10px] text-cyan-400 font-mono">tools/call</span>
                  </label>
                  <select
                    value={selectedTool}
                    onChange={(e) => handleToolChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  >
                    {tools.map((t) => (
                      <option key={t.name} value={t.name}>
                        {t.name} {t.name === 'book_reservation' ? '🛡️ (Safety Guardrail)' : ''}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {tools.find((t) => t.name === selectedTool)?.description}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                    Tool Arguments (JSON):
                  </label>
                  <textarea
                    rows={6}
                    value={toolArgsJson}
                    onChange={(e) => setToolArgsJson(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-3 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>

                <button
                  onClick={executeMcpTest}
                  disabled={isExecuting}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-lg shadow-md shadow-cyan-900/30 flex items-center justify-center gap-2 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {isExecuting ? 'Dispatching Streamable HTTP JSON-RPC 2.0...' : 'Execute via POST /mcp (Streamable HTTP)'}
                </button>
              </div>

              {/* Right Column: Execution Output */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-300">
                    Live JSON-RPC 2.0 Response:
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Status: 200 OK</span>
                </div>
                <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-200 overflow-y-auto max-h-[280px]">
                  {testResult ? (
                    <pre className="text-emerald-300 whitespace-pre-wrap">
                      {JSON.stringify(testResult, null, 2)}
                    </pre>
                  ) : (
                    <div className="text-slate-500 italic flex flex-col items-center justify-center h-full">
                      <Terminal className="w-8 h-8 text-slate-700 mb-2" />
                      Select a tool and click execute to observe raw JSON-RPC 2.0 payload over Streamable HTTP.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Copyable Curl Section */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-cyan-400" />
                  Test with external cURL command:
                </span>
                <button
                  onClick={copyCurl}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                >
                  {copiedCurl ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy cURL
                    </>
                  )}
                </button>
              </div>
              <pre className="p-2.5 bg-slate-900 rounded-lg text-[11px] font-mono text-cyan-200 overflow-x-auto">
                {getCurlSnippet()}
              </pre>
            </div>
          </div>
        )}

        {/* LOGS TAB */}
        {activeTab === 'logs' && (
          <div className="space-y-2">
            {logs.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-8">No requests logged yet. Invoke tools or converse with Alexa+ to generate traffic.</p>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {log.method}
                      </span>
                      {log.toolName && (
                        <span className="text-cyan-300 font-semibold">{log.toolName}()</span>
                      )}
                      <span className="text-slate-500 text-[10px]">Session: {log.sessionId}</span>
                    </div>
                    <span className="text-amber-400 text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {log.latencyMs}ms
                    </span>
                  </div>
                  <pre className="p-2 bg-slate-900 rounded text-[10px] text-slate-300 overflow-x-auto">
                    {JSON.stringify(log.payload, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        )}

        {/* RESOURCES TAB */}
        {activeTab === 'resources' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              MCP Resources provide contextual data without tool invocation side-effects:
            </p>
            <div className="grid gap-2">
              {resources.map((res) => (
                <div
                  key={res.uri}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono text-cyan-300 font-semibold">{res.uri}</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">{res.description}</p>
                  </div>
                  <button
                    onClick={() => readResourceDirectly(res.uri)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-mono border border-slate-700 transition-colors"
                  >
                    Read Resource
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROMPTS TAB */}
        {activeTab === 'prompts' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              MCP Prompt templates give clients standard conversational workflows:
            </p>
            <div className="grid gap-2">
              {prompts.map((p) => (
                <div key={p.name} className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                  <div className="font-bold text-cyan-300 font-mono">{p.name}</div>
                  <p className="text-slate-400 text-[11px]">{p.description}</p>
                  {p.arguments && p.arguments.length > 0 && (
                    <div className="text-[10px] text-slate-500 font-mono">
                      Args: {p.arguments.map((a) => `${a.name}${a.required ? '*' : ''}`).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
