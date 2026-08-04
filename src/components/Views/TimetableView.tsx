import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Plus, MapPin, User, Sparkles, X, Trash2 } from 'lucide-react';
import { useApp } from '../../context/appcontext.tsx';
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
  const [color, setColor] = useState('#4F46E5');
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

  // Helper to determine current ongoing class
  const now = new Date();
  const dayIndex = now.getDay(); // 0 is Sun, 1 is Mon...
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
    <div className="space-y-6 pb-12 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-400" />
            Weekly Timetable Planner
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Structured time-blocking for classes, lectures, labs, and deep study hours.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md active:scale-95 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" /> Add Time Slot
        </button>
      </div>

      {/* Timetable Grid */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-[20px] p-5 shadow-xl overflow-x-auto">
        <div className="min-w-[850px] grid grid-cols-7 gap-3">
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
                    ? 'bg-slate-900 border-2 border-indigo-500 ring-2 ring-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                {/* Column Header */}
                <div className="text-center pb-2 border-b border-slate-800">
                  <p className={`font-black text-xs uppercase ${isToday ? 'text-indigo-400 font-extrabold' : 'text-white'}`}>
                    {d.label}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">{daySlots.length} slots</p>
                </div>

                {/* Slots */}
                <div className="space-y-3 flex-1">
                  {daySlots.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-[11px] font-semibold text-slate-500 italic">
                      Free day
                    </div>
                  ) : (
                    daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        style={{ borderLeftColor: slot.color }}
                        className="p-3 rounded-xl bg-slate-900 border-l-4 border-y border-r border-slate-800 shadow-sm space-y-2 relative group hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-[10px] font-bold text-slate-300 bg-slate-800 border border-slate-700/60 px-1.5 py-0.5 rounded">
                            {slot.startTime} - {slot.endTime}
                          </span>
                          <button
                            onClick={() => deleteTimetableSlot(slot.id)}
                            className="text-slate-400 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                            title="Delete slot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h4 className="font-bold text-xs text-white leading-snug">
                          {slot.subject}
                        </h4>

                        <div className="text-[10px] font-medium text-slate-300 space-y-1">
                          <p className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-indigo-400 shrink-0" /> {slot.room}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <User className="w-3 h-3 text-indigo-400 shrink-0" /> {slot.teacher}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Add Timetable Slot</h3>
              <button onClick={() => setAddModalOpen(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSlot} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase">Subject / Course Name *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Advanced System Architecture"
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-medium text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase">Day</label>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value as DayOfWeek)}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {days.map((d) => (
                      <option key={d.id} value={d.id}>{d.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
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
                  <label className="block text-slate-400 mb-1 font-semibold uppercase">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase">Room Number</label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase">Teacher</label>
                  <input
                    type="text"
                    value={teacher}
                    onChange={(e) => setTeacher(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md cursor-pointer"
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
