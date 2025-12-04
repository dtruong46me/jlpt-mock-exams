import React, { useState } from 'react';
import { User } from '../types';
import { Button } from './UI';
import { 
  Home, 
  Menu, 
  X, 
  LogOut, 
  Settings, 
  BookOpen, 
  Users, 
  BarChart, 
  Layout,
  ClipboardList,
  PlusCircle
} from './Icons';

interface DashboardLayoutProps {
  user: User;
  children: React.ReactNode;
  onLogout: () => void;
  onNavigateHome: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  role?: string[];
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  user, 
  children, 
  onLogout, 
  onNavigateHome 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const getMenuItems = (): MenuItem[] => {
    const commonItems: MenuItem[] = [
      { id: 'dashboard', label: 'Dashboard', icon: <Layout size={20} /> },
    ];

    const roleSpecificItems: MenuItem[] = {
      teacher: [
        { id: 'create-exam', label: 'Create Exam', icon: <PlusCircle size={20} /> },
        { id: 'my-exams', label: 'My Exams', icon: <ClipboardList size={20} /> },
        { id: 'students', label: 'Students', icon: <Users size={20} /> },
        { id: 'analytics', label: 'Analytics', icon: <BarChart size={20} /> },
      ],
      student: [
        { id: 'practice', label: 'Practice', icon: <BookOpen size={20} /> },
        { id: 'exams', label: 'Take Exam', icon: <ClipboardList size={20} /> },
        { id: 'my-results', label: 'My Results', icon: <BarChart size={20} /> },
        { id: 'progress', label: 'Progress', icon: <BarChart size={20} /> },
      ],
      admin: [
        { id: 'users', label: 'Manage Users', icon: <Users size={20} /> },
        { id: 'exams', label: 'Manage Exams', icon: <ClipboardList size={20} /> },
        { id: 'analytics', label: 'System Analytics', icon: <BarChart size={20} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
      ],
    }[user.role] || [];

    return [...commonItems, ...roleSpecificItems];
  };

  const getRoleColor = (role: string) => {
    const colors = {
      student: 'bg-blue-100 text-blue-800',
      teacher: 'bg-green-100 text-green-800',
      admin: 'bg-purple-100 text-purple-800',
    };
    return colors[role as keyof typeof colors] || 'bg-slate-100 text-slate-800';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-slate-200 
          transition-all duration-300 z-50
          ${isSidebarOpen ? 'w-64' : 'w-0 lg:w-16'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Toggle */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            {isSidebarOpen && (
              <div className="flex-1">
                <h2 className="font-bold text-lg text-slate-900 font-jp">日本語試験</h2>
                <p className="text-xs text-slate-500">JLPT Platform</p>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* User Info */}
          {isSidebarOpen && (
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-900 truncate">{user.name}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-2">
            {getMenuItems().map((item) => (
              <button
                key={item.id}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all mb-1 group"
              >
                <span className="text-slate-500 group-hover:text-primary-600 transition-colors">
                  {item.icon}
                </span>
                {isSidebarOpen && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-2 border-t border-slate-200 space-y-1">
            <button
              onClick={onNavigateHome}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-all"
            >
              <Home size={20} />
              {isSidebarOpen && <span className="font-medium text-sm">Home</span>}
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut size={20} />
              {isSidebarOpen && <span className="font-medium text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
              >
                <Menu size={24} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
                </h1>
                <p className="text-sm text-slate-500">Welcome back, {user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onNavigateHome}>
                <Home size={16} className="mr-2" />
                Home
              </Button>
              <Button variant="secondary" size="sm">
                <Settings size={16} />
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
