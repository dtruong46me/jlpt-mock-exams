# JLPT Mock Exams - Authentication System

## Overview

This project now includes a complete authentication system with role-based access control for three user roles:
- **Student**: Practice exams, take tests, view results
- **Teacher**: Create and manage exams, view student progress
- **Admin**: Manage users, exams, and system settings

## Features

### 🔐 Authentication
- Email-based login system
- Quick login buttons for demo purposes
- Session management with user state
- Secure logout functionality

### 👥 User Roles

#### Student Dashboard
- **Overview**: View stats, progress by level, recent results, study streak
- **Practice**: Daily practice exercises by topic (Vocabulary, Grammar, Reading, Listening)
- **Exams**: Browse and take available JLPT exams (N5-N1)
- **Results**: View detailed exam results with scores and pass/fail status

#### Teacher Dashboard
- **Overview**: View total exams, student counts, average scores, quick actions
- **Create Exam**: Form to create new JLPT exams with title, level, and duration
- **My Exams**: Manage created exams (view, edit, delete, publish)
- **Students**: View enrolled students, their progress and scores

#### Admin Dashboard
- **Overview**: System statistics, user growth, recent activity, system health
- **Manage Users**: View all users, filter by role/status, edit/delete users
- **Manage Exams**: Review and approve exams from teachers
- **Analytics**: System-wide analytics with charts and metrics

### 🎨 UI Components

#### Dashboard Layout
- Collapsible sidebar with role-specific menu items
- Top navigation bar with user info and quick actions
- Responsive design for mobile and desktop
- Role-based color coding (Student: Blue, Teacher: Green, Admin: Purple)

#### Navigation
- Home page with login button
- User profile indicator when logged in
- Quick access to dashboard from home
- Breadcrumb navigation

## Demo Credentials

### Student Account
- **Email**: student@jlpt.com
- **Password**: student123

### Teacher Account
- **Email**: teacher@jlpt.com
- **Password**: teacher123

### Admin Account
- **Email**: admin@jlpt.com
- **Password**: admin123

## File Structure

```
jlpt-mock-exams/
├── views/
│   ├── Login.tsx                 # Login page with authentication
│   ├── StudentDashboard.tsx      # Student role dashboard
│   ├── TeacherDashboard.tsx      # Teacher role dashboard
│   ├── AdminDashboard.tsx        # Admin role dashboard
│   ├── Home.tsx                  # Updated home with login
│   ├── ExamList.tsx              # Exam browsing
│   ├── ExamTake.tsx              # Exam taking interface
│   └── Result.tsx                # Exam results
├── components/
│   ├── DashboardLayout.tsx       # Layout with sidebar and nav
│   ├── UI.tsx                    # Reusable UI components
│   └── Icons.tsx                 # Icon exports
├── App.tsx                       # Main app with routing
├── types.ts                      # TypeScript types including User
└── constants.ts                  # Constants and mock data
```

## Usage

### Starting the Application

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open your browser to the provided localhost URL

### Navigation Flow

1. **Landing Page** → View JLPT levels and browse exams
2. **Sign In** → Click "Sign In" button in navigation
3. **Login Page** → Enter credentials or use quick login
4. **Dashboard** → Role-specific dashboard loads automatically
5. **Home Return** → Click "Home" in sidebar or navigation

### Quick Start Guide

#### For Students:
1. Login with student credentials
2. Choose "Start Practice" or "Take Exam"
3. Select your JLPT level (N5-N1)
4. Complete practice or exam
5. View results and track progress

#### For Teachers:
1. Login with teacher credentials
2. Click "Create New Exam" tab
3. Fill in exam details (title, level, duration)
4. Add questions and sections
5. Publish exam for students

#### For Admins:
1. Login with admin credentials
2. Navigate to "Manage Users" or "Manage Exams"
3. View system analytics
4. Monitor user activity
5. Manage system settings

## Key Features Implemented

✅ Email-based authentication  
✅ Role-based access control (Student, Teacher, Admin)  
✅ Three separate dashboards with unique functionality  
✅ Dashboard layout with collapsible sidebar  
✅ Top navigation with user profile  
✅ Login page with quick demo access  
✅ Logout functionality  
✅ Responsive design for all screen sizes  
✅ Mock user database for testing  
✅ Integration with existing exam system  

## Component Details

### DashboardLayout
Provides consistent layout across all dashboards:
- Left sidebar with role-specific menu items
- Top navigation bar with user info
- Main content area
- Mobile-responsive with overlay

### Login Component
Handles authentication:
- Email and password fields
- Form validation
- Quick login buttons for demo
- Error handling
- Success redirect to dashboard

### Role Dashboards
Each role has dedicated dashboard with:
- Statistics cards
- Quick action buttons
- Tab-based navigation
- Role-specific features
- Data visualization

## Styling

The application uses Tailwind CSS with a custom color scheme:
- Primary: Blue (#3B82F6)
- Student: Blue tones
- Teacher: Green tones
- Admin: Purple tones
- Neutral: Slate gray

## Future Enhancements

- Real backend API integration
- JWT token authentication
- Password reset functionality
- Email verification
- Social login (Google, GitHub)
- User registration flow
- Advanced permissions system
- Real-time notifications
- Profile management
- Avatar uploads

## Technical Notes

- Built with React 19 and TypeScript
- Uses Vite for build tooling
- Lucide React for icons
- Tailwind CSS for styling
- State management via React hooks
- No external auth libraries (custom implementation)

## Development

To extend the authentication system:

1. **Add new roles**: Update `UserRole` type in `types.ts`
2. **Add dashboard**: Create new dashboard component in `views/`
3. **Update routing**: Add route handling in `App.tsx`
4. **Update layout**: Modify menu items in `DashboardLayout.tsx`

## Support

For issues or questions about the authentication system, please refer to the code comments or create an issue in the repository.
