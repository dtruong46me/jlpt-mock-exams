import React, { useState } from 'react';
import { User, JLPTLevel, Exam } from '../types';
import DashboardLayout from '../components/DashboardLayout';
import { Card, Button, Badge, Progress } from '../components/UI';
import { BookOpen, ClipboardList, BarChart, Award, Clock, CheckCircle, PlusCircle } from '../components/Icons';
import { MOCK_EXAMS } from '../constants';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
  onNavigateHome: () => void;
  onStartExam?: (exam: Exam) => void;
}

interface StudentProgress {
  level: JLPTLevel;
  completed: number;
  total: number;
  averageScore: number;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  user, 
  onLogout, 
  onNavigateHome,
  onStartExam 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'practice' | 'exams' | 'results'>('overview');

  // Mock data
  const stats = {
    totalExams: 12,
    completedExams: 8,
    averageScore: 78,
    studyStreak: 5,
  };

  const progress: StudentProgress[] = [
    { level: 'N5', completed: 8, total: 10, averageScore: 85 },
    { level: 'N4', completed: 5, total: 10, averageScore: 78 },
    { level: 'N3', completed: 2, total: 10, averageScore: 72 },
    { level: 'N2', completed: 0, total: 10, averageScore: 0 },
    { level: 'N1', completed: 0, total: 10, averageScore: 0 },
  ];

  const recentResults = [
    { id: '1', examTitle: 'N3 Grammar Practice', level: 'N3', score: 82, date: '2024-12-01', passed: true },
    { id: '2', examTitle: 'N4 Vocabulary Test', level: 'N4', score: 91, date: '2024-11-28', passed: true },
    { id: '3', examTitle: 'N3 Reading Comprehension', level: 'N3', score: 65, date: '2024-11-25', passed: false },
  ];

  const recommendedExams = MOCK_EXAMS.slice(0, 3);

  return (
    <DashboardLayout user={user} onLogout={onLogout} onNavigateHome={onNavigateHome}>
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart size={18} /> },
            { id: 'practice', label: 'Practice', icon: <BookOpen size={18} /> },
            { id: 'exams', label: 'Take Exam', icon: <ClipboardList size={18} /> },
            { id: 'results', label: 'My Results', icon: <Award size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'border-primary-600 text-primary-600' 
                  : 'border-transparent text-slate-600 hover:text-slate-900'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <ClipboardList className="text-blue-600" size={24} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{stats.completedExams}</p>
                <p className="text-sm text-slate-600">Exams Completed</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Award className="text-green-600" size={24} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{stats.averageScore}%</p>
                <p className="text-sm text-slate-600">Average Score</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <BookOpen className="text-purple-600" size={24} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{stats.totalExams}</p>
                <p className="text-sm text-slate-600">Total Practice</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="text-orange-600" size={24} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{stats.studyStreak} days</p>
                <p className="text-sm text-slate-600">Study Streak 🔥</p>
              </Card>
            </div>

            {/* Progress by Level */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Progress by Level</h3>
              <div className="space-y-4">
                {progress.map((p) => (
                  <div key={p.level}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{p.level}</span>
                        <Badge>{p.completed}/{p.total} completed</Badge>
                      </div>
                      <span className="text-sm font-medium text-slate-600">
                        {p.averageScore > 0 ? `${p.averageScore}% avg` : 'Not started'}
                      </span>
                    </div>
                    <Progress value={p.completed} max={p.total} />
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button onClick={() => setActiveTab('practice')} className="w-full">
                  <BookOpen size={18} className="mr-2" />
                  Start Practice
                </Button>
                <Button variant="secondary" onClick={() => setActiveTab('exams')} className="w-full">
                  <ClipboardList size={18} className="mr-2" />
                  Take Exam
                </Button>
                <Button variant="secondary" onClick={() => setActiveTab('results')} className="w-full">
                  <BarChart size={18} className="mr-2" />
                  View Results
                </Button>
              </div>
            </Card>

            {/* Recent Results */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Results</h3>
              <div className="space-y-3">
                {recentResults.map((result) => (
                  <div key={result.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-slate-900">{result.examTitle}</h4>
                        <Badge>{result.level}</Badge>
                        <Badge color={result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {result.passed ? 'Passed' : 'Failed'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">
                        Score: {result.score}% • {new Date(result.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Practice Tab */}
        {activeTab === 'practice' && (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Daily Practice</h3>
              <p className="text-slate-600 mb-4">
                Keep your streak going! Complete daily exercises to improve your skills.
              </p>
              <Button>
                <PlusCircle size={18} className="mr-2" />
                Start Daily Practice
              </Button>
            </Card>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Practice by Topic</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Vocabulary', 'Grammar', 'Reading', 'Listening'].map((topic) => (
                  <Card key={topic} className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <BookOpen className="text-primary-600 mb-3" size={32} />
                    <h4 className="font-bold text-slate-900 mb-2">{topic}</h4>
                    <p className="text-sm text-slate-600 mb-4">Practice {topic.toLowerCase()} skills</p>
                    <Button variant="secondary" size="sm" className="w-full">
                      Start Practice
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Exams Tab */}
        {activeTab === 'exams' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Available Exams</h3>
              <div className="grid gap-4">
                {recommendedExams.map((exam) => (
                  <Card key={exam.id} className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-bold text-slate-900">{exam.title}</h4>
                          <Badge>{exam.level}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                          <span className="flex items-center gap-1">
                            <ClipboardList size={14} />
                            {exam.totalQuestions} questions
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {exam.totalDuration} minutes
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">
                          {exam.sections.length} sections covering vocabulary, grammar, reading, and listening
                        </p>
                      </div>
                      <Button 
                        onClick={() => onStartExam && onStartExam(exam)}
                        className="ml-4"
                      >
                        Start Exam
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="p-6 bg-yellow-50 border-yellow-200">
              <div className="flex items-start gap-3">
                <Clock className="text-yellow-700 mt-1" size={20} />
                <div>
                  <h4 className="font-bold text-yellow-900 mb-1">Exam Tips</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Make sure you have enough time to complete the exam</li>
                    <li>• Find a quiet place with no distractions</li>
                    <li>• Read questions carefully before answering</li>
                    <li>• Review your answers before submitting</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">My Results ({recentResults.length})</h3>
            </div>

            <div className="grid gap-4">
              {recentResults.map((result) => (
                <Card key={result.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-bold text-slate-900">{result.examTitle}</h4>
                        <Badge>{result.level}</Badge>
                        <Badge color={result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {result.passed ? '✓ Passed' : '✗ Failed'}
                        </Badge>
                      </div>
                      <div className="mb-3">
                        <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                          <span>Score: <strong className="text-slate-900">{result.score}%</strong></span>
                          <span>•</span>
                          <span>Date: {new Date(result.date).toLocaleDateString()}</span>
                        </div>
                        <Progress 
                          value={result.score} 
                          max={100} 
                          colorClass={result.passed ? 'bg-green-600' : 'bg-red-600'}
                        />
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
