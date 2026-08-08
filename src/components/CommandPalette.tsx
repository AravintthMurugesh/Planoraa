import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  CheckSquare,
  Calendar,
  Clock,
  FileText,
  Plus,
  Home,
  Kanban,
  Star,
  Settings,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ViewTab, Task, CalendarEvent, Note, TimetableSlot } from '../types';

type SearchResultItem =
  | { id: string; type: 'action'; label: string; icon: React.FC<{ className?: string }>; action: () => void }
  | { id: string; type: 'nav'; label: string; tab: ViewTab; icon: React.FC<{ className?: string }> }
  | { id: string; type: 'task'; item: Task }
  | { id: string; type: 'event'; item: CalendarEvent }
  | { id: string; type: 'note'; item: Note }
  | { id: string; type: 'tt'; item: TimetableSlot };

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    tasks,
    events,
    notes,
    timetable,
    setActiveTab,
    setQuickTaskModalOpen,
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const q = query.toLowerCase().trim();

  // Navigation commands
  const navCommands: { id: string; type: 'nav'; label: string; tab: ViewTab; icon: React.FC<{ className?: string }> }[] = [
    { id: 'nav-home', type: 'nav', label: 'Go to Home Dashboard', tab: 'home', icon: Home },
    { id: 'nav-todo', type: 'nav', label: 'Go to Todo List', tab: 'todo', icon: CheckSquare },
    { id: 'nav-tracker', type: 'nav', label: 'Go to Task Tracker', tab: 'tracker', icon: Kanban },
    { id: 'nav-calendar', type: 'nav', label: 'Go to Calendar', tab: 'calendar', icon: Calendar },
    { id: 'nav-timetable', type: 'nav', label: 'Go to Timetable Planner', tab: 'timetable', icon: Clock },
    { id: 'nav-notes', type: 'nav', label: 'Go to Notes', tab: 'notes', icon: FileText },
    { id: 'nav-favorites', type: 'nav', label: 'Go to Favorites', tab: 'favorites', icon: Star },
    { id: 'nav-settings', type: 'nav', label: 'Go to Settings', tab: 'settings', icon: Settings },
  ];

  const matchedNav = navCommands.filter((c) => c.label.toLowerCase().includes(q));

  // Quick Action commands
  const actionCommands: SearchResultItem[] = [
    {
      id: 'action-new-task',
      type: 'action',
      label: 'Create New Task...',
      icon: Plus,
      action: () => {
        setQuickTaskModalOpen(true);
        setCommandPaletteOpen(false);
      },
    },
  ];

  const matchedActions = actionCommands.filter((a: Extract<SearchResultItem, { type: 'action' }>) => a.label.toLowerCase().includes(q));

  const matchedTasks = tasks
    .filter((t) => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q))
    .slice(0, 4);

  const matchedEvents = events
    .filter((e) => e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q))
    .slice(0, 3);

  const matchedNotes = notes
    .filter((n) => n.title.toLowerCase().includes(q) || n.category.toLowerCase().includes(q))
    .slice(0, 3);

  const matchedTimetable = timetable
    .filter((tt) => tt.subject.toLowerCase().includes(q) || tt.teacher.toLowerCase().includes(q))
    .slice(0, 3);

  const allMatchedItems: SearchResultItem[] = [
    ...matchedActions,
    ...matchedNav,
    ...matchedTasks.map((t) => ({ id: `task-${t.id}`, type: 'task' as const, item: t })),
    ...matchedEvents.map((e) => ({ id: `event-${e.id}`, type: 'event' as const, item: e })),
    ...matchedNotes.map((n) => ({ id: `note-${n.id}`, type: 'note' as const, item: n })),
    ...matchedTimetable.map((tt) => ({ id: `tt-${tt.id}`, type: 'tt' as const, item: tt })),
  ];

  const handleSelect = (index: number) => {
    const selected = allMatchedItems[index];
    if (!selected) return;

    if (selected.type === 'action') {
      selected.action();
    } else if (selected.type === 'nav') {
      setActiveTab(selected.tab);
      setCommandPaletteOpen(false);
    } else if (selected.type === 'task') {
      setActiveTab('todo');
      setCommandPaletteOpen(false);
    } else if (selected.type === 'event') {
      setActiveTab('calendar');
      setCommandPaletteOpen(false);
    } else if (selected.type === 'note') {
      setActiveTab('notes');
      setCommandPaletteOpen(false);
    } else if (selected.type === 'tt') {
      setActiveTab('timetable');
      setCommandPaletteOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, allMatchedItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allMatchedItems.length) % Math.max(1, allMatchedItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(selectedIndex);
    } else if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-2xl glass-panel border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header Search Input */}
          <div className="px-5 py-4 border-b border-slate-200/80 dark:border-white/10 flex items-center gap-3">
            <Search className="w-5 h-5 text-indigo-500 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a command or search tasks, notes, calendar..."
              className="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 outline-none text-sm font-bold"
            />
            <button
              onClick={() => setCommandPaletteOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Results List */}
          <div className="max-h-96 overflow-y-auto p-3 space-y-1">
            {allMatchedItems.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-semibold">
                No matching results found for "{query}".
              </div>
            ) : (
              allMatchedItems.map((item, idx) => {
                const isSelected = idx === selectedIndex;

                if (item.type === 'action') {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(idx)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20'
                          : 'text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-indigo-400" />
                        <span>{item.label}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-70" />
                    </div>
                  );
                }

                if (item.type === 'nav') {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(idx)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20'
                          : 'text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                        Navigation
                      </span>
                    </div>
                  );
                }

                if (item.type === 'task') {
                  const task = item.item;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(idx)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20'
                          : 'text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CheckSquare className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-emerald-500'}`} />
                        <span className="truncate max-w-md">{task.title}</span>
                      </div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                        Task • {task.category}
                      </span>
                    </div>
                  );
                }

                if (item.type === 'event') {
                  const ev = item.item;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(idx)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20'
                          : 'text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-indigo-500'}`} />
                        <span className="truncate max-w-md">{ev.title}</span>
                      </div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                        Event • {ev.startTime}
                      </span>
                    </div>
                  );
                }

                if (item.type === 'note') {
                  const note = item.item;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(idx)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20'
                          : 'text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-amber-500'}`} />
                        <span className="truncate max-w-md">{note.title}</span>
                      </div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                        Note • {note.category}
                      </span>
                    </div>
                  );
                }

                if (item.type === 'tt') {
                  const slot = item.item;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(idx)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20'
                          : 'text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-blue-500'}`} />
                        <span className="truncate max-w-md">{slot.subject}</span>
                      </div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                        Timetable • {slot.day.toUpperCase()}
                      </span>
                    </div>
                  );
                }

                return null;
              })
            )}
          </div>

          {/* Footer Hints */}
          <div className="px-5 py-3 bg-slate-100/80 dark:bg-slate-900/80 border-t border-slate-200/80 dark:border-white/10 text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span><kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-mono font-bold">↑↓</kbd> Navigate</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-mono font-bold">↵</kbd> Select</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-mono font-bold">ESC</kbd> Close</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
