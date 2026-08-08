import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Plus, MapPin, User, Sparkles, X, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DayOfWeek, TimetableSlot } from '../../types';

export const TimetableView: React.FC = () => {
  const { timetable, addTimetableSlot, deleteTimetableSlot } = useApp();

  const [isAddModalOpen, setAddModalOpen] = useState(false);

  // Form State
  const [day, setDay] = useState<DayOfWeek>('mon');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [subject, setSubject] = useState('');
  const [room, setRoom] = useState('Hall 101');
  const [teacher, setTeacher] = useState('Dr. Smith');
  const [color, setColor] = useState('#6D5DF6');
  const [type, setType] = useState<TimetableSlot['type']>('class');

  const days: { id: DayOfWeek; label: string }[] = [
    { id: 'mon', label: 'Monday' },
    { id: 'tue', label: 'Tuesday' },
    { id: 'wed', label: 'Wednesday' },
    { id: 'thu', label: 'Thursday' },
    { id: 'fri', label: 'Friday' },
    { id: 'sat', label: 'Saturday' },
    { id: 'sun', label: 'Sunday' },
  ];

  const now = new Date();
  const dayIndex = now.getDay();
  const dayMap: Record<number, DayOfWeek> = { 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat', 0: 'sun' };
  const currentDayCode = dayMap[dayIndex];

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    addTimetableSlot({
      day,
      startTime,
      endTime,
      subject: subject.trim(),
      room,
      teacher,
      color,
      type,
    });

    setSubject('');
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Clock className="w-7 h-7 text-indigo-500" />
            <span>Weekly Timetable</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Time-blocked weekly schedule for classes, lectures, labs, and deep work sessions.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 active:scale-95 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Time Slot</span>
        </button>
      </div>

      {/* Timetable Grid Container */}
      <div className="glass-card p-5 overflow-x-auto">
        <div className="min-w-[880px] grid grid-cols-7 gap-3">
          {days.map((d) => {
            const daySlots = timetable
              .filter((s) => s.day === d.id)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            const isToday = d.id === currentDayCode;

            return (
              <div
                key={d.id}
                className={`rounded-2xl p-3 flex flex-col gap-3 border transition-all ${
                  isToday
                    ? 'bg-indigo-500/10 border-indigo-500 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-100/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-white/5'
                }`}
              >
                {/* Header */}
                <div className="text-center pb-2 border-b border-slate-200/80 dark:border-white/10">
                  <p className={`font-black text-xs uppercase ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                    {d.label}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">{daySlots.length} slots</p>
                </div>

                {/* Slots */}
                <div className="space-y-3 flex-1">
                  {daySlots.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-[11px] font-semibold text-slate-400 italic">
                      No events
                    </div>
                  ) : (
                    daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        style={{ borderLeftColor: slot.color }}
                        className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border-l-4 border-y border-r border-slate-200/80 dark:border-white/5 shadow-xs space-y-2 relative group hover:border-indigo-500/40 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                            {slot.startTime} - {slot.endTime}
                          </span>
                          <button
                            onClick={() => deleteTimetableSlot(slot.id)}
                            className="text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                            title="Delete slot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-snug">
                          {slot.subject}
                        </h4>

                        <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 space-y-1">
                          <p className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-indigo-500 shrink-0" /> {slot.room}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <User className="w-3 h-3 text-indigo-500 shrink-0" /> {slot.teacher}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Slot Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Add Timetable Slot</h3>
              <button onClick={() => setAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSlot} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold uppercase">Subject / Course Name *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Distributed Computing"
                  className="w-full p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold uppercase">Day</label>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value as DayOfWeek)}
                    className="w-full p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold"
                  >
                    {days.map((d) => (
                      <option key={d.id} value={d.id}>{d.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold uppercase">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="class">Class</option>
                    <option value="lab">Lab</option>
                    <option value="study">Study</option>
                    <option value="break">Break</option>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold uppercase">Room</label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold uppercase">Teacher</label>
                  <input
                    type="text"
                    value={teacher}
                    onChange={(e) => setTeacher(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200/80 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  Add Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
