import { Request, Response } from 'express';
import { dbStore } from '../shared/db.js';
import { McpTool, McpResource, McpPrompt } from '../types/mcp.js';

export const MCP_SPEC_VERSION = '2025-11-25';
export const SERVER_NAME = 'alexa-plus-lifeos-mcp';
export const SERVER_VERSION = '1.0.0';

export const MCP_TOOLS: McpTool[] = [
  {
    name: 'get_user_profile',
    description: 'Retrieve user preferences including home location, dietary preferences, budget tier, and working hours.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_calendar_events',
    description: 'Retrieve upcoming calendar events and meetings scheduled for the user today or a specified date.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Optional filter by category',
          enum: ['work', 'personal', 'health', 'social']
        }
      }
    }
  },
  {
    name: 'create_calendar_event',
    description: 'Schedule a new calendar event or meeting with title, start and end time, and optional location.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Title or subject of the meeting' },
        startTime: { type: 'string', description: 'Start time string e.g. "02:00 PM"' },
        endTime: { type: 'string', description: 'End time string e.g. "03:00 PM"' },
        location: { type: 'string', description: 'Meeting link or physical address' },
        category: {
          type: 'string',
          description: 'Event category',
          enum: ['work', 'personal', 'health', 'social']
        }
      },
      required: ['title', 'startTime', 'endTime']
    }
  },
  {
    name: 'get_tasks',
    description: 'Get task checklist items, optionally filtered by status (pending or completed) and priority.',
    inputSchema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          description: 'Filter by task status',
          enum: ['pending', 'completed', 'all']
        }
      }
    }
  },
  {
    name: 'create_task',
    description: 'Create a new actionable task item with priority and due date.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Task description' },
        priority: {
          type: 'string',
          description: 'Priority level',
          enum: ['low', 'medium', 'high']
        },
        category: {
          type: 'string',
          description: 'Category',
          enum: ['work', 'errands', 'personal']
        },
        dueDate: { type: 'string', description: 'Due date or time string' }
      },
      required: ['title']
    }
  },
  {
    name: 'update_task',
    description: 'Update an existing task status (e.g. mark completed) or details.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Task ID' },
        status: {
          type: 'string',
          description: 'New status',
          enum: ['pending', 'completed']
        },
        title: { type: 'string', description: 'Updated title' }
      },
      required: ['id']
    }
  },
  {
    name: 'delete_task',
    description: 'Remove a task from the list.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Task ID to delete' }
      },
      required: ['id']
    }
  },
  {
    name: 'create_reminder',
    description: 'Create an intelligent alert / reminder for the user at a specified time.',
    inputSchema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Reminder text' },
        time: { type: 'string', description: 'Trigger time string e.g. "06:00 PM"' },
        priority: {
          type: 'string',
          description: 'Priority urgency',
          enum: ['normal', 'urgent']
        }
      },
      required: ['message', 'time']
    }
  },
  {
    name: 'search_places',
    description: 'Search recommended restaurants, cafes, and attractions matching user preferences (vegetarian, budget, city).',
    inputSchema: {
      type: 'object',
      properties: {
        city: { type: 'string', description: 'City name e.g. "Lucknow"' },
        category: {
          type: 'string',
          description: 'Place category',
          enum: ['restaurant', 'cafe', 'attraction', 'park']
        },
        vegetarianOnly: { type: 'boolean', description: 'Filter only vegetarian-friendly places' },
        maxPrice: { type: 'string', description: 'Maximum price level e.g. "₹₹"' }
      }
    }
  },
  {
    name: 'create_itinerary',
    description: 'Generate and save a multi-stop customized day or weekend itinerary with schedule and estimated cost.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Itinerary title' },
        date: { type: 'string', description: 'Date or day e.g. "Saturday"' },
        city: { type: 'string', description: 'City name e.g. "Lucknow"' },
        totalBudgetEstimate: { type: 'string', description: 'Total cost budget estimate' },
        stops: {
          type: 'array',
          description: 'Ordered sequence of stops',
          items: {
            type: 'object'
          }
        }
      },
      required: ['title', 'date', 'city', 'stops']
    }
  },
  {
    name: 'get_shopping_list',
    description: 'Retrieve items in the grocery and shopping list.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'add_shopping_item',
    description: 'Add an item to the shopping list with quantity and category.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Item name' },
        quantity: { type: 'string', description: 'Quantity e.g. "1 litre", "2 bunches"' },
        category: {
          type: 'string',
          description: 'Department',
          enum: ['produce', 'dairy', 'pantry', 'household']
        }
      },
      required: ['name']
    }
  },
  {
    name: 'book_reservation',
    description: 'High-Impact Action: Reserve a table at a venue or restaurant. Requires user confirmation guardrail.',
    inputSchema: {
      type: 'object',
      properties: {
        placeName: { type: 'string', description: 'Name of restaurant or venue' },
        partySize: { type: 'number', description: 'Number of guests' },
        time: { type: 'string', description: 'Reservation time e.g. "08:00 PM"' },
        specialRequests: { type: 'string', description: 'Dietary or seating preferences' }
      },
      required: ['placeName', 'partySize', 'time']
    }
  }
];

export const MCP_RESOURCES: McpResource[] = [
  {
    uri: 'user://profile',
    name: 'User LifeOS Profile',
    description: 'Contains current user location, diet, budget, work hours, and preferences.',
    mimeType: 'application/json'
  },
  {
    uri: 'calendar://today',
    name: "Today's Calendar Schedule",
    description: 'Current day meetings, agenda and appointments.',
    mimeType: 'application/json'
  },
  {
    uri: 'tasks://pending',
    name: 'Pending Tasks Queue',
    description: 'All unresolved action items and deadlines.',
    mimeType: 'application/json'
  },
  {
    uri: 'shopping://current',
    name: 'Shopping Checklist',
    description: 'Current grocery list items.',
    mimeType: 'application/json'
  },
  {
    uri: 'system://mcp-health',
    name: 'MCP Server Health & Capabilities',
    description: 'Streamable HTTP transport health, specs and telemetry.',
    mimeType: 'application/json'
  }
];

export const MCP_PROMPTS: McpPrompt[] = [
  {
    name: 'plan_my_day',
    description: 'Synthesizes calendar appointments, high-priority tasks, and recommends optimal dinner/leisure times.',
    arguments: [
      { name: 'focusArea', description: 'Specific goal for the day (e.g. Deep Work, Errands)', required: false }
    ]
  },
  {
    name: 'plan_weekend',
    description: 'Designs an end-to-end weekend itinerary matching user budget, dietary restrictions, and city culture.',
    arguments: [
      { name: 'city', description: 'Target city', required: false },
      { name: 'budget', description: 'Max budget limit', required: false }
    ]
  },
  {
    name: 'prepare_for_meeting',
    description: 'Prepares briefing notes and check pending deliverables for the next calendar event.',
    arguments: [
      { name: 'meetingTitle', description: 'Meeting name to prepare for', required: true }
    ]
  }
];

// Active SSE client connections for Streamable HTTP
const sseClients = new Map<string, Response>();

export function getMcpSessionId(req: Request): string {
  const headerId = req.headers['mcp-session-id'] as string;
  if (headerId && typeof headerId === 'string' && headerId.trim()) {
    return headerId.trim();
  }
  return 'sess_' + Math.random().toString(36).substring(2, 11);
}

export function broadcastMcpNotification(method: string, params: Record<string, unknown>) {
  const message = `event: message\ndata: ${JSON.stringify({ jsonrpc: '2.0', method, params })}\n\n`;
  sseClients.forEach((res) => {
    try {
      res.write(message);
    } catch {
      // client disconnected
    }
  });
}

// Execute an MCP tool against dbStore
export async function executeTool(name: string, args: Record<string, unknown>): Promise<{ content: Array<{ type: 'text'; text: string }>; isError?: boolean; requiresConfirmation?: boolean; confirmationDetails?: Record<string, unknown> }> {
  try {
    switch (name) {
      case 'get_user_profile': {
        const profile = dbStore.getUserProfile();
        return {
          content: [{ type: 'text', text: JSON.stringify(profile, null, 2) }]
        };
      }

      case 'get_calendar_events': {
        const events = dbStore.getCalendarEvents();
        const filtered = args.category
          ? events.filter((e) => e.category === args.category)
          : events;
        return {
          content: [{ type: 'text', text: JSON.stringify(filtered, null, 2) }]
        };
      }

      case 'create_calendar_event': {
        const { title, startTime, endTime, location, category } = args as {
          title: string;
          startTime: string;
          endTime: string;
          location?: string;
          category?: 'work' | 'personal' | 'health' | 'social';
        };
        const created = dbStore.addCalendarEvent({
          title,
          startTime,
          endTime,
          location: location || 'TBD',
          category: category || 'personal'
        });
        broadcastMcpNotification('notifications/calendar_updated', { event: created });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Calendar event "${created.title}" scheduled for ${created.startTime}`, event: created }, null, 2)
            }
          ]
        };
      }

      case 'get_tasks': {
        const status = args.status as 'pending' | 'completed' | 'all' | undefined;
        const tasks = dbStore.getTasks(status);
        return {
          content: [{ type: 'text', text: JSON.stringify(tasks, null, 2) }]
        };
      }

      case 'create_task': {
        const { title, priority, category, dueDate } = args as {
          title: string;
          priority?: 'low' | 'medium' | 'high';
          category?: 'work' | 'errands' | 'personal';
          dueDate?: string;
        };
        const task = dbStore.addTask({
          title,
          priority: priority || 'medium',
          category: category || 'work',
          dueDate: dueDate || 'Today',
          status: 'pending'
        });
        broadcastMcpNotification('notifications/tasks_updated', { task });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Task "${task.title}" created with ${task.priority} priority`, task }, null, 2)
            }
          ]
        };
      }

      case 'update_task': {
        const { id, status, title } = args as { id: string; status?: 'pending' | 'completed'; title?: string };
        const updated = dbStore.updateTask(id, {
          ...(status ? { status } : {}),
          ...(title ? { title } : {})
        });
        if (!updated) {
          return {
            isError: true,
            content: [{ type: 'text', text: `Task ID ${id} not found.` }]
          };
        }
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, updated }, null, 2) }]
        };
      }

      case 'delete_task': {
        const { id } = args as { id: string };
        const deleted = dbStore.deleteTask(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: deleted, message: deleted ? `Task ${id} deleted` : `Task ${id} not found` }, null, 2)
            }
          ]
        };
      }

      case 'create_reminder': {
        const { message, time, priority } = args as {
          message: string;
          time: string;
          priority?: 'normal' | 'urgent';
        };
        const reminder = dbStore.addReminder({
          message,
          time,
          priority: priority || 'normal'
        });
        broadcastMcpNotification('notifications/reminders_updated', { reminder });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Reminder set for ${reminder.time}: "${reminder.message}"`, reminder }, null, 2)
            }
          ]
        };
      }

      case 'search_places': {
        const { city, category, vegetarianOnly, maxPrice } = args as {
          city?: string;
          category?: string;
          vegetarianOnly?: boolean;
          maxPrice?: string;
        };
        const results = dbStore.searchPlaces({
          city: city || 'Lucknow',
          category,
          vegetarianOnly: vegetarianOnly ?? true,
          maxPrice
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ total: results.length, places: results }, null, 2)
            }
          ]
        };
      }

      case 'create_itinerary': {
        const itin = args as unknown as {
          title: string;
          date: string;
          city: string;
          stops: Array<{ time: string; title: string; description: string; location: string; costEstimate?: string }>;
          totalBudgetEstimate?: string;
        };
        const created = dbStore.addItinerary(itin);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Itinerary "${created.title}" successfully created for ${created.city}`, itinerary: created }, null, 2)
            }
          ]
        };
      }

      case 'get_shopping_list': {
        const list = dbStore.getShoppingList();
        return {
          content: [{ type: 'text', text: JSON.stringify(list, null, 2) }]
        };
      }

      case 'add_shopping_item': {
        const { name: itemName, quantity, category } = args as {
          name: string;
          quantity?: string;
          category?: 'produce' | 'dairy' | 'pantry' | 'household';
        };
        const item = dbStore.addShoppingItem({
          name: itemName,
          quantity: quantity || '1 unit',
          category: category || 'produce'
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Added "${item.name}" to shopping list`, item }, null, 2)
            }
          ]
        };
      }

      case 'book_reservation': {
        const { placeName, partySize, time, specialRequests } = args as {
          placeName: string;
          partySize: number;
          time: string;
          specialRequests?: string;
        };
        // Safety guardrail for high-impact action:
        // Marks requiresConfirmation flag in MCP tool call response
        return {
          requiresConfirmation: true,
          confirmationDetails: {
            placeName,
            partySize,
            time,
            specialRequests: specialRequests || 'Vegetarian table by the window',
            estimatedCost: '₹1,500 - ₹2,000'
          },
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'pending_user_confirmation',
                message: `Table reservation request staged for ${partySize} guests at ${placeName} for ${time}. Awaiting user voice/UI confirmation.`,
                requiresConfirmation: true
              }, null, 2)
            }
          ]
        };
      }

      default:
        return {
          isError: true,
          content: [{ type: 'text', text: `Unknown tool "${name}". Call tools/list to see available tools.` }]
        };
    }
  } catch (err) {
    return {
      isError: true,
      content: [{ type: 'text', text: `Tool execution failed: ${(err as Error).message}` }]
    };
  }
}

// Read resource
export function readResource(uri: string): { contents: Array<{ uri: string; mimeType: string; text: string }> } | { error: string } {
  switch (uri) {
    case 'user://profile':
    case 'user://preferences':
      return {
        contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(dbStore.getUserProfile(), null, 2) }]
      };
    case 'calendar://today':
      return {
        contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(dbStore.getCalendarEvents(), null, 2) }]
      };
    case 'tasks://pending':
      return {
        contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(dbStore.getTasks('pending'), null, 2) }]
      };
    case 'shopping://current':
      return {
        contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(dbStore.getShoppingList(), null, 2) }]
      };
    case 'system://mcp-health':
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(
              {
                status: 'healthy',
                protocolVersion: MCP_SPEC_VERSION,
                transport: 'Streamable HTTP (SSE + POST JSON-RPC 2.0)',
                toolsCount: MCP_TOOLS.length,
                resourcesCount: MCP_RESOURCES.length,
                promptsCount: MCP_PROMPTS.length,
                server: { name: SERVER_NAME, version: SERVER_VERSION },
                uptimeSeconds: Math.floor(process.uptime()),
                timestamp: new Date().toISOString()
              },
              null,
              2
            )
          }
        ]
      };
    default:
      return { error: `Resource not found: ${uri}` };
  }
}

// Get prompt
export function getPrompt(name: string, args: Record<string, string> = {}): { description?: string; messages: Array<{ role: string; content: { type: string; text: string } }> } | { error: string } {
  switch (name) {
    case 'plan_my_day':
      return {
        description: 'Plan the user schedule and optimize tasks',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Please plan my day. Focus: ${args.focusArea || 'General productivity & balance'}. Check calendar://today and tasks://pending, and suggest dinner options matching user://profile.`
            }
          }
        ]
      };
    case 'plan_weekend':
      return {
        description: 'Plan a cultural and culinary weekend',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Plan my upcoming weekend in ${args.city || 'Lucknow'} with a budget limit of ${args.budget || '₹2,500'}. Discover top spots, align with dietary preferences, and generate a structured itinerary.`
            }
          }
        ]
      };
    case 'prepare_for_meeting':
      return {
        description: 'Prepare meeting briefing',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Prepare briefing notes for meeting: "${args.meetingTitle}". Retrieve attendee context and pending related tasks.`
            }
          }
        ]
      };
    default:
      return { error: `Prompt not found: ${name}` };
  }
}

// Process a JSON-RPC 2.0 MCP request
export async function processMcpJsonRpc(
  body: Record<string, unknown>,
  sessionId: string
): Promise<{ response: Record<string, unknown>; status: number; toolName?: string }> {
  const startTime = Date.now();
  const id = body.id;
  const method = body.method as string;
  const params = (body.params as Record<string, unknown>) || {};

  if (!method) {
    return {
      status: 400,
      response: {
        jsonrpc: '2.0',
        id: id ?? null,
        error: { code: -32600, message: 'Invalid Request: missing method' }
      }
    };
  }

  let result: unknown = null;
  let error: { code: number; message: string; data?: unknown } | null = null;
  let toolName: string | undefined;

  switch (method) {
    case 'initialize': {
      result = {
        protocolVersion: MCP_SPEC_VERSION,
        capabilities: {
          tools: { listChanged: true },
          resources: { subscribe: true, listChanged: true },
          prompts: { listChanged: true },
          logging: {},
          experimental: {
            streamableHttp: true,
            safetyConfirmations: true,
            alexaPlusEngine: true
          }
        },
        serverInfo: {
          name: SERVER_NAME,
          version: SERVER_VERSION
        },
        instructions:
          'Welcome to Alexa+ LifeOS MCP Server (2025-11-25 Streamable HTTP). Use tools/list to inspect available life management tools. Read user://profile for personal preferences and restrictions before scheduling.'
      };
      break;
    }

    case 'notifications/initialized': {
      // Client notification
      result = {};
      break;
    }

    case 'ping': {
      result = {};
      break;
    }

    case 'tools/list': {
      result = { tools: MCP_TOOLS };
      break;
    }

    case 'tools/call': {
      const callParams = params as { name: string; arguments?: Record<string, unknown> };
      if (!callParams.name) {
        error = { code: -32602, message: 'Invalid params: missing tool name' };
      } else {
        toolName = callParams.name;
        const toolRes = await executeTool(callParams.name, callParams.arguments || {});
        result = toolRes;
      }
      break;
    }

    case 'resources/list': {
      result = { resources: MCP_RESOURCES };
      break;
    }

    case 'resources/read': {
      const readParams = params as { uri: string };
      if (!readParams.uri) {
        error = { code: -32602, message: 'Invalid params: missing uri' };
      } else {
        const readRes = readResource(readParams.uri);
        if ('error' in readRes) {
          error = { code: -32602, message: readRes.error };
        } else {
          result = readRes;
        }
      }
      break;
    }

    case 'prompts/list': {
      result = { prompts: MCP_PROMPTS };
      break;
    }

    case 'prompts/get': {
      const promptParams = params as { name: string; arguments?: Record<string, string> };
      if (!promptParams.name) {
        error = { code: -32602, message: 'Invalid params: missing prompt name' };
      } else {
        const promptRes = getPrompt(promptParams.name, promptParams.arguments || {});
        if ('error' in promptRes) {
          error = { code: -32602, message: promptRes.error };
        } else {
          result = promptRes;
        }
      }
      break;
    }

    default: {
      error = { code: -32601, message: `Method not found: ${method}` };
      break;
    }
  }

  const latencyMs = Date.now() - startTime;
  const isSuccess = !error;

  // Record audit log
  dbStore.addLog({
    sessionId,
    method,
    toolName,
    direction: 'outbound',
    payload: {
      request: body,
      response: error ? { error } : { result }
    },
    latencyMs,
    status: isSuccess ? 'success' : 'error'
  });

  if (error) {
    return {
      status: 200, // JSON-RPC errors return 200 with error object
      toolName,
      response: {
        jsonrpc: '2.0',
        id: id ?? null,
        error
      }
    };
  }

  return {
    status: 200,
    toolName,
    response: {
      jsonrpc: '2.0',
      id: id ?? null,
      result
    }
  };
}

// Handle HTTP requests to /mcp (Streamable HTTP)
export async function handleMcpHttpRequest(req: Request, res: Response) {
  const sessionId = getMcpSessionId(req);
  res.setHeader('mcp-session-id', sessionId);
  res.setHeader('x-mcp-version', MCP_SPEC_VERSION);

  // SSE Stream subscription (GET /mcp with text/event-stream)
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    sseClients.set(sessionId, res);

    // Initial greeting SSE event
    res.write(`event: endpoint\ndata: ${JSON.stringify({ endpoint: '/mcp', sessionId, spec: MCP_SPEC_VERSION })}\n\n`);

    req.on('close', () => {
      sseClients.delete(sessionId);
    });
    return;
  }

  // POST handler for Streamable HTTP JSON-RPC 2.0
  if (req.method === 'POST') {
    const body = req.body;
    if (!body || typeof body !== 'object') {
      res.status(400).json({
        jsonrpc: '2.0',
        id: null,
        error: { code: -32700, message: 'Parse error: body must be JSON object' }
      });
      return;
    }

    // Check if client requested Streamable chunked response (NDJSON or SSE)
    const acceptHeader = req.headers['accept'] || '';
    if (acceptHeader.includes('application/x-ndjson')) {
      res.setHeader('Content-Type', 'application/x-ndjson');
      const { response } = await processMcpJsonRpc(body as Record<string, unknown>, sessionId);
      res.write(JSON.stringify(response) + '\n');
      res.end();
      return;
    }

    const { response, status } = await processMcpJsonRpc(body as Record<string, unknown>, sessionId);
    res.status(status).json(response);
    return;
  }

  res.status(405).json({ error: 'Method Not Allowed. Use GET for SSE or POST for JSON-RPC 2.0' });
}
