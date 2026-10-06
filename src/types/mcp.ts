export interface McpTool {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description?: string;
      enum?: string[];
      items?: Record<string, unknown>;
    }>;
    required?: string[];
  };
}

export interface McpResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface McpPrompt {
  name: string;
  description?: string;
  arguments?: {
    name: string;
    description?: string;
    required?: boolean;
  }[];
}

export interface McpLogEntry {
  id: string;
  timestamp: string;
  sessionId: string;
  method: string;
  toolName?: string;
  direction: 'inbound' | 'outbound';
  payload: Record<string, unknown>;
  latencyMs: number;
  status: 'success' | 'error' | 'pending';
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  category: 'work' | 'personal' | 'health' | 'social';
  attendees?: string[];
}

export interface TaskItem {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: 'work' | 'errands' | 'personal';
  dueDate?: string;
}

export interface ReminderItem {
  id: string;
  message: string;
  time: string;
  priority: 'normal' | 'urgent';
  completed: boolean;
}

export interface PlaceItem {
  id: string;
  name: string;
  category: 'restaurant' | 'cafe' | 'attraction' | 'park';
  city: string;
  rating: number;
  priceLevel: '$' | '$$' | '$$$' | '₹' | '₹₹' | '₹₹₹';
  cuisine?: string;
  address: string;
  vegetarian: boolean;
  reservationRequired: boolean;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: 'produce' | 'dairy' | 'pantry' | 'household';
  checked: boolean;
}

export interface ItineraryStop {
  time: string;
  title: string;
  description: string;
  location: string;
  costEstimate?: string;
}

export interface Itinerary {
  id: string;
  title: string;
  date: string;
  city: string;
  stops: ItineraryStop[];
  totalBudgetEstimate?: string;
}

export interface UserProfile {
  name: string;
  location: string;
  budgetPreference: string;
  dietaryPreference: string;
  workHours: { start: string; end: string };
  transportMode: string;
  interests: string[];
}

export interface AgentStep {
  id: string;
  type: 'thought' | 'tool_call' | 'tool_result' | 'confirmation_required' | 'synthesis';
  title: string;
  content: string;
  toolName?: string;
  toolArgs?: Record<string, unknown>;
  toolOutput?: unknown;
  timestamp: string;
  durationMs?: number;
}

export interface ConfirmationRequest {
  id: string;
  action: string;
  details: Record<string, unknown>;
  message: string;
  riskLevel: 'medium' | 'high';
  resolve: (confirmed: boolean) => void;
}

export interface LifeOSData {
  user: UserProfile;
  calendar: CalendarEvent[];
  tasks: TaskItem[];
  reminders: ReminderItem[];
  places: PlaceItem[];
  shopping: ShoppingItem[];
  itineraries: Itinerary[];
  logs: McpLogEntry[];
}
