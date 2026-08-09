import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navigation/Navbar';
import { Sidebar } from './components/Navigation/Sidebar';
import AuroraBackground from './components/AuroraBackground';
import { CommandPalette } from './components/CommandPalette';
import { QuickAddTaskModal } from './components/QuickAddTaskModal';
import { ToastContainer } from './components/Toast';

import { HomeView } from './components/Views/HomeView';
import { TodoListView } from './components/Views/TodoListView';
import { TaskTrackerKanbanView } from './components/Views/TaskTrackerKanbanView';
import { CalendarView } from './components/Views/CalendarView';
import { TimetableView } from './components/Views/TimetableView';
import { NotesView } from './components/Views/NotesView';
import { FavoritesView } from './components/Views/FavoritesView';
import { ArchiveView } from './components/Views/ArchiveView';
import { SettingsView } from './components/Views/SettingsView';
import { LoginView } from './components/LoginView';

const LoadingScreen: React.FC = () => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0B1020] text-slate-900 dark:text-white relative overflow-hidden">
    <AuroraBackground />
    <div className="relative z-10 flex flex-col items-center gap-6 p-8">
      <div className="relative">
        <div className="absolute -inset-4 rounded-full orbit-ring" style={{ ['--orbit-duration' as string]: '7s' }} />
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 16 }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[var(--accent-color)] to-[var(--accent-hover)] flex items-center justify-center text-white shadow-2xl shadow-[var(--accent-soft)] animate-float"
        >
          <motion.span
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 320, damping: 20 }}
            className="text-2xl font-black"
          >
            P
          </motion.span>
        </motion.div>
        <div className="absolute -inset-9 rounded-full orbit-ring" style={{ ['--orbit-duration' as string]: '12s', ['--orbit-color' as string]: '#22D3EE' }} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex flex-col items-center gap-3"
      >
        <span className="text-sm font-bold tracking-tight text-slate-700 dark:text-slate-200">
          Initializing Planora
        </span>
        <div className="w-40 h-1 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-hover)]"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
          />
        </div>
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1 h-1 rounded-full bg-[var(--accent-color)]"
              animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
            />
          ))}
        </span>
      </motion.div>
    </div>
  </div>
);

const MainLayout: React.FC = () => {
  const { activeTab, isAuthenticated, authLoading } = useApp();
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (authLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginView />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#070B15] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 relative overflow-x-hidden">
      <AuroraBackground />

      <Navbar onMobileMenuToggle={() => setMobileSidebarOpen(!isMobileSidebarOpen)} />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto relative z-10">
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 transition-all">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              {activeTab === 'home' && <HomeView />}
              {activeTab === 'todo' && <TodoListView />}
              {activeTab === 'tracker' && <TaskTrackerKanbanView />}
              {activeTab === 'calendar' && <CalendarView />}
              {activeTab === 'timetable' && <TimetableView />}
              {activeTab === 'notes' && <NotesView />}
              {activeTab === 'favorites' && <FavoritesView />}
              {activeTab === 'archive' && <ArchiveView />}
              {activeTab === 'settings' && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <CommandPalette />
      <QuickAddTaskModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}