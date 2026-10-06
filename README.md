# 🎙️ Alexa+ LifeOS — Agentic MCP Server & Life Assistant

[![MCP Spec](https://img.shields.io/badge/MCP_Spec-2025--11--25-06b6d4?style=flat-square)](https://modelcontextprotocol.io/)
[![Transport](https://img.shields.io/badge/Transport-Streamable_HTTP_(SSE_%2B_POST)-3b82f6?style=flat-square)](#mcp-streamable-http-protocol)
[![AI Engine](https://img.shields.io/badge/AI-Amazon_Bedrock_%2F_Gemini-8b5cf6?style=flat-square)](#ai-orchestration-layer)
[![AWS Architecture](https://img.shields.io/badge/AWS-ECS_Fargate_%2B_RDS_PostgreSQL-ff9900?style=flat-square)](#aws-builder-architecture)
[![License](https://img.shields.io/badge/License-Apache_2.0-10b981?style=flat-square)](LICENSE)

> A production-ready, self-hosted **Model Context Protocol (MCP)** server implementing the **2025-11-25 specification** over **Streamable HTTP**, powering an agentic **Alexa+** personal life assistant with multi-step tool orchestration, voice interaction, human-in-the-loop safety guardrails, developer inspector console, and complete hackathon submission kit.

---

## 📌 Table of Contents

- [Overview & Vision](#-overview--vision)
- [Key Features](#-key-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [MCP 2025-11-25 Protocol Compliance](#-mcp-2025-11-25-protocol-compliance)
  - [Exposed Tools (13)](#1-mcp-tools-13)
  - [Exposed Resources (5)](#2-mcp-resources-5)
  - [Prompt Templates (3)](#3-mcp-prompts-3)
- [Core Agentic Workflows & Demos](#-core-agentic-workflows--demos)
  - [Workflow 1: Plan My Day](#workflow-1-plan-my-day-flagship-demo)
  - [Workflow 2: Plan My Weekend in Lucknow](#workflow-2-plan-my-weekend-in-lucknow)
  - [Workflow 3: Human-in-the-Loop Safety Guardrail](#workflow-3-human-in-the-loop-safety-guardrail)
- [Testing the MCP Server via cURL](#-testing-the-mcp-server-via-curl)
- [Amazon Echo Visualizer & Voice Simulation](#-amazon-echo-visualizer--voice-simulation)
- [AWS Builder Architecture (Mini Challenge)](#-aws-builder-architecture-mini-challenge)
- [Open Source Contribution (Mini Challenge)](#-open-source-contribution-mini-challenge)
- [3-Minute Video Script & Demonstration Guide](#-3-minute-video-script--demonstration-guide)
- [Product Feedback (All 5 Required Prompts)](#-product-feedback)
- [Friction Log Entries (+10% Bonus)](#-friction-log-entries)
- [Feature Requests](#-feature-requests)
- [Local Installation & Setup](#-local-installation--setup)

---

## 🌟 Overview & Vision

Traditional voice skills rely on rigid intent matching and fragile webhook cascades. **Alexa+ LifeOS** re-architects the personal assistant experience using the open **Model Context Protocol (MCP)**:
1. **Tool Discovery over Static APIs**: Instead of hardcoding API routes, Alexa+ dynamically inspects the MCP server catalog via `tools/list` and `resources/list`.
2. **Context-Grounded Decision Making**: Reads personal preferences, location constraints (Lucknow, UP), dietary restrictions (Vegetarian), and working hours directly from the `user://profile` resource.
3. **Safety-Gated Execution**: Sensitive mutations (like restaurant table bookings) trigger an automatic confirmation guardrail, pausing agent execution until the user authorizes the action via voice or UI.
4. **Cloud-Native Streamable HTTP**: Built strictly according to the **MCP 2025-11-25 specification draft** over Streamable HTTP (`/mcp`), enabling cloud hosting on AWS ECS Fargate with Server-Sent Events (SSE) and JSON-RPC 2.0 streaming.

---

## ⚡ Key Features

- **Self-Hosted MCP Endpoint (`/mcp`)**: Fully compliant JSON-RPC 2.0 endpoint handling `initialize`, `tools/call`, `resources/read`, and `prompts/get`.
- **Interactive Developer MCP Inspector**: Live protocol monitoring, latency telemetry, interactive tool runner with parameter editor, and copyable cURL commands.
- **Echo Hardware Visualizer**: Multi-state LED light ring (Idle, Listening cyan pulse, Thinking spinning ring, Speaking wave, Confirmation caution amber) with Web Audio synthesized earcons.
- **Voice-Enabled Simulation**: Web Speech recognition + natural voice speech synthesis with zero third-party audio file dependencies.
- **LifeOS Unified Dashboard**: Live calendar schedule, prioritized task queue with checkboxes, groceries checklist, places catalog, and active multi-stop itineraries.
- **Hackathon Submission Kit**: Built-in 3-minute video storyboard, product feedback answers, AWS architecture details, friction logs, and feature requests with one-click copy buttons.

---

## 🏗️ Architecture & Tech Stack

```text
                     User Voice / Text Request
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Amazon Echo      │
                    │  Visualizer & Audio │
                    │   (LED Light Ring)  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Alexa+ Agent Core  │
                    │ (Bedrock / Gemini)  │
                    └──────────┬──────────┘
                               │
                               │ Model Context Protocol (MCP 2025-11-25)
                               │ Streamable HTTP (POST /mcp + GET SSE)
                               ▼
                    ┌─────────────────────┐
                    │   Self-Hosted MCP   │
                    │       Server        │
                    │ (Node.js / Express) │
                    └──────────┬──────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       ▼                       ▼                       ▼
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│  LifeOS Data │        │ Places API / │        │ Safety Ring  │
│  Calendar &  │        │ Curated Hub  │        │ Confirmation │
│ Tasks Engine │        │  (Lucknow)   │        │  Guardrail   │
└──────────────┘        └──────────────┘        └──────────────┘
```

### Component Stack
| Layer | Technology | Purpose |
|---|---|---|
| **MCP Protocol** | MCP Specification 2025-11-25 | Standardized agent-to-tool protocol over Streamable HTTP |
| **Backend & MCP Server** | Node.js, Express, TypeScript, `@modelcontextprotocol/sdk` | Exposes `/mcp`, handles JSON-RPC 2.0, manages sessions & SSE |
| **Frontend Dashboard** | React 19, Vite 8, Tailwind CSS, Lucide Icons | Echo hardware visualizer, LifeOS manager, MCP console |
| **AI / Agent Engine** | Amazon Bedrock (Claude 3.5 Sonnet) / Google Gemini 2.5 Flash | Intent decomposition, tool selection, reasoning, voice synthesis |
| **Audio Synthesis** | Web Audio API + Web Speech API | Dual-tone ascending wake chime, confirmation triad, TTS speech |
| **Database & State** | PostgreSQL / Drizzle ORM / In-Memory Store | Tasks, calendar events, itineraries, places, and audit logs |

---

## 📡 MCP 2025-11-25 Protocol Compliance

The server endpoint is accessible at `/mcp` with full support for the **Streamable HTTP transport**:
- **Headers**:
  - `mcp-session-id`: Persistent session identifier tracking multi-turn context
  - `x-mcp-version`: `2025-11-25`
  - `Content-Type`: `application/json` or `application/x-ndjson`
- **GET `/mcp`**: Server-Sent Events (SSE) stream for bidirectional notifications (`notifications/calendar_updated`, `notifications/tasks_updated`).
- **POST `/mcp`**: JSON-RPC 2.0 dispatch for MCP methods.

### 1. MCP Tools (13)

| MCP Tool Name | Description | Key Arguments |
|---|---|---|
| `get_user_profile` | Retrieves location, diet, budget tier, and working hours | `{}` |
| `get_calendar_events` | Returns today's appointments and meetings | `category?: "work" \| "health" \| "social"` |
| `create_calendar_event` | Schedules meeting with title, start & end time | `title, startTime, endTime, location` |
| `get_tasks` | Returns task queue filtered by status or priority | `status?: "pending" \| "completed" \| "all"` |
| `create_task` | Creates new actionable task with urgency | `title, priority, category, dueDate` |
| `update_task` | Updates task status or title | `id, status, title` |
| `delete_task` | Deletes a task from the list | `id` |
| `create_reminder` | Schedules an intelligent user reminder | `message, time, priority` |
| `search_places` | Searches recommended dining, cafes, and sights | `city, category, vegetarianOnly, maxPrice` |
| `create_itinerary` | Saves structured multi-stop day/weekend plan | `title, date, city, stops, totalBudgetEstimate` |
| `get_shopping_list` | Retrieves current grocery items | `{}` |
| `add_shopping_item` | Adds item to shopping list | `name, quantity, category` |
| `book_reservation` | **High-Impact Action**: Requires user confirmation | `placeName, partySize, time, specialRequests` |

### 2. MCP Resources (5)

| Resource URI | MIME Type | Description |
|---|---|---|
| `user://profile` | `application/json` | User home city, diet, budget constraints, work hours |
| `calendar://today` | `application/json` | Today's appointments and calendar agenda |
| `tasks://pending` | `application/json` | Actionable pending task checklist |
| `shopping://current` | `application/json` | Current groceries list |
| `system://mcp-health` | `application/json` | Server uptime, protocol version, and telemetry |

### 3. MCP Prompts (3)

- `plan_my_day`: Orchestrates calendar appointments, tasks, and dinner discovery.
- `plan_weekend`: Synthesizes cultural and culinary itineraries within user budget.
- `prepare_for_meeting`: Prepares briefing notes and check pending deliverables.

---

## 🚀 Core Agentic Workflows & Demos

### Workflow 1: "Plan My Day" (Flagship Demo)
**User asks**: *"Alexa, plan my day. I have a meeting at 2 PM, remind me to buy groceries, and suggest a good place for dinner."*

1. **Intent Decomposition**: Alexa+ detects three distinct intents: schedule check, errand reminder, and dinner discovery.
2. **MCP Tool Invocations**:
   - `get_calendar_events` ➔ Detects 2 PM *Alexa+ MCP Architecture Review*.
   - `get_tasks` ➔ Identifies pending high-priority items.
   - `get_user_profile` ➔ Reads dietary preference (*Vegetarian*) and budget (*₹₹*).
   - `search_places` ➔ Queries vegetarian dinner options in Lucknow (finds *Royal Cafe* & *Falaknuma Rooftop*).
   - `create_reminder` ➔ Schedules grocery reminder for 6:00 PM.
3. **Synthesis**:
   > *"You have a key meeting at 2:00 PM for the Alexa+ MCP Architecture Review. I've set a reminder to buy groceries at 6:00 PM, and I found three top-rated dinner spots matching your vegetarian preferences: Royal Cafe in Hazratganj and Falaknuma Rooftop. Would you like me to book a table at Royal Cafe for 8:00 PM?"*

### Workflow 2: "Plan My Weekend in Lucknow"
**User asks**: *"Alexa, plan my weekend in Lucknow within ₹2,500 with vegetarian food."*

1. Agent queries `user://profile` to check interests (Heritage walks, Rooftop dining).
2. Calls `search_places` for landmarks and restaurants in Lucknow.
3. Calls `create_itinerary` generating an end-to-end 4-stop Saturday schedule:
   - 09:00 AM — Morning Architectural Walk at Bada Imambara (₹150)
   - 12:30 PM — Royal Awadhi Lunch at Royal Cafe (₹650)
   - 04:30 PM — Sunset Coffee at Gomti Riverfront Promenade (₹400)
   - 08:00 PM — Panoramic Rooftop Dinner at Falaknuma (₹1,000)
   - **Total Estimated Budget**: ₹2,200 (within ₹2,500 limit).

### Workflow 3: Human-in-the-Loop Safety Guardrail
**User asks**: *"Alexa, book a table for 4 at Royal Cafe Hazratganj for 8:00 PM tonight."*

1. Alexa+ classifies table reservation as a **HIGH_IMPACT_TRANSACTION**.
2. Instead of executing immediately, the MCP server returns:
   ```json
   {
     "status": "pending_user_confirmation",
     "requiresConfirmation": true,
     "confirmationDetails": {
       "placeName": "Royal Cafe (Hazratganj)",
       "partySize": 4,
       "time": "08:00 PM",
       "estimatedCost": "₹1,500 - ₹2,000"
     }
   }
   ```
3. The Echo LED ring pulses **amber**.
4. The system awaits explicit voice confirmation or a click on the **"Yes, Confirm Booking"** button before committing the calendar event and reminder.

---

## 🧪 Testing the MCP Server via cURL

You can interact with the self-hosted MCP server directly from your terminal or any external MCP client:

### 1. Initialize MCP Session
```bash
curl -X POST "http://localhost:3000/mcp" \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: sess-001" \
  -H "x-mcp-version: 2025-11-25" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2025-11-25",
      "clientInfo": { "name": "terminal-tester", "version": "1.0.0" }
    }
  }'
```

### 2. List Available Tools
```bash
curl -X POST "http://localhost:3000/mcp" \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: sess-001" \
  -d '{"jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {}}'
```

### 3. Call Tool (`search_places`)
```bash
curl -X POST "http://localhost:3000/mcp" \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: sess-001" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "search_places",
      "arguments": {
        "city": "Lucknow",
        "category": "restaurant",
        "vegetarianOnly": true
      }
    }
  }'
```

### 4. Read Resource (`user://profile`)
```bash
curl -X POST "http://localhost:3000/mcp" \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: sess-001" \
  -d '{
    "jsonrpc": "2.0",
    "id": 4,
    "method": "resources/read",
    "params": { "uri": "user://profile" }
  }'
```

### 5. Test Safety Guardrail (`book_reservation`)
```bash
curl -X POST "http://localhost:3000/mcp" \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: sess-001" \
  -d '{
    "jsonrpc": "2.0",
    "id": 5,
    "method": "tools/call",
    "params": {
      "name": "book_reservation",
      "arguments": {
        "placeName": "Royal Cafe (Hazratganj)",
        "partySize": 4,
        "time": "08:00 PM"
      }
    }
  }'
```

---

## 🔊 Amazon Echo Visualizer & Voice Simulation

The web UI includes an interactive hardware simulation of the Amazon Echo speaker:
- **LED Light Ring States**:
  - 🔵 **Idle**: Dark circular enclosure with subtle ambient edge.
  - 💠 **Listening**: Pulsing cyan and deep blue glow with real-time audio wave equalizer.
  - 🌀 **Thinking**: High-speed spinning gradient indicating MCP tool discovery & execution.
  - 🌊 **Speaking**: Harmonic breathing cyan wave with synthesized voice output.
  - 🟠 **Confirmation**: Flashing amber warning ring indicating a gated high-impact action.
- **Web Audio Chimes**:
  - **Wake Chime**: Dual ascending pure sine wave (440 Hz ➔ 587 Hz).
  - **Confirmation Chime**: Uplifting major triad chord (523 Hz ➔ 659 Hz ➔ 784 Hz).

---

## ☁️ AWS Builder Architecture (Mini Challenge)

For the **AWS Builder Challenge**, this project is architected for enterprise deployment on AWS:

```text
  React Client (CloudFront + S3)
                │
                ▼ HTTPS
   Application Load Balancer (ALB)
                │
                ▼ Streamable HTTP (/mcp)
     AWS ECS Fargate Cluster
  (Node.js / TypeScript MCP Server)
         ├── Amazon Bedrock (Claude 3.5 Sonnet / Agentic Reasoning)
         ├── Amazon RDS PostgreSQL (Persistent LifeOS Store)
         ├── AWS Secrets Manager (API Keys & Credentials)
         └── Amazon CloudWatch (Latency, Metrics & Audit Logs)
```

1. **Amazon Bedrock**: Powers the autonomous reasoning loop, selecting MCP tools from dynamic JSON schemas.
2. **AWS ECS Fargate**: Serverless container execution hosting the Streamable HTTP MCP server with horizontal auto-scaling.
3. **Amazon RDS (PostgreSQL)**: Multi-tenant relational store for user preferences, calendar events, tasks, and audit logs.
4. **Amazon CloudWatch**: Telemetry capturing MCP JSON-RPC call volume, latency percentiles (p95 < 80ms), and error rates.
5. **Amazon S3 + CloudFront**: Global CDN edge distribution for low-latency frontend delivery.

---

## 🌐 Open Source Contribution (Mini Challenge)

- **Project Repository**: [https://github.com/piyushnagbansi500/alexa-plus-lifeos-mcp](https://github.com/piyushnagbansi500/alexa-plus-lifeos-mcp)
- **Contribution PR**: [https://github.com/piyushnagbansi500/alexa-plus-lifeos-mcp/pull/1](https://github.com/piyushnagbansi500/alexa-plus-lifeos-mcp/pull/1)
- **GitHub Username**: `piyushnagbansi500`
- **What We Built**: An end-to-end reference implementation of the **Model Context Protocol (MCP) spec 2025-11-25** over **Streamable HTTP**.
- **Why It Matters**: Most open-source MCP repositories only demonstrate local desktop `stdio` connections (e.g. Claude Desktop). This repository provides a reusable, production-ready blueprint for hosting remote Streamable HTTP MCP servers designed for smart devices, Alexa+ skills, and autonomous agent backends.

---

## 🎬 3-Minute Video Script & Demonstration Guide

| Timecode | Section | Visual & Narration |
|---|---|---|
| **0:00 – 0:20** | **Hook & Problem** | Intro to Alexa+ LifeOS. Explain why MCP 2025-11-25 replaces fragile REST webhooks with standardized, discoverable tool calling over Streamable HTTP. |
| **0:20 – 1:00** | **Flagship Voice Demo** | Voice command: *"Alexa, plan my day. I have a meeting at 2 PM, remind me to buy groceries, and suggest a good place for dinner."* Show Echo LED light ring activating and response synthesizing. |
| **1:00 – 1:45** | **Agent Execution Trace** | Expand the agent trace accordion. Show step-by-step tool chaining: `get_calendar_events` ➔ `get_tasks` ➔ `get_user_profile` ➔ `search_places` ➔ `create_reminder`. |
| **1:45 – 2:20** | **Safety Guardrail** | Ask Alexa+ to *"Book table for 4 at Royal Cafe"*. Show the Echo LED turn amber, execution pause, and confirm button authorization before saving to calendar. |
| **2:20 – 2:45** | **MCP Developer Inspector** | Switch to the MCP Inspector tab. Show live `/mcp` traffic, execute a raw JSON-RPC tool call, and demonstrate the copyable cURL command. |
| **2:45 – 3:00** | **AWS & Open Source Wrap** | Show the AWS ECS Fargate + Bedrock architecture diagram and open-source GitHub repository link. |

---

## 💬 Product Feedback

### 1. Developer Tools, APIs, and SDKs Used
- `@modelcontextprotocol/sdk` (TypeScript v1.32+)
- Amazon Bedrock (Claude 3.5 Sonnet) & Google Gemini 2.5 Flash
- Express.js + tsx + Vite 8
- Web Speech API & Web Audio API

### 2. What Worked Well
- **MCP Tool Definition**: Defining inputs using JSON Schema made argument parsing 100% deterministic with zero hallucinated parameters.
- **Streamable HTTP Transport**: Removing the constraint of local `stdio` processes allows remote cloud servers to operate effortlessly over standard HTTP.
- **Separation of Resources and Tools**: Read-only resources (`user://profile`, `calendar://today`) gave the agent rich context without causing accidental state mutations.

### 3. What Needs Work
- **Session Reconnection in Streamable HTTP**: The 2025-11-25 draft needs clearer standardization for re-attaching dropped SSE client streams during long-running tool calls.
- **Native Protocol-Level Confirmation**: MCP currently treats all tools as immediate executions. Having a standardized `requires_confirmation: true` protocol response would streamline human-in-the-loop workflows across all agent runtimes.
- **Streamable HTTP Documentation**: SDK documentation is still heavily biased toward desktop `stdio`. Clearer reference guides for Streamable HTTP servers are needed.

### 4. Onboarding Experience (Zero to Hello World)
- Setting up the first JSON-RPC dispatcher took roughly 30 minutes. The biggest hurdle was formatting the session headers and SSE stream according to the latest 2025-11-25 draft specifications. Once the live inspector console was built, iteration speed improved 10x.

### 5. Would You Build With These Again?
- **YES**: MCP represents the future of agentic AI. Standardizing how smart devices like Alexa+ query tools will eliminate proprietary skill APIs in favor of an open, interoperable web of agent tools.

---

## ⚠️ Friction Log Entries

### Friction Log 1: Streamable HTTP Transport Negotiation
- **Task Attempted**: Connecting external agent clients to a self-hosted remote MCP server over HTTP without local `stdio`.
- **Steps Taken**: Implemented standard POST JSON-RPC endpoint; sent requests with `Accept: application/json`.
- **Expected vs. Actual**: Expected immediate response; client disconnected because the 2025-11-25 draft expects `mcp-session-id` persistence and GET SSE fallback.
- **Severity**: **Medium**
- **Workaround Used**: Built a dual-mode `/mcp` router supporting both GET (`text/event-stream`) and POST with automatic session ID generation.
- **Actionable Suggestion**: Standardize a single handshake exchange endpoint (`/mcp/session/new`) in the official MCP SDK documentation.

### Friction Log 2: Human-in-the-Loop Confirmation Primitives
- **Task Attempted**: Intercepting and pausing high-impact tool executions (e.g., table reservations) for explicit user approval.
- **Expected vs. Actual**: MCP standard defines `tools/call` as returning either `content` or `isError`. There is no built-in schema for `pending_confirmation`.
- **Severity**: **Important**
- **Workaround Used**: Formatted tool output with `requiresConfirmation: true` and staged parameters in the response payload.
- **Actionable Suggestion**: Add native MCP confirmation primitives (e.g. `status: "authorization_required"`).

---

## 💡 Feature Requests

| Priority | Title | Justification |
|---|---|---|
| **CRITICAL** | **Standardized Human-in-the-Loop Protocol** | Native MCP primitives for action confirmation so voice assistants (Alexa+) can reliably pause sensitive external mutations without custom wrappers. |
| **IMPORTANT** | **Streamable HTTP Session Reconnect** | Standardized session resumption tokens when mobile voice assistants transition between Wi-Fi and cellular networks mid-session. |
| **NICE-TO-HAVE** | **Voice & Audio Modality in MCP** | Support for audio chunk streaming in `tools/call` responses to enable zero-latency voice responses directly from MCP servers. |

---

## 💻 Local Installation & Setup

### Prerequisites
- Node.js 20+
- npm 10+

### 1. Clone Repository
```bash
git clone https://github.com/piyushnagbansi500/alexa-plus-lifeos-mcp.git
cd alexa-plus-lifeos-mcp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your optional Gemini API key or Bedrock credentials in `.env`:
```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
- **Frontend App**: `http://localhost:3000`
- **MCP Server Endpoint**: `http://localhost:3000/mcp`
- **MCP Health Check**: `http://localhost:3000/api/mcp/info`

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 📄 License

This project is licensed under the Apache 2.0 License. See [LICENSE](LICENSE) for details.
