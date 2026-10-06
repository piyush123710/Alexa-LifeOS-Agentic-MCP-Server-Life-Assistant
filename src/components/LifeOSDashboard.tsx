import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  CheckSquare,
  Clock,
  MapPin,
  ShoppingBag,
  User,
  Compass,
  Plus,
  Trash2,
  CheckCircle,
  Tag,
  DollarSign
} from 'lucide-react';
import { LifeOSData } from '../shared/db.js';

interface LifeOSDashboardProps {
  data: LifeOSData;
  onRefresh: () => void;
  onAddTask: (title: string, priority: 'low' | 'medium' | 'high') => void;
  onToggleTask: (id: string, currentStatus: 'pending' | 'completed') => void;
  onToggleShopping: (id: string) => void;
  onAddShoppingItem: (name: string, quantity: string) => void;
}

export const LifeOSDashboard: React.FC<LifeOSDashboardProps> = ({
  data,
  onRefresh,
  onAddTask,
  onToggleTask,
  onToggleShopping,
  onAddShoppingItem
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'tasks' | 'places' | 'itineraries' | 'profile'>('overview');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newShoppingName, setNewShoppingName] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask(newTaskTitle.trim(), 'medium');
    setNewTaskTitle('');
  };

  const handleCreateShopping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShoppingName.trim()) return;
    onAddShoppingItem(newShoppingName.trim(), '1 item');
    setNewShoppingName('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md">
      {/* Top Tab Bar */}
      <div className="px-5 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'calendar'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Calendar ({data.calendar.length})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'tasks'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Tasks ({data.tasks.filter((t) => t.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('places')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'places'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Places ({data.places.length})
          </button>
          <button
            onClick={() => setActiveTab('itineraries')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'itineraries'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Itineraries ({data.itineraries.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'profile'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            User Context
          </button>
        </div>

        <button
          onClick={onRefresh}
          className="text-[11px] text-slate-400 hover:text-cyan-300 transition-colors font-mono"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Header Greeting & Summary */}
            <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Good day, {data.user.name} 👋
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Location: <span className="text-cyan-400">{data.user.location}</span> • Diet: <span className="text-emerald-400">{data.user.dietaryPreference}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-medium">
                  {data.calendar.length} Events Today
                </span>
                <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-medium">
                  {data.tasks.filter((t) => t.status === 'pending').length} Tasks Pending
                </span>
                <span className="px-2.5 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-lg text-xs font-medium">
                  {data.reminders.length} Active Reminders
                </span>
              </div>
            </div>

            {/* Quick 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Today's Schedule Card */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
                    <CalendarIcon className="w-4 h-4 text-cyan-400" />
                    <span>Today's Calendar Schedule</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">Synced with MCP</span>
                </div>

                <div className="space-y-2 flex-1">
                  {data.calendar.map((event) => (
                    <div
                      key={event.id}
                      className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-200">{event.title}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          <span>{event.startTime} - {event.endTime}</span>
                          {event.location && (
                            <>
                              <span>•</span>
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span className="truncate max-w-[140px]">{event.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] rounded uppercase font-semibold ${
                        event.category === 'work' ? 'bg-blue-500/20 text-blue-300' :
                        event.category === 'health' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-500/20 text-purple-300'
                      }`}>
                        {event.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks Card */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                    <span>Priority Tasks Queue</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">Checked via Voice</span>
                </div>

                <div className="space-y-2 flex-1">
                  {data.tasks.slice(0, 4).map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onToggleTask(task.id, task.status)}
                      className={`p-2.5 rounded-lg border flex items-center justify-between text-xs cursor-pointer transition-colors ${
                        task.status === 'completed'
                          ? 'bg-slate-950/40 border-slate-900 text-slate-500 line-through'
                          : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={task.status === 'completed'}
                          onChange={() => {}}
                          className="rounded text-cyan-500 focus:ring-0 bg-slate-800 border-slate-700"
                        />
                        <span>{task.title}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        task.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                        task.priority === 'medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reminders & Shopping Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Reminders */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-semibold text-purple-300 mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-400" /> Active Reminders (Auto-created by Alexa+)
                </h4>
                <div className="space-y-2">
                  {data.reminders.map((rem) => (
                    <div key={rem.id} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                      <div className="text-slate-200">
                        <span>{rem.message}</span>
                        <div className="text-[10px] text-purple-400 mt-0.5">Triggers at {rem.time}</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                        {rem.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shopping checklist */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-semibold text-teal-300 mb-2 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-teal-400" /> Groceries & Shopping List
                </h4>
                <div className="space-y-1.5">
                  {data.shopping.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onToggleShopping(item.id)}
                      className={`p-2 rounded-lg border text-xs flex items-center justify-between cursor-pointer ${
                        item.checked ? 'bg-slate-950/30 border-slate-900 text-slate-500 line-through' : 'bg-slate-900 border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={item.checked} onChange={() => {}} className="rounded bg-slate-800" />
                        <span>{item.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CALENDAR TAB */}
        {activeTab === 'calendar' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-cyan-400" />
                Calendar Schedule (Synchronized via MCP get_calendar_events)
              </h3>
            </div>
            <div className="grid gap-3">
              {data.calendar.map((event) => (
                <div key={event.id} className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-100 text-sm">{event.title}</h4>
                    <p className="text-xs text-cyan-400 font-mono mt-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {event.startTime} - {event.endTime}
                    </p>
                    {event.location && (
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {event.location}
                      </p>
                    )}
                    {event.attendees && (
                      <p className="text-[11px] text-slate-500 mt-1">
                        Attendees: {event.attendees.join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="px-2.5 py-1 text-xs rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase font-semibold">
                    {event.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TASKS TAB */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                Tasks Manager (get_tasks / create_task / update_task)
              </h3>
            </div>

            <form onSubmit={handleCreateTask} className="flex gap-2">
              <input
                type="text"
                placeholder="Add new task (e.g. Schedule AWS deployment review)..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Task
              </button>
            </form>

            <div className="space-y-2">
              {data.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id, task.status)}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                    task.status === 'completed'
                      ? 'bg-slate-950/40 border-slate-900 text-slate-500 line-through'
                      : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={task.status === 'completed'} onChange={() => {}} className="rounded bg-slate-800 text-emerald-500" />
                    <div>
                      <span className="font-medium">{task.title}</span>
                      {task.dueDate && <div className="text-[10px] text-slate-500 font-mono mt-0.5">Due: {task.dueDate}</div>}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] rounded uppercase font-bold ${
                    task.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                    task.priority === 'medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PLACES TAB */}
        {activeTab === 'places' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              Places & Recommendations (search_places tool database)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.places.map((place) => (
                <div key={place.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-100 text-sm">{place.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{place.cuisine}</p>
                    </div>
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-0.5">
                      ★ {place.rating}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>{place.address}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-semibold">
                      {place.vegetarian ? '🌱 Vegetarian-friendly' : 'Non-veg'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">
                      {place.priceLevel}
                    </span>
                    {place.reservationRequired && (
                      <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded">
                        Reservation Recommended
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ITINERARIES TAB */}
        {activeTab === 'itineraries' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              Curated Itineraries (Generated by create_itinerary tool)
            </h3>
            {data.itineraries.map((itin) => (
              <div key={itin.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">{itin.title}</h4>
                    <span className="text-xs text-cyan-400">{itin.city} • {itin.date}</span>
                  </div>
                  {itin.totalBudgetEstimate && (
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-mono font-semibold">
                      Est. {itin.totalBudgetEstimate}
                    </span>
                  )}
                </div>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {itin.stops.map((stop, sIdx) => (
                    <div key={sIdx} className="relative text-xs">
                      <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-cyan-500 ring-4 ring-slate-950" />
                      <div className="font-semibold text-slate-200">
                        {stop.time} — {stop.title}
                      </div>
                      <p className="text-slate-400 mt-0.5">{stop.description}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 font-mono">
                        <span>📍 {stop.location}</span>
                        {stop.costEstimate && <span>💰 {stop.costEstimate}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-4 max-w-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              User Context Profile (user://profile MCP Resource)
            </h3>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">User Name:</span>
                <span className="text-slate-200 font-semibold">{data.user.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Primary Location:</span>
                <span className="text-slate-200 font-semibold">{data.user.location}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Dietary Preferences:</span>
                <span className="text-emerald-400 font-semibold">{data.user.dietaryPreference}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Budget Constraint:</span>
                <span className="text-slate-200 font-semibold">{data.user.budgetPreference}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Standard Work Hours:</span>
                <span className="text-slate-200 font-mono">{data.user.workHours.start} - {data.user.workHours.end}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1.5">Interests & Hobbies:</span>
                <div className="flex flex-wrap gap-1.5">
                  {data.user.interests.map((interest, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
