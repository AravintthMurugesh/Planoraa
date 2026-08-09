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
  X,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CalendarEvent, CalendarEventCategory } from '../../types';
import { EVENT_CATEGORY_META, EVENT_CATEGORIES } from '../../lib/meta';
import { cn, todayISO } from '../../lib/utils';

type ViewMode = 'month' | 'week' | 'day';

export const CalendarView: React.FC = () => {
  const { events, addEvent, deleteEvent } = useApp();

  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isNewEventModalOpen, setNewEventModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState(() => todayISO());
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [category, setCategory] = useState<CalendarEventCategory>('meeting');
  const [color, setColor] = useState('#6D5DF6');
  const [description, setDescription] = useState('');
  const [isMeeting, setIsMeeting] = useState(true);
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/abc-defg-hij');
  const [location, setLocation] = useState('Conference Room 1');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const todayStr = todayISO();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

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

  const todayAgenda = events
    .filter((e) => e.date === todayStr)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-6 pb-12">
      {/* ---------- Header ---------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-7 h-7 text-[var(--accent-color)]" />
            <span>Calendar & Schedule</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Time block your calendar, track meetings, and manage schedule milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-slate-900/80 p-1 rounded-2xl border border-slate-200 dark:border-white/10 text-xs font-bold">
            {(['month', 'week', 'day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl capitalize transition-all cursor-pointer btn-press',
                  viewMode === mode
                    ? 'bg-[var(--accent-color)] text-white shadow-md shadow-[var(--accent-soft)]'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={() => setNewEventModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-hover)] hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-[var(--accent-soft)] btn-press flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Schedule Event</span>
          </button>
        </div>
      </div>

      {/* ---------- Layout ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar card */}
        <div className="lg:col-span-3 glass-card p-6 flex flex-col space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {monthName}
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer btn-press"
                title="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer btn-press"
              >
                Today
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer btn-press"
                title="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {viewMode === 'month' && (
            <div className="space-y-3">
              <div className="grid grid-cols-7 text-center font-bold text-xs text-slate-400 uppercase tracking-wider py-1 border-b border-slate-200/80 dark:border-white/10">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="h-24 sm:h-28 rounded-2xl bg-slate-100/40 dark:bg-slate-900/20 border border-slate-200/40 dark:border-white/5 opacity-40"
                  />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                  const isToday = dateStr === todayStr;
                  const dayEvents = events.filter((e) => e.date === dateStr);

                  return (
                    <motion.div
                      key={`day-${dayNum}`}
                      whileHover={{ y: -2 }}
                      className={cn(
                        'h-24 sm:h-28 rounded-2xl p-2.5 border transition-all flex flex-col justify-between overflow-hidden cursor-pointer',
                        isToday
                          ? 'border-2 border-[var(--accent-color)] bg-[var(--accent-soft)] shadow-lg shadow-[var(--accent-soft)]'
                          : 'border-slate-200/80 dark:border-white/10 bg-slate-100/60 dark:bg-slate-900/40 hover:border-[var(--accent-color)]/40'
                      )}
                    >
                      <div className="flex flex-col items-start gap-0.5">
                        <span
                          className={cn(
                            'text-sm font-black leading-none',
                            isToday ? 'text-[var(--accent-color)]' : 'text-slate-900 dark:text-white'
                          )}
                        >
                          {dayNum}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                          {new Date(year, month, dayNum).toLocaleDateString('en-US', {
                            weekday: 'short',
                          })}
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
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {(viewMode === 'week' || viewMode === 'day') && (
            <div className="p-12 text-center space-y-3 bg-slate-100/60 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-white/5">
              <CalendarIcon className="w-10 h-10 text-[var(--accent-color)] mx-auto" />
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white capitalize">
                {viewMode} Agenda Schedule
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                All events for this period are highlighted in your right agenda column for easy
                time blocking.
              </p>
            </div>
          )}
        </div>

        {/* Agenda */}
        <div className="glass-card p-6 flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-3">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--accent-color)]" />
              <span>Today's Agenda</span>
            </h3>
            <span className="text-xs font-bold text-slate-400 tabular-nums">{todayStr}</span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] no-scrollbar">
            {todayAgenda.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6 text-[var(--accent-color)]" />
                </div>
                <p className="text-xs text-slate-400 font-semibold">
                  No scheduled events for today.
                </p>
              </div>
            ) : (
              todayAgenda.map((ev) => (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/5 space-y-2 relative group border-l-4"
                  style={{ borderLeftColor: ev.color }}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-extrabold text-white px-2.5 py-0.5 rounded-full" style={{ backgroundColor: ev.color }}>
                      {EVENT_CATEGORY_META[ev.category].label.toUpperCase()}
                    </span>
                    <button
                      onClick={() => deleteEvent(ev.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors cursor-pointer"
                      title="Delete event"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{ev.title}</h4>

                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <p className="flex items-center gap-1.5 font-bold text-[var(--accent-color)]">
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
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ---------- New Event Modal ---------- */}
      <AnimatePresence>
        {isNewEventModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-md glass-panel border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--accent-color)]" />
                  Schedule Calendar Event
                </h3>
                <button
                  onClick={() => setNewEventModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold uppercase">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Q3 Roadmap Sync"
                    className="w-full p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50"
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
                      onChange={(e) => setCategory(e.target.value as CalendarEventCategory)}
                      className="w-full p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold"
                    >
                      {EVENT_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {EVENT_CATEGORY_META[c].label}
                        </option>
                      ))}
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
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-hover)] text-white font-bold shadow-md shadow-[var(--accent-soft)] btn-press cursor-pointer"
                  >
                    Save Event
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};