import React, { useState } from 'react';
import { User, JLPTLevel, Exam } from '../types';
import DashboardLayout from '../components/DashboardLayout';
import { Card, Button, Badge } from '../components/UI';
import { PlusCircle, ClipboardList, Users, BarChart, BookOpen, Edit, Trash2, Eye } from '../components/Icons';
import ExamCreator from '../components/ExamCreator';

interface TeacherDashboardProps {
  user: User;
  onLogout: () => void;
  onNavigateHome: () => void;
}

interface ExamItem {
  id: string;
  title: string;
  level: JLPTLevel;
  questions: number;
  duration: number;
  students: number;
  createdAt: string;
  status: 'draft' | 'published';
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user, onLogout, onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'create' | 'exams' | 'students'>('overview');
  const [showExamCreator, setShowExamCreator] = useState(false);

  // Mock data
  const stats = {
    totalExams: 12,
    publishedExams: 8,
    totalStudents: 45,
    averageScore: 78,
  };

  const recentExams: ExamItem[] = [
    { id: '1', title: 'N3 Grammar Practice', level: 'N3', questions: 25, duration: 60, students: 12, createdAt: '2024-12-01', status: 'published' },
    { id: '2', title: 'N2 Reading Comprehension', level: 'N2', questions: 15, duration: 45, students: 8, createdAt: '2024-12-02', status: 'published' },
    { id: '3', title: 'N4 Vocabulary Test', level: 'N4', questions: 30, duration: 40, students: 20, createdAt: '2024-12-03', status: 'draft' },
  ];

  const handleSaveExam = (exam: Exam) => {
    console.log('Exam saved:', exam);
    alert(`Exam "${exam.title}" ${exam.status === 'published' ? 'published' : 'saved as draft'} successfully!`);
    setShowExamCreator(false);
    setActiveTab('exams');
  };

  return (
    <DashboardLayout user={user} onLogout={onLogout} onNavigateHome={onNavigateHome}>
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart size={18} /> },
            { id: 'create', label: 'Create Exam', icon: <PlusCircle size={18} /> },
            { id: 'exams', label: 'My Exams', icon: <ClipboardList size={18} /> },
            { id: 'students', label: 'Students', icon: <Users size={18} /> },
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
                  <Badge color="bg-blue-100 text-blue-800">{stats.publishedExams}/{stats.totalExams}</Badge>
                </div>
                <p className="text-2xl font-bold text-slate-900">{stats.totalExams}</p>
                <p className="text-sm text-slate-600">Total Exams</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="text-green-600" size={24} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{stats.totalStudents}</p>
                <p className="text-sm text-slate-600">Students Enrolled</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <BarChart className="text-purple-600" size={24} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{stats.averageScore}%</p>
                <p className="text-sm text-slate-600">Average Score</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <BookOpen className="text-orange-600" size={24} />
                </div>
                <p className="text-2xl font-bold text-slate-900">156</p>
                <p className="text-sm text-slate-600">Total Submissions</p>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button onClick={() => setActiveTab('create')} className="w-full">
                  <PlusCircle size={18} className="mr-2" />
                  Create New Exam
                </Button>
                <Button variant="secondary" className="w-full">
                  <Users size={18} className="mr-2" />
                  View Students
                </Button>
                <Button variant="secondary" className="w-full">
                  <BarChart size={18} className="mr-2" />
                  View Analytics
                </Button>
              </div>
            </Card>

            {/* Recent Exams */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Exams</h3>
              <div className="space-y-3">
                {recentExams.map((exam) => (
                  <div key={exam.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-slate-900">{exam.title}</h4>
                        <Badge color={exam.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {exam.status}
                        </Badge>
                        <Badge>{exam.level}</Badge>
                      </div>
                      <p className="text-sm text-slate-600">
                        {exam.questions} questions • {exam.duration} min • {exam.students} students
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Create Exam Tab */}
        {activeTab === 'create' && (
          <div>
            {showExamCreator ? (
              <ExamCreator
                onSave={handleSaveExam}
                onCancel={() => setShowExamCreator(false)}
              />
            ) : (
              <Card className="p-12 text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Create a New Exam</h3>
                <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                  Use our 3-step wizard to create comprehensive JLPT exams with multiple sections, 
                  custom questions with furigana support, and media attachments.
                </p>
                <Button size="lg" onClick={() => setShowExamCreator(true)}>
                  <PlusCircle size={20} className="mr-2" />
                  Start Creating Exam
                </Button>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <div className="text-primary-600 font-bold text-lg mb-2">Step 1</div>
                    <p className="text-sm text-slate-700">Set basic exam information and JLPT level</p>
                  </div>
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <div className="text-primary-600 font-bold text-lg mb-2">Step 2</div>
                    <p className="text-sm text-slate-700">Organize content into sections with time limits</p>
                  </div>
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <div className="text-primary-600 font-bold text-lg mb-2">Step 3</div>
                    <p className="text-sm text-slate-700">Add questions with furigana and media support</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* My Exams Tab */}
        {activeTab === 'exams' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">My Exams ({recentExams.length})</h3>
              <Button onClick={() => setActiveTab('create')}>
                <PlusCircle size={18} className="mr-2" />
                New Exam
              </Button>
            </div>

            <div className="grid gap-4">
              {recentExams.map((exam) => (
                <Card key={exam.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-bold text-slate-900">{exam.title}</h4>
                        <Badge color={exam.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {exam.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                        <span className="font-medium">{exam.level}</span>
                        <span>•</span>
                        <span>{exam.questions} questions</span>
                        <span>•</span>
                        <span>{exam.duration} minutes</span>
                        <span>•</span>
                        <span>{exam.students} students enrolled</span>
                      </div>
                      <p className="text-xs text-slate-500">Created on {new Date(exam.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">
                        <Eye size={16} className="mr-1" />
                        View
                      </Button>
                      <Button variant="secondary" size="sm">
                        <Edit size={16} className="mr-1" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 size={16} className="text-red-600" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Students Overview</h3>
              <div className="space-y-3">
                {[
                  { id: '1', name: 'Yamada Taro', email: 'yamada@student.com', exams: 5, avgScore: 82 },
                  { id: '2', name: 'Tanaka Yuki', email: 'tanaka@student.com', exams: 8, avgScore: 91 },
                  { id: '3', name: 'Sato Kenji', email: 'sato@student.com', exams: 3, avgScore: 75 },
                ].map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{student.name}</p>
                        <p className="text-sm text-slate-600">{student.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">{student.exams} exams taken</p>
                      <p className="text-sm text-slate-600">Avg: {student.avgScore}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
