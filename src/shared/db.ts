import {
  CalendarEvent,
  TaskItem,
  ReminderItem,
  PlaceItem,
  ShoppingItem,
  Itinerary,
  UserProfile,
  McpLogEntry,
  LifeOSData
} from '../types/mcp.js';

export type { LifeOSData };

export const initialLifeOSData: LifeOSData = {
  user: {
    name: 'Alex Morgan',
    location: 'Lucknow, UP',
    budgetPreference: '₹₹ (Moderate, under ₹2,500/day)',
    dietaryPreference: 'Vegetarian / Plant-focused',
    workHours: { start: '09:00', end: '18:00' },
    transportMode: 'Cab / Metro',
    interests: ['Heritage walking tours', 'Rooftop cafes', 'Tech meetups', 'Fine dining', 'Photography']
  },
  calendar: [
    {
      id: 'cal-1',
      title: 'Sprint Planning & Standup',
      startTime: '09:30 AM',
      endTime: '10:15 AM',
      location: 'Virtual / Meet',
      category: 'work',
      attendees: ['engineering-team@acme.dev']
    },
    {
      id: 'cal-2',
      title: 'Alexa+ MCP Architecture Review',
      startTime: '02:00 PM',
      endTime: '03:00 PM',
      location: 'Conference Room B / Video Link',
      category: 'work',
      attendees: ['alexa-partners@amazon.com', 'team-leads']
    },
    {
      id: 'cal-3',
      title: 'Evening Badminton Match',
      startTime: '07:30 PM',
      endTime: '08:30 PM',
      location: 'KD Singh Babu Stadium Club',
      category: 'health'
    }
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Finalize MCP 2025-11-25 Streamable HTTP transport spec compliance',
      status: 'pending',
      priority: 'high',
      category: 'work',
      dueDate: 'Today, 5:00 PM'
    },
    {
      id: 'task-2',
      title: 'Review pull request #89: Streamable HTTP session reconnect',
      status: 'pending',
      priority: 'medium',
      category: 'work',
      dueDate: 'Today'
    },
    {
      id: 'task-3',
      title: 'Buy fresh groceries & vegetables',
      status: 'pending',
      priority: 'medium',
      category: 'errands',
      dueDate: 'Evening 6:00 PM'
    },
    {
      id: 'task-4',
      title: 'Verify AWS Bedrock model endpoint permissions',
      status: 'completed',
      priority: 'low',
      category: 'work'
    }
  ],
  reminders: [
    {
      id: 'rem-1',
      message: 'Prepare demo slides for 2 PM Architecture Review',
      time: '01:30 PM',
      priority: 'urgent',
      completed: false
    },
    {
      id: 'rem-2',
      message: 'Pick up organic almond milk and fresh bread from store',
      time: '06:00 PM',
      priority: 'normal',
      completed: false
    }
  ],
  places: [
    {
      id: 'plc-1',
      name: 'Royal Cafe (Hazratganj)',
      category: 'restaurant',
      city: 'Lucknow',
      rating: 4.8,
      priceLevel: '₹₹',
      cuisine: 'Awadhi & North Indian (Famous Basket Chaat & Veg Thali)',
      address: 'Hazratganj Market, MG Marg, Lucknow',
      vegetarian: true,
      reservationRequired: false
    },
    {
      id: 'plc-2',
      name: 'Falaknuma Rooftop Restaurant',
      category: 'restaurant',
      city: 'Lucknow',
      rating: 4.9,
      priceLevel: '₹₹₹',
      cuisine: 'Fine Dining Awadhi Mughlai & Live Sitar',
      address: 'Clarks Avadh Hotel, 8 MG Marg, Lucknow',
      vegetarian: true,
      reservationRequired: true
    },
    {
      id: 'plc-3',
      name: 'Cafe De L’Amour',
      category: 'cafe',
      city: 'Lucknow',
      rating: 4.7,
      priceLevel: '₹₹',
      cuisine: 'Artisanal Coffee & Continental Bakery',
      address: 'Gomti Nagar Phase 2, Lucknow',
      vegetarian: true,
      reservationRequired: false
    },
    {
      id: 'plc-4',
      name: 'Gomti Riverfront Promenade',
      category: 'attraction',
      city: 'Lucknow',
      rating: 4.6,
      priceLevel: '₹',
      cuisine: 'Open Promenade, Musical Fountain & Sunset Stroll',
      address: 'Vipin Khand, Gomti Nagar, Lucknow',
      vegetarian: true,
      reservationRequired: false
    },
    {
      id: 'plc-5',
      name: 'Bada Imambara & Asfi Mosque',
      category: 'attraction',
      city: 'Lucknow',
      rating: 4.9,
      priceLevel: '₹',
      cuisine: 'Historical Mughal Architecture & Bhool Bhulaiya Maze',
      address: 'Husainabad, Old City, Lucknow',
      vegetarian: true,
      reservationRequired: false
    },
    {
      id: 'plc-6',
      name: 'Oudhyana at Vivanta',
      category: 'restaurant',
      city: 'Lucknow',
      rating: 4.9,
      priceLevel: '₹₹₹',
      cuisine: 'Royal Nawabi Gourmet Dining',
      address: 'Vipin Khand, Gomti Nagar, Lucknow',
      vegetarian: true,
      reservationRequired: true
    }
  ],
  shopping: [
    { id: 'shop-1', name: 'Fresh organic spinach', quantity: '2 bunches', category: 'produce', checked: false },
    { id: 'shop-2', name: 'Almond milk (unsweetened)', quantity: '1 carton', category: 'dairy', checked: false },
    { id: 'shop-3', name: 'Sourdough loaf', quantity: '1 loaf', category: 'pantry', checked: false },
    { id: 'shop-4', name: 'Fair-trade coffee beans', quantity: '250g', category: 'pantry', checked: true }
  ],
  itineraries: [
    {
      id: 'itin-1',
      title: 'Heritage & Gastronomy Weekend in Lucknow',
      date: 'Upcoming Saturday',
      city: 'Lucknow',
      totalBudgetEstimate: '₹2,200',
      stops: [
        {
          time: '09:00 AM',
          title: 'Morning Architectural Walk at Bada Imambara',
          description: 'Explore the monumental gateway and historical labyrinth with scenic viewpoint.',
          location: 'Husainabad, Old Lucknow',
          costEstimate: '₹150 ticket'
        },
        {
          time: '12:30 PM',
          title: 'Authentic Lunch at Royal Cafe',
          description: 'Enjoy famous vegetarian Basket Chaat and specialty Nawabi curries.',
          location: 'Hazratganj Market',
          costEstimate: '₹650'
        },
        {
          time: '04:30 PM',
          title: 'Sunset Coffee & Stroll at Gomti Riverfront',
          description: 'Relax with artisanal espresso at Cafe De L’Amour followed by riverfront walk.',
          location: 'Gomti Nagar Promenade',
          costEstimate: '₹400'
        },
        {
          time: '08:00 PM',
          title: 'Panoramic Rooftop Dinner at Falaknuma',
          description: 'Traditional Awadhi vegetarian banquet overlooking the illuminated river.',
          location: 'Clarks Avadh, MG Marg',
          costEstimate: '₹1,000'
        }
      ]
    }
  ],
  logs: []
};

// In-memory state singleton for node server & local state
class DatabaseStore {
  private data: LifeOSData;

  constructor() {
    this.data = JSON.parse(JSON.stringify(initialLifeOSData));
  }

  getSnapshot(): LifeOSData {
    return this.data;
  }

  getUserProfile(): UserProfile {
    return this.data.user;
  }

  updateUserProfile(profile: Partial<UserProfile>): UserProfile {
    this.data.user = { ...this.data.user, ...profile };
    return this.data.user;
  }

  getCalendarEvents(): CalendarEvent[] {
    return this.data.calendar;
  }

  addCalendarEvent(event: Omit<CalendarEvent, 'id'>): CalendarEvent {
    const newEvent: CalendarEvent = {
      ...event,
      id: 'cal-' + Date.now().toString(36)
    };
    this.data.calendar.push(newEvent);
    return newEvent;
  }

  getTasks(status?: 'pending' | 'completed' | 'all'): TaskItem[] {
    if (!status || status === 'all') return this.data.tasks;
    return this.data.tasks.filter((t) => t.status === status);
  }

  addTask(task: Omit<TaskItem, 'id'>): TaskItem {
    const newTask: TaskItem = {
      ...task,
      id: 'task-' + Date.now().toString(36)
    };
    this.data.tasks.unshift(newTask);
    return newTask;
  }

  updateTask(id: string, updates: Partial<TaskItem>): TaskItem | null {
    const index = this.data.tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;
    this.data.tasks[index] = { ...this.data.tasks[index], ...updates };
    return this.data.tasks[index];
  }

  deleteTask(id: string): boolean {
    const initialLen = this.data.tasks.length;
    this.data.tasks = this.data.tasks.filter((t) => t.id !== id);
    return this.data.tasks.length < initialLen;
  }

  getReminders(): ReminderItem[] {
    return this.data.reminders;
  }

  addReminder(reminder: Omit<ReminderItem, 'id' | 'completed'>): ReminderItem {
    const newReminder: ReminderItem = {
      ...reminder,
      id: 'rem-' + Date.now().toString(36),
      completed: false
    };
    this.data.reminders.push(newReminder);
    return newReminder;
  }

  searchPlaces(query: { city?: string; category?: string; vegetarianOnly?: boolean; maxPrice?: string }): PlaceItem[] {
    return this.data.places.filter((p) => {
      if (query.city && !p.city.toLowerCase().includes(query.city.toLowerCase())) return false;
      if (query.category && p.category !== query.category) return false;
      if (query.vegetarianOnly && !p.vegetarian) return false;
      return true;
    });
  }

  getShoppingList(): ShoppingItem[] {
    return this.data.shopping;
  }

  addShoppingItem(item: Omit<ShoppingItem, 'id' | 'checked'>): ShoppingItem {
    const newItem: ShoppingItem = {
      ...item,
      id: 'shop-' + Date.now().toString(36),
      checked: false
    };
    this.data.shopping.push(newItem);
    return newItem;
  }

  toggleShoppingItem(id: string): ShoppingItem | null {
    const item = this.data.shopping.find((s) => s.id === id);
    if (!item) return null;
    item.checked = !item.checked;
    return item;
  }

  getItineraries(): Itinerary[] {
    return this.data.itineraries;
  }

  addItinerary(itinerary: Omit<Itinerary, 'id'>): Itinerary {
    const newItin: Itinerary = {
      ...itinerary,
      id: 'itin-' + Date.now().toString(36)
    };
    this.data.itineraries.unshift(newItin);
    return newItin;
  }

  addLog(log: Omit<McpLogEntry, 'id' | 'timestamp'>): McpLogEntry {
    const entry: McpLogEntry = {
      ...log,
      id: 'log-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString()
    };
    this.data.logs.unshift(entry);
    if (this.data.logs.length > 200) {
      this.data.logs.pop();
    }
    return entry;
  }

  getLogs(): McpLogEntry[] {
    return this.data.logs;
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(initialLifeOSData));
  }
}

export const dbStore = new DatabaseStore();
