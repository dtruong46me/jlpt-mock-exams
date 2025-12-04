import React, { useState } from 'react';
import { User, UserRole, Exam } from '../types';
import DashboardLayout from '../components/DashboardLayout';
import { Card, Button, Badge } from '../components/UI';
import { Users, ClipboardList, BarChart, Settings, PlusCircle, Edit, Trash2, Eye } from '../components/Icons';
import ExamCreator from '../components/ExamCreator';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  onNavigateHome: () => void;
}

interface UserData extends User {
  status: 'active' | 'inactive';
  lastLogin: string;
  examsCompleted?: number;
  examsCreated?: number;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout, onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'exams' | 'analytics'>('overview');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showExamCreator, setShowExamCreator] = useState(false);

  // Mock data
  const stats = {
    totalUsers: 127,
    totalStudents: 89,
    totalTeachers: 36,
    totalExams: 45,
    activeUsers: 98,
  };

  const users: UserData[] = [
    { 
      id: '1', 
      name: 'Yamada Taro', 
      email: 'yamada@student.com', 
      role: 'student', 
      status: 'active',
      lastLogin: '2024-12-04',
      examsCompleted: 12,
      createdAt: '2024-01-15'
    },
    { 
      id: '2', 
      name: 'Tanaka Sensei', 
      email: 'tanaka@teacher.com', 
      role: 'teacher', 
      status: 'active',
      lastLogin: '2024-12-03',
      examsCreated: 8,
      createdAt: '2024-01-10'
    },
    { 
      id: '3', 
      name: 'Sato Yuki', 
      email: 'sato@student.com', 
      role: 'student', 
      status: 'inactive',
      lastLogin: '2024-11-20',
      examsCompleted: 5,
      createdAt: '2024-02-01'
    },
  ];

  const recentActivity = [
    { id: '1', action: 'User yamada@student.com completed exam N3 Grammar', time: '5 min ago' },
    { id: '2', action: 'Teacher tanaka@teacher.com created new exam', time: '1 hour ago' },
    { id: '3', action: 'New user registered: sato@student.com', time: '2 hours ago' },
    { id: '4', action: 'System backup completed successfully', time: '3 hours ago' },
  ];

  const getRoleColor = (role: UserRole) => {
    const colors = {
      student: 'bg-blue-100 text-blue-800',
      teacher: 'bg-green-100 text-green-800',
      admin: 'bg-purple-100 text-purple-800',
    };
    return colors[role];
  };

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
            { id: 'users', label: 'Manage Users', icon: <Users size={18} /> },
            { id: 'exams', label: 'Manage Exams', icon: <ClipboardList size={18} /> },
            { id: 'analytics', label: 'Analytics', icon: <BarChart size={18} /> },
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
                  <Users className="text-blue-600" size={24} />
                  <Badge color="bg-green-100 text-green-800">{stats.activeUsers} active</Badge>
                </div>
                <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
                <p className="text-sm text-slate-600">Total Users</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="text-green-600" size={24} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{stats.totalStudents}</p>
                <p className="text-sm text-slate-600">Students</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="text-purple-600" size={24} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{stats.totalTeachers}</p>
                <p className="text-sm text-slate-600">Teachers</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <ClipboardList className="text-orange-600" size={24} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{stats.totalExams}</p>
                <p className="text-sm text-slate-600">Total Exams</p>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Button onClick={() => setActiveTab('users')} className="w-full">
                  <PlusCircle size={18} className="mr-2" />
                  Add User
                </Button>
                <Button variant="secondary" className="w-full">
                  <ClipboardList size={18} className="mr-2" />
                  Manage Exams
                </Button>
                <Button variant="secondary" className="w-full">
                  <BarChart size={18} className="mr-2" />
                  View Reports
                </Button>
                <Button variant="secondary" className="w-full">
                  <Settings size={18} className="mr-2" />
                  System Settings
                </Button>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start justify-between p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-700 flex-1">{activity.action}</p>
                    <span className="text-xs text-slate-500 whitespace-nowrap ml-4">{activity.time}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* System Health */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6">
                <h4 className="font-semibold text-slate-900 mb-2">Server Status</h4>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-700">Online</span>
                </div>
              </Card>
              <Card className="p-6">
                <h4 className="font-semibold text-slate-900 mb-2">Database</h4>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-700">Connected</span>
                </div>
              </Card>
              <Card className="p-6">
                <h4 className="font-semibold text-slate-900 mb-2">Storage</h4>
                <p className="text-sm text-slate-600">2.4 GB / 10 GB used</p>
              </Card>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Manage Users ({users.length})</h3>
              <Button onClick={() => setShowAddUserModal(true)}>
                <PlusCircle size={18} className="mr-2" />
                Add User
              </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              <Button variant="secondary" size="sm">All Users</Button>
              <Button variant="ghost" size="sm">Students</Button>
              <Button variant="ghost" size="sm">Teachers</Button>
              <Button variant="ghost" size="sm">Admins</Button>
              <Button variant="ghost" size="sm">Active</Button>
              <Button variant="ghost" size="sm">Inactive</Button>
            </div>

            {/* User List */}
            <div className="grid gap-4">
              {users.map((userData) => (
                <Card key={userData.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-lg">
                        {userData.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-900">{userData.name}</h4>
                          <Badge className={getRoleColor(userData.role)}>
                            {userData.role}
                          </Badge>
                          <Badge color={userData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}>
                            {userData.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{userData.email}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>Last login: {new Date(userData.lastLogin).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>Joined: {new Date(userData.createdAt).toLocaleDateString()}</span>
                          {userData.examsCompleted && <><span>•</span><span>{userData.examsCompleted} exams completed</span></>}
                          {userData.examsCreated && <><span>•</span><span>{userData.examsCreated} exams created</span></>}
                        </div>
                      </div>
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

        {/* Exams Tab */}
        {activeTab === 'exams' && (
          <div>
            {showExamCreator ? (
              <ExamCreator
                onSave={handleSaveExam}
                onCancel={() => setShowExamCreator(false)}
              />
            ) : (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Exam Management</h3>
                  <Button onClick={() => setShowExamCreator(true)}>
                    <PlusCircle size={18} className="mr-2" />
                    Create Exam
                  </Button>
                </div>
                <p className="text-slate-600 mb-6">
                  Manage all exams across the platform. Review, approve, or remove exams created by teachers.
                </p>
              <div className="space-y-3">
                {[
                  { id: '1', title: 'N3 Grammar Practice', teacher: 'Tanaka Sensei', students: 25, status: 'published' },
                  { id: '2', title: 'N2 Reading Comprehension', teacher: 'Yamamoto Sensei', students: 15, status: 'published' },
                  { id: '3', title: 'N4 Vocabulary Test', teacher: 'Suzuki Sensei', students: 0, status: 'draft' },
                ].map((exam) => (
                  <div key={exam.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-slate-900">{exam.title}</h4>
                        <Badge color={exam.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {exam.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">
                        Created by {exam.teacher} • {exam.students} students enrolled
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">
                        <Eye size={16} />
                      </Button>
                      <Button variant="secondary" size="sm">
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 size={16} className="text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">System Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">User Growth</h4>
                  <div className="h-48 flex items-end justify-around gap-2">
                    {[45, 60, 75, 85, 90, 98, 127].map((value, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-primary-500 rounded-t"
                          style={{ height: `${(value / 127) * 100}%` }}
                        ></div>
                        <span className="text-xs text-slate-500 mt-2">W{i+1}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Exam Completions</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">This Week</span>
                        <span className="font-medium">342</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Last Week</span>
                        <span className="font-medium">298</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '72%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">2 Weeks Ago</span>
                        <span className="font-medium">256</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
