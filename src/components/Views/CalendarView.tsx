import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Video,
  MapPin,
  Bell,
  X,
  CheckCircle2,
  AlertCircle,
  Tag,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CalendarEvent } from '../../types';

export const CalendarView: React.FC = () => {
  const { events, addEvent, deleteEvent } = useApp();

  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isNewEventModalOpen, setNewEventModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState(() => currentDate.toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [category, setCategory] = useState<CalendarEvent['category']>('meeting');
  const [color, setColor] = useState('#6D5DF6');
  const [description, setDescription] = useState('');
  const [isMeeting, setIsMeeting] = useState(true);
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/abc-defg-hij');
  const [location, setLocation] = useState('Conference Room 1');

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addEvent({
      title: title.trim(),
      date: eventDate,
      startTime,
      endTime,
      category,
      color,
      description,
      isMeeting,
      meetingLink: isMeeting ? meetingLink : undefined,
      location,
      reminderMinutes: 15,
    });

    setTitle('');
    setDescription('');
    setNewEventModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-7 h-7 text-indigo-500" />
            <span>Calendar & Schedule</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Time block your calendar, track meetings, and manage schedule milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900/80 p-1 rounded-2xl border border-slate-200 dark:border-white/10 text-xs font-bold">
            {(['month', 'week', 'day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3.5 py-1.5 rounded-xl capitalize transition-all cursor-pointer ${
                  viewMode === mode
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={() => setNewEventModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Schedule Event</span>
          </button>
        </div>
      </div>

      {/* Grid: Calendar + Agenda Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Month View */}
        <div className="lg:col-span-3 glass-card p-6 flex flex-col space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{monthName}</h2>

            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Today
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Month Days Grid */}
          {viewMode === 'month' && (
            <div className="space-y-3">
              {/* Weekday headers */}
              <div className="grid grid-cols-7 text-center font-bold text-xs text-slate-400 uppercase tracking-wider py-1 border-b border-slate-200/80 dark:border-white/10">
                <span>SUN</span>
                <span>MON</span>
                <span>TUE</span>
                <span>WED</span>
                <span>THU</span>
                <span>FRI</span>
                <span>SAT</span>
              </div>

              {/* Days cells */}
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-24 sm:h-28 rounded-2xl bg-slate-100/40 dark:bg-slate-900/20 border border-slate-200/40 dark:border-white/5 opacity-40" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                  const isToday = dateStr === todayStr;

                  const cellDate = new Date(year, month, dayNum);
                  const dayNameShort = cellDate.toLocaleDateString('en-US', { weekday: 'short' });

                  const dayEvents = events.filter((e) => e.date === dateStr);

                  return (
                    <div
                      key={`day-${dayNum}`}
                      className={`h-24 sm:h-28 rounded-2xl p-2.5 border transition-all flex flex-col justify-between overflow-hidden ${
                        isToday
                          ? 'border-2 border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                          : 'border-slate-200/80 dark:border-white/10 bg-slate-100/60 dark:bg-slate-900/40 hover:border-indigo-500/40'
                      }`}
                    >
                      <div className="flex flex-col items-start gap-0.5">
                        <span
                          className={`text-sm font-black leading-none ${
                            isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {dayNum}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                          {dayNameShort}
                        </span>
                      </div>

                      <div className="space-y-1 overflow-y-auto max-h-16 no-scrollbar mt-1">
                        {dayEvents.map((ev) => (
                          <div
                            key={ev.id}
                            style={{ backgroundColor: ev.color, color: '#FFFFFF' }}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs truncate"
                          >
                            {ev.startTime} {ev.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(viewMode === 'week' || viewMode === 'day') && (
            <div className="p-12 text-center space-y-3 bg-slate-100/60 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-white/5">
              <CalendarIcon className="w-10 h-10 text-indigo-500 mx-auto" />
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white capitalize">
                {viewMode} Agenda Schedule
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                All events for this period are highlighted in your right agenda column for easy time blocking.
              </p>
            </div>
          )}
        </div>

        {/* Right Agenda Sidebar */}
        <div className="glass-card p-6 flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-3">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>Today's Agenda</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">{todayStr}</span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px]">
            {events.filter((e) => e.date === todayStr).length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No scheduled events for today.</p>
            ) : (
              events
                .filter((e) => e.date === todayStr)
                .map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/5 space-y-2 relative group"
                  >
                    <div className="flex items-start justify-between">
                      <span
                        style={{ backgroundColor: ev.color }}
                        className="text-[10px] font-extrabold text-white px-2.5 py-0.5 rounded-full"
                      >
                        {ev.category.toUpperCase()}
                      </span>
                      <button
                        onClick={() => deleteEvent(ev.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{ev.title}</h4>

                    <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                      <p className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
                        <Clock className="w-3.5 h-3.5" /> {ev.startTime} - {ev.endTime}
                      </p>

                      {ev.isMeeting && ev.meetingLink && (
                        <a
                          href={ev.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-blue-500 hover:underline font-bold"
                        >
                          <Video className="w-3.5 h-3.5" /> Join Google Meet
                        </a>
                      )}

                      {ev.location && (
                        <p className="flex items-center gap-1.5 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {ev.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Schedule Event Modal */}
      {isNewEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md glass-panel border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Schedule Calendar Event</h3>
              <button onClick={() => setNewEventModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold uppercase">Event Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q3 Roadmap Sync"
                  className="w-full p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold uppercase">Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold uppercase">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="work">Work</option>
                    <option value="study">Study</option>
                    <option value="personal">Personal</option>
                    <option value="holiday">Holiday</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold uppercase">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold uppercase">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200/80 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setNewEventModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  Save Event
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
