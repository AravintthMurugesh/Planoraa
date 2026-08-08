import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navigation/Navbar';
import { Sidebar } from './components/Navigation/Sidebar';
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

const MainLayout: React.FC = () => {
  const { activeTab, isAuthenticated, authLoading } = useApp();
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0B1020] text-white relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        
        <div className="relative z-10 flex flex-col items-center gap-4 p-8 glass-card">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
            <img
              src="/src/assets/images/planora_logo_1784957089188.jpg"
              alt="Planora"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-xl bg-white p-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-bold tracking-tight text-slate-200">Initializing Planora...</span>
          </div>
        </div>
      </div>
    );
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
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1020] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 relative overflow-x-hidden">
      {/* Dynamic Background Ambient Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[650px] h-[650px] bg-indigo-600/20 rounded-full blur-[150px] transition-all" />
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-purple-600/20 rounded-full blur-[150px] transition-all" />
        <div className="absolute -bottom-40 left-1/3 w-[650px] h-[650px] bg-cyan-600/15 rounded-full blur-[170px] transition-all" />
      </div>

      {/* Top Navbar */}
      <Navbar onMobileMenuToggle={() => setMobileSidebarOpen(!isMobileSidebarOpen)} />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto relative z-10">
        {/* Left Sidebar */}
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 transition-all">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
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

      {/* Overlays & Modals */}
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
