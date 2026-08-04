import React, { useState } from 'react';
import { supabase } from "./supabase/supabase";
import { Navbar } from './components/Navigation/Navbar';
import { Sidebar } from './components/Navigation/Sidebar';
import { CommandPalette } from './components/CommandPalette';
import { QuickAddTaskModal } from './components/QuickAddTaskModal';
import { ToastContainer } from './components/Toast';
import { AppProvider, useApp } from "./context/appcontext";
import { LoginView } from "./components/loginview.tsx";
import { HomeView } from './components/Views/HomeView';
import { TodoListView } from './components/Views/TodoListView';
import { TaskTrackerKanbanView } from './components/Views/TaskTrackerKanbanView';
import { CalendarView } from './components/Views/CalendarView';
import { TimetableView } from './components/Views/TimetableView';
import { NotesView } from './components/Views/NotesView';
import { FavoritesView } from './components/Views/FavoritesView';
import { ArchiveView } from './components/Views/ArchiveView';
import { SettingsView } from './components/Views/SettingsView';

const MainLayout: React.FC = () => {
  const { activeTab, isAuthenticated, authLoading } = useApp();
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
console.log("Supabase Client:", supabase);
  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading Planora...</span>
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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar onMobileMenuToggle={() => setMobileSidebarOpen(!isMobileSidebarOpen)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activeTab === 'home' && <HomeView />}
          {activeTab === 'todo' && <TodoListView />}
          {activeTab === 'tracker' && <TaskTrackerKanbanView />}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'timetable' && <TimetableView />}
          {activeTab === 'notes' && <NotesView />}
          {activeTab === 'favorites' && <FavoritesView />}
          {activeTab === 'archive' && <ArchiveView />}
          {activeTab === 'settings' && <SettingsView />}
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
