import { LifeOSData, McpLogEntry, McpTool, McpResource, McpPrompt } from '../types/mcp.js';

export async function fetchLifeOSSnapshot(): Promise<LifeOSData> {
  const res = await fetch('/api/lifeos/snapshot');
  if (!res.ok) throw new Error('Failed to fetch LifeOS data');
  return res.json();
}

export async function resetLifeOS(): Promise<void> {
  await fetch('/api/lifeos/reset', { method: 'POST' });
}

export async function fetchMcpInfo(): Promise<{
  status: string;
  protocol: string;
  transport: string;
  endpoint: string;
  server: { name: string; version: string };
  toolsCount: number;
  resourcesCount: number;
  promptsCount: number;
}> {
  const res = await fetch('/api/mcp/info');
  return res.json();
}

export async function fetchMcpTools(): Promise<McpTool[]> {
  const res = await fetch('/api/mcp/tools');
  const data = await res.json();
  return data.tools;
}

export async function fetchMcpResources(): Promise<McpResource[]> {
  const res = await fetch('/api/mcp/resources');
  const data = await res.json();
  return data.resources;
}

export async function fetchMcpPrompts(): Promise<McpPrompt[]> {
  const res = await fetch('/api/mcp/prompts');
  const data = await res.json();
  return data.prompts;
}

export async function fetchMcpLogs(): Promise<McpLogEntry[]> {
  const res = await fetch('/api/mcp/logs');
  const data = await res.json();
  return data.logs;
}

// Call the real MCP JSON-RPC 2.0 endpoint directly over Streamable HTTP POST /mcp
export async function sendMcpJsonRpc(method: string, params: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
  const sessionId = 'web-client-' + Math.random().toString(36).substring(2, 8);
  const payload = {
    jsonrpc: '2.0',
    id: Date.now(),
    method,
    params
  };

  const res = await fetch('/mcp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'mcp-session-id': sessionId,
      'x-mcp-version': '2025-11-25'
    },
    body: JSON.stringify(payload)
  });

  return res.json();
}

export async function orchestrateAgent(query: string, confirmedAction?: Record<string, unknown>): Promise<{
  speechText: string;
  steps: Array<{
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
  snapshot?: LifeOSData;
}> {
  const res = await fetch('/api/agent/orchestrate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, confirmedAction })
  });

  if (!res.ok) throw new Error('Agent orchestration failed');
  return res.json();
}
