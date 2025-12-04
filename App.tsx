import React, { useState } from 'react';
import Home from './views/Home';
import ExamList from './views/ExamList';
import ExamTake from './views/ExamTake';
import Result from './views/Result';
import Login from './views/Login';
import StudentDashboard from './views/StudentDashboard';
import TeacherDashboard from './views/TeacherDashboard';
import AdminDashboard from './views/AdminDashboard';
import { JLPTLevel, Exam, ExamResult, User } from './types';

// Simple Router State to simulate Next.js pages in a single component tree
type ViewState = 
  | { type: 'home' }
  | { type: 'login' }
  | { type: 'dashboard' }
  | { type: 'list', level: JLPTLevel }
  | { type: 'take', exam: Exam }
  | { type: 'result', result: ExamResult, exam: Exam };

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>({ type: 'home' });
  const [user, setUser] = useState<User | null>(null);

  const navigateToHome = () => {
    setView({ type: 'home' });
  };

  const navigateToLogin = () => {
    setView({ type: 'login' });
  };

  const navigateToDashboard = () => {
    setView({ type: 'dashboard' });
  };
  
  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView({ type: 'dashboard' });
  };

  const handleLogout = () => {
    setUser(null);
    setView({ type: 'home' });
  };

  const handleLevelSelect = (level: JLPTLevel) => {
    setView({ type: 'list', level });
  };

  const handleStartExam = (exam: Exam) => {
    setView({ type: 'take', exam });
  };

  const handleFinishExam = (result: ExamResult, exam: Exam) => {
    setView({ type: 'result', result, exam });
  };

  return (
    <div className="font-sans text-slate-900">
      {/* 
        In a real Next.js app, these would be separate routes. 
        Here we conditionally render to simulate routing in an SPA. 
      */}
      
      {view.type === 'home' && (
        <Home 
          onSelectLevel={handleLevelSelect}
          onLogin={navigateToLogin}
          isLoggedIn={!!user}
          user={user}
          onDashboard={navigateToDashboard}
        />
      )}

      {view.type === 'login' && (
        <Login 
          onLogin={handleLogin}
          onBack={navigateToHome}
        />
      )}

      {view.type === 'dashboard' && user && (
        <>
          {user.role === 'student' && (
            <StudentDashboard 
              user={user}
              onLogout={handleLogout}
              onNavigateHome={navigateToHome}
              onStartExam={handleStartExam}
            />
          )}
          {user.role === 'teacher' && (
            <TeacherDashboard 
              user={user}
              onLogout={handleLogout}
              onNavigateHome={navigateToHome}
            />
          )}
          {user.role === 'admin' && (
            <AdminDashboard 
              user={user}
              onLogout={handleLogout}
              onNavigateHome={navigateToHome}
            />
          )}
        </>
      )}

      {view.type === 'list' && (
        <ExamList 
          level={view.level} 
          onBack={navigateToHome}
          onStartExam={handleStartExam}
        />
      )}

      {view.type === 'take' && (
        <ExamTake 
          exam={view.exam}
          onExit={() => setView({ type: 'list', level: view.exam.level })}
          onFinish={(result) => handleFinishExam(result, view.exam)}
        />
      )}

      {view.type === 'result' && (
        <Result 
          result={view.result}
          exam={view.exam}
          onRetake={() => setView({ type: 'take', exam: view.exam })}
          onHome={navigateToHome}
        />
      )}
    </div>
  );
};

export default App;