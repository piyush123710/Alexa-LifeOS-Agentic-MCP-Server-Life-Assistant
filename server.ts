import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  handleMcpHttpRequest,
  MCP_TOOLS,
  MCP_RESOURCES,
  MCP_PROMPTS,
  MCP_SPEC_VERSION,
  executeTool
} from './src/server/mcpServer.js';
import { dbStore } from './src/shared/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// Enable CORS for MCP interoperability
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, mcp-session-id, x-mcp-version, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

// Official MCP Endpoint: Streamable HTTP (spec 2025-11-25)
app.all('/mcp', (req: Request, res: Response) => {
  handleMcpHttpRequest(req, res);
});

// MCP Server Health & Metadata
app.get('/api/mcp/info', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    protocol: MCP_SPEC_VERSION,
    transport: 'Streamable HTTP (JSON-RPC 2.0 / SSE)',
    endpoint: '/mcp',
    server: {
      name: 'alexa-plus-lifeos-mcp',
      version: '1.0.0'
    },
    toolsCount: MCP_TOOLS.length,
    resourcesCount: MCP_RESOURCES.length,
    promptsCount: MCP_PROMPTS.length
  });
});

app.get('/api/mcp/tools', (_req: Request, res: Response) => {
  res.json({ tools: MCP_TOOLS });
});

app.get('/api/mcp/resources', (_req: Request, res: Response) => {
  res.json({ resources: MCP_RESOURCES });
});

app.get('/api/mcp/prompts', (_req: Request, res: Response) => {
  res.json({ prompts: MCP_PROMPTS });
});

app.get('/api/mcp/logs', (_req: Request, res: Response) => {
  res.json({ logs: dbStore.getLogs() });
});

// LifeOS State Endpoints
app.get('/api/lifeos/snapshot', (_req: Request, res: Response) => {
  res.json(dbStore.getSnapshot());
});

app.post('/api/lifeos/reset', (_req: Request, res: Response) => {
  dbStore.reset();
  res.json({ success: true, message: 'Database reset to initial demo state.' });
});

// Direct Tool Execution API (for quick inspector & UI triggers)
app.post('/api/mcp/execute', async (req: Request, res: Response) => {
  const { toolName, args } = req.body;
  if (!toolName) {
    res.status(400).json({ error: 'Missing toolName' });
    return;
  }
  const result = await executeTool(toolName, args || {});
  res.json(result);
});

// AI Agent Orchestration Endpoint (Simulates Alexa+ Agentic Core)
app.post('/api/agent/orchestrate', async (req: Request, res: Response) => {
  const { query, confirmedAction } = req.body;
  if (!query && !confirmedAction) {
    res.status(400).json({ error: 'Missing query' });
    return;
  }

  const steps: Array<{
    id: string;
    type: 'thought' | 'tool_call' | 'tool_result' | 'confirmation_required' | 'synthesis';
    title: string;
    content: string;
    toolName?: string;
    toolArgs?: Record<string, unknown>;
    toolOutput?: unknown;
    timestamp: string;
    durationMs?: number;
  }> = [];

  const addStep = (step: Omit<typeof steps[0], 'id' | 'timestamp'>) => {
    steps.push({
      ...step,
      id: 'step-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString()
    });
  };

  // If user is confirming a high-impact action previously gated
  if (confirmedAction) {
    addStep({
      type: 'thought',
      title: 'Human-in-the-Loop Confirmation Received',
      content: `User confirmed authorization for high-impact action: ${confirmedAction.placeName || 'Reservation'}`
    });

    addStep({
      type: 'tool_call',
      title: 'Executing Confirmed Action',
      content: `Invoking booking API on behalf of user`,
      toolName: 'book_reservation',
      toolArgs: confirmedAction
    });

    // Add reminder and calendar item for the confirmed reservation
    const resvEvent = dbStore.addCalendarEvent({
      title: `Dinner Reservation @ ${confirmedAction.placeName}`,
      startTime: confirmedAction.time || '08:00 PM',
      endTime: '09:30 PM',
      location: confirmedAction.placeName,
      category: 'social'
    });

    const resvReminder = dbStore.addReminder({
      message: `Head out for table reservation at ${confirmedAction.placeName} (${confirmedAction.partySize} guests)`,
      time: '07:15 PM',
      priority: 'urgent'
    });

    addStep({
      type: 'tool_result',
      title: 'Reservation Confirmed & Synced',
      content: `Calendar event and reminder synced into LifeOS`,
      toolName: 'book_reservation',
      toolOutput: { event: resvEvent, reminder: resvReminder }
    });

    const finalSpeech = `All set! I've reserved a table for ${confirmedAction.partySize} at ${confirmedAction.placeName} for ${confirmedAction.time}. I've also added it to your calendar and set a reminder for 7:15 PM so you have plenty of time to get there.`;

    addStep({
      type: 'synthesis',
      title: 'Alexa+ Voice Response',
      content: finalSpeech
    });

    res.json({
      speechText: finalSpeech,
      steps,
      snapshot: dbStore.getSnapshot()
    });
    return;
  }

  const queryLower = (query || '').toLowerCase();

  // Pattern A: "Plan my day" / Daily schedule + tasks + dinner
  if (queryLower.includes('plan my day') || (queryLower.includes('meeting') && queryLower.includes('dinner'))) {
    addStep({
      type: 'thought',
      title: 'Analyzing Intent: Comprehensive Day Planner',
      content: 'User requested a daily plan integrating calendar schedule, grocery errand reminder, and dinner suggestions matching personal preferences.'
    });

    // Step 1: get_calendar_events
    addStep({
      type: 'tool_call',
      title: 'MCP Tool: get_calendar_events',
      content: 'Querying upcoming appointments for today',
      toolName: 'get_calendar_events',
      toolArgs: {}
    });
    const calStart = Date.now();
    const calEvents = dbStore.getCalendarEvents();
    addStep({
      type: 'tool_result',
      title: 'Calendar Retrieved',
      content: `Found ${calEvents.length} calendar appointments`,
      toolName: 'get_calendar_events',
      toolOutput: calEvents,
      durationMs: Date.now() - calStart
    });

    // Step 2: get_tasks
    addStep({
      type: 'tool_call',
      title: 'MCP Tool: get_tasks',
      content: 'Retrieving pending high & medium priority tasks',
      toolName: 'get_tasks',
      toolArgs: { status: 'pending' }
    });
    const taskStart = Date.now();
    const tasks = dbStore.getTasks('pending');
    addStep({
      type: 'tool_result',
      title: 'Tasks Retrieved',
      content: `Found ${tasks.length} pending tasks`,
      toolName: 'get_tasks',
      toolOutput: tasks,
      durationMs: Date.now() - taskStart
    });

    // Step 3: get_user_profile
    addStep({
      type: 'tool_call',
      title: 'MCP Resource: user://profile',
      content: 'Reading user preferences for dietary restrictions, budget, and location',
      toolName: 'get_user_profile',
      toolArgs: {}
    });
    const profile = dbStore.getUserProfile();
    addStep({
      type: 'tool_result',
      title: 'Profile Context Loaded',
      content: `Location: ${profile.location} | Diet: ${profile.dietaryPreference} | Budget: ${profile.budgetPreference}`,
      toolName: 'get_user_profile',
      toolOutput: profile
    });

    // Step 4: search_places
    addStep({
      type: 'tool_call',
      title: 'MCP Tool: search_places',
      content: 'Finding vegetarian dinner recommendations in Lucknow',
      toolName: 'search_places',
      toolArgs: { city: 'Lucknow', category: 'restaurant', vegetarianOnly: true }
    });
    const places = dbStore.searchPlaces({ city: 'Lucknow', category: 'restaurant', vegetarianOnly: true });
    addStep({
      type: 'tool_result',
      title: 'Places Discovered',
      content: `Found ${places.length} matching dining spots`,
      toolName: 'search_places',
      toolOutput: places
    });

    // Step 5: create_reminder for groceries
    addStep({
      type: 'tool_call',
      title: 'MCP Tool: create_reminder',
      content: 'Scheduling reminder to pick up groceries at 6:00 PM',
      toolName: 'create_reminder',
      toolArgs: { message: 'Pick up groceries from supermarket', time: '06:00 PM', priority: 'normal' }
    });
    const reminder = dbStore.addReminder({
      message: 'Pick up groceries from supermarket',
      time: '06:00 PM',
      priority: 'normal'
    });
    addStep({
      type: 'tool_result',
      title: 'Reminder Created',
      content: `Reminder activated for 6:00 PM`,
      toolName: 'create_reminder',
      toolOutput: reminder
    });

    // Step 6: Synthesis
    const speechText = `You have a key meeting at 2:00 PM for the Alexa+ MCP Architecture Review. I've set a reminder to buy groceries at 6:00 PM, and I found three top-rated dinner spots matching your vegetarian preferences: Royal Cafe in Hazratganj and Falaknuma Rooftop. Would you like me to book a table at Royal Cafe for 8:00 PM?`;

    addStep({
      type: 'synthesis',
      title: 'Alexa+ Voice Response',
      content: speechText
    });

    res.json({
      speechText,
      steps,
      snapshot: dbStore.getSnapshot(),
      suggestedNextAction: {
        type: 'book_reservation',
        prompt: 'Book Royal Cafe table for 4',
        details: { placeName: 'Royal Cafe (Hazratganj)', partySize: 4, time: '08:00 PM' }
      }
    });
    return;
  }

  // Pattern B: "Plan my weekend in Lucknow"
  if (queryLower.includes('weekend') || queryLower.includes('lucknow') || queryLower.includes('trip') || queryLower.includes('itinerary')) {
    addStep({
      type: 'thought',
      title: 'Analyzing Intent: Multi-Stop Weekend Experience',
      content: 'User wants an optimized weekend itinerary in Lucknow within budget, matching cultural and dietary interests.'
    });

    // Step 1: get_user_profile
    addStep({
      type: 'tool_call',
      title: 'MCP Tool: get_user_profile',
      content: 'Checking interests and spending constraints',
      toolName: 'get_user_profile',
      toolArgs: {}
    });
    const profile = dbStore.getUserProfile();
    addStep({
      type: 'tool_result',
      title: 'Preferences Evaluated',
      content: `Interests: ${profile.interests.join(', ')} | Budget: ${profile.budgetPreference}`,
      toolName: 'get_user_profile',
      toolOutput: profile
    });

    // Step 2: search_places
    addStep({
      type: 'tool_call',
      title: 'MCP Tool: search_places',
      content: 'Discovering heritage attractions and top-rated cafes',
      toolName: 'search_places',
      toolArgs: { city: 'Lucknow' }
    });
    const allPlaces = dbStore.searchPlaces({ city: 'Lucknow' });
    addStep({
      type: 'tool_result',
      title: 'Venues Selected',
      content: `Selected 4 landmark stops: Bada Imambara, Royal Cafe, Gomti Riverfront, and Falaknuma Rooftop`,
      toolName: 'search_places',
      toolOutput: allPlaces
    });

    // Step 3: create_itinerary
    addStep({
      type: 'tool_call',
      title: 'MCP Tool: create_itinerary',
      content: 'Structuring timeline and budget allocations',
      toolName: 'create_itinerary',
      toolArgs: {
        title: 'Lucknow Heritage & Gourmet Weekend',
        city: 'Lucknow',
        date: 'Saturday & Sunday',
        totalBudgetEstimate: '₹2,200'
      }
    });

    const itin = dbStore.addItinerary({
      title: 'Lucknow Heritage & Gourmet Weekend',
      date: 'This Weekend',
      city: 'Lucknow',
      totalBudgetEstimate: '₹2,200',
      stops: [
        {
          time: '09:00 AM',
          title: 'Heritage Walk at Bada Imambara',
          description: 'Historical landmark and iconic Mughal labyrinth.',
          location: 'Husainabad, Old Lucknow',
          costEstimate: '₹150'
        },
        {
          time: '12:30 PM',
          title: 'Royal Awadhi Lunch at Royal Cafe',
          description: 'Famous vegetarian Basket Chaat & specialty curries.',
          location: 'Hazratganj Market',
          costEstimate: '₹650'
        },
        {
          time: '04:30 PM',
          title: 'Sunset Coffee at Cafe De L’Amour & Riverfront Promenade',
          description: 'Artisanal espresso followed by scenic sunset stroll.',
          location: 'Gomti Riverfront',
          costEstimate: '₹400'
        },
        {
          time: '08:00 PM',
          title: 'Falaknuma Rooftop Dinner',
          description: 'Vegetarian Nawabi cuisine with live classical sitar.',
          location: 'Clarks Avadh Hotel',
          costEstimate: '₹1,000'
        }
      ]
    });

    addStep({
      type: 'tool_result',
      title: 'Itinerary Saved to LifeOS',
      content: `Created 4-stop itinerary with total estimate ₹2,200 (within budget)`,
      toolName: 'create_itinerary',
      toolOutput: itin
    });

    const speechText = `I've created your weekend itinerary for Lucknow with a total estimate of ₹2,200, well within your budget. Your Saturday starts at 9:00 AM at Bada Imambara, followed by lunch at Royal Cafe, sunset coffee along the Gomti Riverfront, and rooftop dining at Falaknuma. Would you like me to reserve the evening rooftop table?`;

    addStep({
      type: 'synthesis',
      title: 'Alexa+ Voice Response',
      content: speechText
    });

    res.json({
      speechText,
      steps,
      snapshot: dbStore.getSnapshot(),
      suggestedNextAction: {
        type: 'book_reservation',
        prompt: 'Reserve table at Falaknuma Rooftop',
        details: { placeName: 'Falaknuma Rooftop Restaurant', partySize: 2, time: '08:00 PM' }
      }
    });
    return;
  }

  // Pattern C: Book reservation (triggers Safety Guardrail!)
  if (queryLower.includes('book') || queryLower.includes('reserve') || queryLower.includes('table')) {
    addStep({
      type: 'thought',
      title: 'Classifying Action Sensitivity',
      content: 'Detected high-impact transaction: Restaurant Table Reservation. Initiating safety confirmation guardrail before committing.'
    });

    const placeName = queryLower.includes('falaknuma') ? 'Falaknuma Rooftop Restaurant' : 'Royal Cafe (Hazratganj)';
    const partySize = 4;
    const time = '08:00 PM';

    addStep({
      type: 'tool_call',
      title: 'MCP Tool: book_reservation (Safety Guardrail)',
      content: `Evaluating reservation parameters: ${partySize} guests at ${placeName} for ${time}`,
      toolName: 'book_reservation',
      toolArgs: { placeName, partySize, time }
    });

    const guardrailDetails = {
      placeName,
      partySize,
      time,
      specialRequests: 'Vegetarian table by the window',
      estimatedCost: '₹1,500 - ₹2,000',
      riskTier: 'HIGH_IMPACT_TRANSACTION'
    };

    addStep({
      type: 'confirmation_required',
      title: 'Human-in-the-Loop Confirmation Required',
      content: `Alexa+ paused execution. Staged booking: table for ${partySize} at ${placeName} for ${time}. Awaiting user approval.`,
      toolName: 'book_reservation',
      toolOutput: guardrailDetails
    });

    const speechText = `I found a table for ${partySize} at ${placeName} for ${time} tonight. Would you like me to confirm this booking?`;

    addStep({
      type: 'synthesis',
      title: 'Alexa+ Voice Confirmation Prompt',
      content: speechText
    });

    res.json({
      speechText,
      steps,
      requiresConfirmation: true,
      confirmationDetails: guardrailDetails,
      snapshot: dbStore.getSnapshot()
    });
    return;
  }

  // Pattern D: "What do I need to finish today?" / Tasks inquiry
  if (queryLower.includes('task') || queryLower.includes('todo') || queryLower.includes('finish')) {
    addStep({
      type: 'thought',
      title: 'Querying LifeOS Tasks Queue',
      content: 'Retrieving pending deliverables and deadline items.'
    });

    addStep({
      type: 'tool_call',
      title: 'MCP Tool: get_tasks',
      content: 'Filtering pending tasks by urgency',
      toolName: 'get_tasks',
      toolArgs: { status: 'pending' }
    });

    const pending = dbStore.getTasks('pending');

    addStep({
      type: 'tool_result',
      title: 'Pending Tasks Retrieved',
      content: `Found ${pending.length} pending tasks`,
      toolName: 'get_tasks',
      toolOutput: pending
    });

    const taskTitles = pending.map((t, idx) => `${idx + 1}. ${t.title} (${t.priority} priority)`).join(', ');
    const speechText = `You currently have ${pending.length} pending tasks: ${taskTitles}. Your top priority is finalizing the MCP 2025-11-25 Streamable HTTP transport spec compliance.`;

    addStep({
      type: 'synthesis',
      title: 'Alexa+ Voice Response',
      content: speechText
    });

    res.json({
      speechText,
      steps,
      snapshot: dbStore.getSnapshot()
    });
    return;
  }

  // Pattern E: "Remind me to..." or adding a task
  if (queryLower.includes('remind me to') || queryLower.includes('reminder')) {
    const messageMatch = query.replace(/alexa,?\s*/i, '').replace(/remind me to\s*/i, '');
    const reminder = dbStore.addReminder({
      message: messageMatch || 'Follow up on important task',
      time: '05:00 PM',
      priority: 'normal'
    });

    addStep({
      type: 'tool_call',
      title: 'MCP Tool: create_reminder',
      content: `Registering reminder for: ${reminder.message}`,
      toolName: 'create_reminder',
      toolArgs: { message: reminder.message, time: '05:00 PM' }
    });

    addStep({
      type: 'tool_result',
      title: 'Reminder Created',
      content: `Reminder scheduled for ${reminder.time}`,
      toolName: 'create_reminder',
      toolOutput: reminder
    });

    const speechText = `Sure thing! I've set a reminder for 5:00 PM: "${reminder.message}".`;
    addStep({
      type: 'synthesis',
      title: 'Alexa+ Voice Response',
      content: speechText
    });

    res.json({
      speechText,
      steps,
      snapshot: dbStore.getSnapshot()
    });
    return;
  }

  // Fallback: Use Gemini API if configured or intelligent conversational agent
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are Alexa+, an advanced agentic voice assistant powered by the Model Context Protocol (MCP spec 2025-11-25) and LifeOS.
The user asked: "${query}".
User location: Lucknow. Dietary: Vegetarian.
Respond in a friendly, proactive, concise voice assistant tone (2-3 sentences max) noting how you can orchestrate tasks, calendar, reminders, and places via MCP.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const speech = response.text || "I'm here to help manage your day, schedule calendar events, and discover places with Alexa+ LifeOS.";
      addStep({
        type: 'synthesis',
        title: 'Alexa+ Intelligent Response',
        content: speech
      });

      res.json({
        speechText: speech,
        steps,
        snapshot: dbStore.getSnapshot()
      });
      return;
    }
  } catch (err) {
    console.warn('Gemini fallback error, using local agent:', err);
  }

  // Graceful fallback response
  const speechText = `I'm Alexa+, powered by the 2025-11-25 MCP Streamable HTTP protocol. You can ask me to "Plan my day", "Plan my weekend in Lucknow", "What tasks do I have today?", or "Book a table for dinner".`;
  addStep({
    type: 'synthesis',
    title: 'Alexa+ Voice Response',
    content: speechText
  });

  res.json({
    speechText,
    steps,
    snapshot: dbStore.getSnapshot()
  });
});

// Setup Vite middleware in development or serve static build in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Alexa+ LifeOS MCP Server running on http://0.0.0.0:${port}`);
    console.log(`📡 MCP 2025-11-25 Streamable HTTP endpoint: http://0.0.0.0:${port}/mcp`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
