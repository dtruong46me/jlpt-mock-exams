import React from 'react';
import { JLPTLevel, User } from '../types';
import { LEVELS, LEVEL_STATS } from '../constants';
import { Card, Badge, Button } from '../components/UI';
import { BookOpen, Award, ChevronRight, LogOut, Layout } from '../components/Icons';

interface HomeProps {
  onSelectLevel: (level: JLPTLevel) => void;
  onLogin?: () => void;
  onDashboard?: () => void;
  isLoggedIn?: boolean;
  user?: User | null;
}

const Home: React.FC<HomeProps> = ({ 
  onSelectLevel, 
  onLogin, 
  onDashboard,
  isLoggedIn = false,
  user 
}) => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="text-primary-600" size={24} />
              <span className="font-bold text-lg font-jp">日本語試験</span>
            </div>
            <div className="flex items-center gap-3">
              {isLoggedIn && user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
                    <div className="h-6 w-6 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-slate-900">{user.name}</span>
                  </div>
                  <Button variant="secondary" onClick={onDashboard}>
                    <Layout size={16} className="mr-2" />
                    Dashboard
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={onLogin}>
                    About
                  </Button>
                  <Button onClick={onLogin}>
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
          <Badge className="mb-4 bg-primary-50 text-primary-700 border border-primary-100">
            JLPT Mock Exam Platform
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-4 font-jp">
            日本語能力試験 <span className="text-primary-600">対策</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Master the JLPT with our professional mock exams. Real-time scoring, detailed analytics, and authentic question formats for levels N5 through N1.
          </p>
          <div className="flex justify-center gap-4">
            {isLoggedIn ? (
              <>
                <Button size="lg" onClick={() => document.getElementById('levels')?.scrollIntoView({behavior: 'smooth'})}>
                  Start Practicing
                </Button>
                <Button size="lg" variant="secondary" onClick={onDashboard}>
                  Go to Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" onClick={onLogin}>
                  Sign In to Start
                </Button>
                <Button size="lg" variant="secondary" onClick={() => document.getElementById('levels')?.scrollIntoView({behavior: 'smooth'})}>
                  Browse Exams
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Levels Grid */}
      <div id="levels" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Select Your Level</h2>
          <p className="text-slate-500 mt-2">Choose a difficulty level to view available exams</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {LEVELS.map((level) => {
            const stats = LEVEL_STATS[level];
            return (
              <Card 
                key={level} 
                onClick={() => onSelectLevel(level)}
                className="group relative hover:-translate-y-1 transition-transform duration-300 border-t-4 border-t-transparent hover:border-t-primary-500"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-4xl font-bold text-slate-900 font-sans`}>{level}</span>
                    <div className={`h-8 w-8 rounded-full ${stats.color} opacity-10 group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
                       <Award size={16} className="text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mb-6 h-10 line-clamp-2">
                    {stats.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                      <BookOpen size={14} />
                      {stats.count} Exams
                    </span>
                    <span className="text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-sm font-medium">
                      Select <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;