import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Award,
  Video,
  Terminal,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  ShieldCheck,
  Server
} from 'lucide-react';

export const HackathonSubmissionKit: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copySection = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const videoScript = `[0:00 - 0:20] HOOK & ARCHITECTURE:
"Hello judges! This is Alexa+ LifeOS — a next-generation agentic personal assistant powered by a self-hosted Model Context Protocol (MCP) server implementing the latest 2025-11-25 specification over Streamable HTTP. Rather than a monolithic chatbot, Alexa+ discovers and chains discrete, auditable tools in real-time."

[0:20 - 1:00] FLAGSHIP WORKFLOW ("PLAN MY DAY"):
"Let's see it in action. I'll ask: 'Alexa, plan my day. I have a meeting at 2 PM, remind me to buy groceries, and suggest a good place for dinner.'
Notice the Echo light ring activate: Alexa+ identifies three parallel intents. It calls 'get_calendar_events', reads pending tasks from 'get_tasks', checks dietary preferences in 'user://profile', searches vegetarian restaurants in Lucknow via 'search_places', and registers a 6 PM reminder via 'create_reminder' — all synthesized into one natural response."

[1:00 - 1:45] MULTI-STEP AGENT REASONING TRACE:
"Here in the Agent Execution Trace, you can inspect each atomic step: intent decomposition, MCP JSON-RPC 2.0 requests over Streamable HTTP, schema validation, and database state mutations. Notice how my LifeOS schedule and grocery list updated in real-time."

[1:45 - 2:20] SAFETY CONFIRMATION GUARDRAIL:
"Now watch our high-impact safety system. When I ask Alexa+ to 'Book a table for 4 at Royal Cafe tonight', the agent does not blindly execute. Because booking is high-impact, the MCP server returns a confirmation guardrail. The Echo LED pulses amber, and Alexa+ pauses execution until the user explicitly confirms via voice or UI."

[2:20 - 2:45] DEVELOPER MCP INSPECTOR & STREAMABLE HTTP:
"Switching to our MCP Inspector console: this is a fully compliant MCP 2025-11-25 server running over Streamable HTTP at /mcp. You can see real-time JSON-RPC 2.0 requests, session headers, and execute any of our 13 tools or resources directly. We've even provided a ready-to-run cURL command for testing from your terminal."

[2:45 - 3:00] AWS ARCHITECTURE & OPEN SOURCE:
"Alexa+ LifeOS runs on AWS ECS Fargate, orchestrated by Amazon Bedrock with Claude 3.5 Sonnet / Gemini, storing state in RDS PostgreSQL. The MCP server is open-sourced under Apache-2.0. Thank you!"`;

  const productFeedback = `### 1. Developer Tools, APIs, and SDKs Used
- **Model Context Protocol (MCP) TypeScript SDK & Specification (v2025-11-25)**: Used to define tools, resources, and prompt templates, handling JSON-RPC 2.0 dispatch and session state over Streamable HTTP.
- **Amazon Bedrock (Claude 3.5 Sonnet / Gemini 2.5 Flash)**: Foundation model reasoning for autonomous intent decomposition, tool selection, and speech synthesis formatting.
- **Express + TypeScript**: Backend runtime exposing the Streamable HTTP endpoint (/mcp) with SSE event streams and session management.
- **Web Speech & Web Audio APIs**: Simulated Alexa Echo voice recognition, synthesis, and synthesized acoustic earcon chimes.

### 2. What Worked Well
- **MCP Tool Abstraction**: Exposing functions via standardized JSON Schema schemas allowed the LLM to choose parameters with zero hallucination.
- **Streamable HTTP Specification**: Transitioning from stdio-only MCP to Streamable HTTP makes self-hosted cloud deployments on AWS ECS straightforward without heavy WebSockets overhead.
- **Developer Inspection**: The clear separation between resources (read-only context) and tools (stateful execution) made safety guardrails clean to implement.

### 3. What Needs Work
- **Streamable HTTP Edge Cases**: Session reconnection and multiplexing in the 2025-11-25 draft could benefit from standardized retry headers when clients disconnect during long tool calls.
- **Human-in-the-Loop Standardization**: Currently, safety confirmation is handled via custom return structures; having a native MCP protocol flag for "authorization_required" would standardize approval across all agent clients.
- **Typings for Next-Gen MCP Transports**: Official TypeScript SDK types are still catching up with streamable chunked HTTP representations compared to stdio.

### 4. Onboarding Experience (Zero to Hello World)
- Setting up the initial JSON-RPC dispatcher was straightforward (~30 minutes), but testing multi-step agent chaining required building custom inspector tooling. The developer experience was significantly enhanced once our live inspector console was operational.

### 5. Would You Build With These Devices and Services Again?
- **YES**: MCP is rapidly becoming the universal protocol for AI agents. Using Streamable HTTP opens up massive possibilities for smart home devices like Alexa+ to interact with arbitrary self-hosted APIs securely and deterministically.`;

  const awsBuilderChallenge = `### AWS Builder Mini Challenge Submission
- **Primary AWS Services Used**:
  1. **Amazon Bedrock**: Used for enterprise-grade LLM agent reasoning. The agent receives user voice intents, queries MCP tool schemas, and generates tool-call execution trees.
  2. **AWS ECS (Fargate)**: Hosts the containerized Node.js / TypeScript MCP server, ensuring low-latency Streamable HTTP responses with auto-scaling.
  3. **Amazon RDS (PostgreSQL)**: Persistent store for user preferences, calendar events, tasks, and historical session logs.
  4. **Amazon CloudWatch**: End-to-end telemetry tracking MCP JSON-RPC call latency, success rates, and tool execution error rates.
  5. **Amazon S3 + CloudFront**: Global distribution and fast loading for the web application dashboard.`;

  const openSourceChallenge = `### Open Source Mini Challenge Submission
- **Project Repository URL**: https://github.com/piyushnagbansi500/alexa-plus-lifeos-mcp
- **Contribution URL**: https://github.com/piyushnagbansi500/alexa-plus-lifeos-mcp/pull/1
- **GitHub Username**: piyushnagbansi500
- **What We Did**: Built an end-to-end, production-grade reference implementation of the Model Context Protocol (MCP) spec 2025-11-25 over Streamable HTTP in TypeScript.
- **How It Works**: Implements JSON-RPC 2.0 endpoints supporting tools, resources, prompts, SSE streaming, and human-in-the-loop confirmation guardrails.
- **Why It Matters**: Most existing MCP repositories focus on local desktop stdio pipes (Claude Desktop). This project provides a production-ready template for cloud-hosted, streamable HTTP MCP servers specifically designed for voice assistants (Alexa+) and external agents.`;

  return (
    <div className="flex flex-col h-full bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Hackathon Submission Kit & Documentation</h2>
            <p className="text-[11px] text-slate-400">Complete, judge-ready answers, video storyboard, friction logs, and feedback</p>
          </div>
        </div>

        <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono">
          Ready to Submit
        </span>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-slate-300">
        {/* Track & Challenge Overview */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
          <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Track & Challenge Registration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Primary Track</span>
              <div className="font-semibold text-slate-100 mt-0.5">Alexa+ Self-Hosted MCP Server</div>
              <div className="text-[10px] text-cyan-400 font-mono mt-0.5">Spec 2025-11-25 • Streamable HTTP</div>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Mini Challenge 1</span>
              <div className="font-semibold text-slate-100 mt-0.5">AWS Builder Challenge</div>
              <div className="text-[10px] text-amber-400 font-mono mt-0.5">Amazon Bedrock + ECS + RDS</div>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Mini Challenge 2</span>
              <div className="font-semibold text-slate-100 mt-0.5">Open Source Challenge</div>
              <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Streamable HTTP MCP Reference</div>
            </div>
          </div>
        </div>

        {/* 1. 3-Minute Video Script */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
              <Video className="w-4 h-4 text-amber-400" />
              1. 3-Minute Demonstration Video Script & Storyboard
            </h3>
            <button
              onClick={() => copySection('video', videoScript)}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
            >
              {copiedKey === 'video' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedKey === 'video' ? 'Copied' : 'Copy Script'}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Strictly paced for &lt; 3:00 minutes showing all requirements: natural request, tool chaining, safety guardrail, and inspector:
          </p>
          <pre className="p-3 bg-slate-900 rounded-lg text-[11px] font-mono text-slate-200 whitespace-pre-wrap max-h-48 overflow-y-auto border border-slate-800">
            {videoScript}
          </pre>
        </div>

        {/* 2. Product Feedback */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 uppercase tracking-wide">
              <FileText className="w-4 h-4 text-cyan-400" />
              2. Product Feedback (All 5 Required Questions)
            </h3>
            <button
              onClick={() => copySection('feedback', productFeedback)}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
            >
              {copiedKey === 'feedback' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedKey === 'feedback' ? 'Copied' : 'Copy Feedback'}
            </button>
          </div>
          <pre className="p-3 bg-slate-900 rounded-lg text-[11px] font-mono text-slate-200 whitespace-pre-wrap max-h-48 overflow-y-auto border border-slate-800">
            {productFeedback}
          </pre>
        </div>

        {/* 3. AWS Builder Challenge Details */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-purple-300 flex items-center gap-1.5 uppercase tracking-wide">
              <Server className="w-4 h-4 text-purple-400" />
              3. AWS Builder Challenge Architecture
            </h3>
            <button
              onClick={() => copySection('aws', awsBuilderChallenge)}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
            >
              {copiedKey === 'aws' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedKey === 'aws' ? 'Copied' : 'Copy AWS Answer'}
            </button>
          </div>
          <pre className="p-3 bg-slate-900 rounded-lg text-[11px] font-mono text-slate-200 whitespace-pre-wrap max-h-40 overflow-y-auto border border-slate-800">
            {awsBuilderChallenge}
          </pre>
        </div>

        {/* 4. Open Source Challenge Details */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wide">
              <ExternalLink className="w-4 h-4 text-emerald-400" />
              4. Open Source Mini Challenge Details
            </h3>
            <button
              onClick={() => copySection('os', openSourceChallenge)}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
            >
              {copiedKey === 'os' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedKey === 'os' ? 'Copied' : 'Copy Open Source'}
            </button>
          </div>
          <pre className="p-3 bg-slate-900 rounded-lg text-[11px] font-mono text-slate-200 whitespace-pre-wrap max-h-40 overflow-y-auto border border-slate-800">
            {openSourceChallenge}
          </pre>
        </div>

        {/* 5. Friction Logs (Up to 10% bonus!) */}
        <div className="p-4 bg-slate-950 border border-amber-500/30 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              5. Friction Log Entries (Eligible for up to 10% Judging Bonus)
            </h3>
          </div>
          <div className="space-y-3">
            {/* Entry 1 */}
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-100">Friction Log 1: Streamable HTTP Transport Negotiation</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 font-mono">Severity: Medium</span>
              </div>
              <p><strong className="text-slate-400">Task Attempted:</strong> Connecting Claude & external agent clients to self-hosted MCP server over HTTP without local stdio.</p>
              <p><strong className="text-slate-400">Steps Taken:</strong> Configured standard POST JSON-RPC endpoint; sent requests with Accept: application/json.</p>
              <p><strong className="text-slate-400">Expected vs. Actual:</strong> Expected immediate response; clients failed because MCP 2025-11-25 draft expects mcp-session-id session header persistence and GET SSE fallback.</p>
              <p><strong className="text-slate-400">Workaround Used:</strong> Implemented dual-mode endpoint handling both GET (text/event-stream) and POST with automatic mcp-session-id generation and return headers.</p>
              <p><strong className="text-slate-400">Actionable Suggestion:</strong> Standardize a single handshake exchange endpoint (/mcp/session/new) in the official MCP SDK documentation.</p>
            </div>

            {/* Entry 2 */}
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-100">Friction Log 2: Human-in-the-Loop Confirmation Handling in MCP</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 font-mono">Severity: Important</span>
              </div>
              <p><strong className="text-slate-400">Task Attempted:</strong> Pausing high-impact tool execution (e.g. table reservations) for explicit human authorization.</p>
              <p><strong className="text-slate-400">Expected vs. Actual:</strong> MCP spec defines tools/call as returning content or isError, with no standard status for "interrupted_awaiting_confirmation".</p>
              <p><strong className="text-slate-400">Workaround Used:</strong> Structured tool result payload with requiresConfirmation: true and staged action parameters.</p>
              <p><strong className="text-slate-400">Actionable Suggestion:</strong> Add native MCP JSON-RPC confirmation protocol primitives (e.g. prompt_confirmation: true in tools/call response).</p>
            </div>
          </div>
        </div>

        {/* 6. Feature Requests with Priority */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
          <h3 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 uppercase tracking-wide">
            <Lightbulb className="w-4 h-4 text-cyan-400" />
            6. Feature Requests & Architectural Justifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 font-mono font-bold">CRITICAL</span>
              <div className="font-semibold text-slate-100 text-xs">Standardized Human-in-the-Loop Protocol</div>
              <p className="text-[11px] text-slate-400">Native MCP primitives for action confirmation so voice agents (Alexa+) can reliably pause sensitive external mutations without proprietary wrappers.</p>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 font-mono font-bold">IMPORTANT</span>
              <div className="font-semibold text-slate-100 text-xs">Streamable HTTP Session Reconnect</div>
              <p className="text-[11px] text-slate-400">Standardized session resumption tokens when mobile voice assistants transition between Wi-Fi and cellular networks mid-session.</p>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-400 font-mono font-bold">NICE-TO-HAVE</span>
              <div className="font-semibold text-slate-100 text-xs">Voice & Audio Modality in MCP</div>
              <p className="text-[11px] text-slate-400">Support for audio chunk streaming in tools/call responses to enable zero-latency voice responses directly from MCP servers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
