import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Button, Card } from '../components/UI';
import { Mail, Lock, UserCircle } from '../components/Icons';

interface LoginProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

// Mock user database for demo purposes
const MOCK_USERS = [
  { id: '1', email: 'teacher@jlpt.com', password: 'teacher123', name: 'Tanaka Sensei', role: 'teacher' as UserRole },
  { id: '2', email: 'student@jlpt.com', password: 'student123', name: 'Yamada Taro', role: 'student' as UserRole },
  { id: '3', email: 'admin@jlpt.com', password: 'admin123', name: 'Admin User', role: 'admin' as UserRole },
];

const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        onLogin({
          ...userWithoutPassword,
          createdAt: new Date().toISOString(),
        });
      } else {
        setError('Invalid email or password');
      }
      setIsLoading(false);
    }, 800);
  };

  const handleQuickLogin = (role: UserRole) => {
    const user = MOCK_USERS.find(u => u.role === role);
    if (user) {
      setEmail(user.email);
      setPassword(user.password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 font-jp">
            日本語能力試験
          </h1>
          <p className="text-slate-600">JLPT Mock Exam Platform</p>
        </div>

        <Card className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-600">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center mb-3">Quick Login (Demo)</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('student')}
                className="flex flex-col items-center gap-1 p-2 rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-xs"
              >
                <UserCircle size={20} className="text-blue-600" />
                <span className="font-medium">Student</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('teacher')}
                className="flex flex-col items-center gap-1 p-2 rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-xs"
              >
                <UserCircle size={20} className="text-green-600" />
                <span className="font-medium">Teacher</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="flex flex-col items-center gap-1 p-2 rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-xs"
              >
                <UserCircle size={20} className="text-purple-600" />
                <span className="font-medium">Admin</span>
              </button>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={onBack} className="text-sm">
              ← Back to Home
            </Button>
          </div>
        </Card>

        <div className="mt-6 text-center text-xs text-slate-500">
          <p>Demo Credentials:</p>
          <p>Student: student@jlpt.com / student123</p>
          <p>Teacher: teacher@jlpt.com / teacher123</p>
          <p>Admin: admin@jlpt.com / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
