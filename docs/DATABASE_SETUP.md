# Database Setup Guide

This guide walks you through setting up a database for the JLPT Mock Exam application.

## Quick Start with Supabase (Recommended)

Supabase provides PostgreSQL database, authentication, and APIs out of the box.

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Note your project URL and anon key

### 2. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 3. Create Environment Variables

Create `.env.local` file:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Initialize Supabase Client

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 5. Run Database Migrations

In Supabase Dashboard → SQL Editor, run the migration script:

```sql
-- See migrations/001_initial_schema.sql
```

## Alternative: Local PostgreSQL Setup

### 1. Install PostgreSQL

**Windows:**
```bash
# Download from postgresql.org
# Or use chocolatey
choco install postgresql
```

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

```bash
createdb jlpt_mock_exams
```

### 3. Install Node.js Client

```bash
npm install pg
```

### 4. Create Database Connection

Create `src/lib/database.ts`:

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'jlpt_mock_exams',
  password: 'your_password',
  port: 5432,
});

export default pool;
```

### 5. Run Migrations

```bash
psql -d jlpt_mock_exams -f migrations/001_initial_schema.sql
```

## Database Service Layer

Create `src/services/database.ts`:

```typescript
import { supabase } from '../lib/supabase';
import { Exam, Question, ExamResult, User } from '../types';

// ============ USERS ============

export async function createUser(email: string, password: string, name: string, role: string = 'student') {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role }
    }
  });
  
  if (error) throw error;
  return data.user;
}

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data.user;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ============ EXAMS ============

export async function getExams(level?: string, status?: string) {
  let query = supabase
    .from('exams')
    .select(`
      *,
      exam_sections (
        *,
        questions (
          *,
          question_options (*)
        )
      )
    `);
  
  if (level) query = query.eq('level', level);
  if (status) query = query.eq('status', status);
  
  const { data, error } = await query;
  if (error) throw error;
  
  return transformExamsFromDB(data);
}

export async function getExamById(examId: string): Promise<Exam> {
  const { data, error } = await supabase
    .from('exams')
    .select(`
      *,
      exam_sections (
        *,
        questions (
          *,
          question_options (*)
        )
      )
    `)
    .eq('id', examId)
    .single();
  
  if (error) throw error;
  return transformExamFromDB(data);
}

export async function createExam(exam: Partial<Exam>, userId: string) {
  // Insert exam
  const { data: examData, error: examError } = await supabase
    .from('exams')
    .insert({
      id: exam.id,
      title: exam.title,
      level: exam.level,
      total_questions: exam.totalQuestions,
      total_duration: exam.totalDuration,
      status: exam.status || 'draft',
      created_by: userId
    })
    .select()
    .single();
  
  if (examError) throw examError;
  
  // Insert sections and questions
  for (const section of exam.sections || []) {
    const { data: sectionData, error: sectionError } = await supabase
      .from('exam_sections')
      .insert({
        id: section.id,
        exam_id: examData.id,
        title: section.title,
        duration_minutes: section.durationMinutes,
        order_index: exam.sections.indexOf(section)
      })
      .select()
      .single();
    
    if (sectionError) throw sectionError;
    
    for (const question of section.questions || []) {
      const { data: questionData, error: questionError } = await supabase
        .from('questions')
        .insert({
          id: question.id,
          section_id: sectionData.id,
          type: question.type,
          number: question.number,
          question: question.question,
          context: question.context,
          reading_text: question.readingText,
          audio_url: question.audioUrl,
          image_url: question.imageUrl,
          correct_option_id: question.correctOptionId,
          explanation: question.explanation
        })
        .select()
        .single();
      
      if (questionError) throw questionError;
      
      // Insert options
      for (const option of question.options || []) {
        await supabase
          .from('question_options')
          .insert({
            id: option.id,
            question_id: questionData.id,
            text: option.text,
            order_index: question.options.indexOf(option)
          });
      }
    }
  }
  
  return examData;
}

// ============ EXAM RESULTS ============

export async function saveExamResult(result: ExamResult, userId: string) {
  // Insert exam result
  const { data: resultData, error: resultError } = await supabase
    .from('exam_results')
    .insert({
      exam_id: result.examId,
      user_id: userId,
      score: result.score,
      total_score: result.totalScore,
      correct_count: result.correctCount,
      total_questions: result.totalQuestions,
      time_spent_seconds: result.timeSpentSeconds
    })
    .select()
    .single();
  
  if (resultError) throw resultError;
  
  // Insert user answers
  const answers = Object.values(result.answers).map(answer => ({
    result_id: resultData.id,
    question_id: answer.questionId,
    selected_option_id: answer.selectedOptionId,
    is_correct: answer.isCorrect
  }));
  
  const { error: answersError } = await supabase
    .from('user_answers')
    .insert(answers);
  
  if (answersError) throw answersError;
  
  return resultData;
}

export async function getUserResults(userId: string) {
  const { data, error } = await supabase
    .from('exam_results')
    .select(`
      *,
      exams (title, level),
      user_answers (*)
    `)
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getResultById(resultId: string) {
  const { data, error } = await supabase
    .from('exam_results')
    .select(`
      *,
      user_answers (
        *,
        questions (*),
        question_options (*)
      )
    `)
    .eq('id', resultId)
    .single();
  
  if (error) throw error;
  return transformResultFromDB(data);
}

// ============ HELPER FUNCTIONS ============

function transformExamFromDB(dbExam: any): Exam {
  return {
    id: dbExam.id,
    title: dbExam.title,
    level: dbExam.level,
    totalQuestions: dbExam.total_questions,
    totalDuration: dbExam.total_duration,
    status: dbExam.status,
    createdBy: dbExam.created_by,
    createdAt: dbExam.created_at,
    updatedAt: dbExam.updated_at,
    sections: dbExam.exam_sections.map((section: any) => ({
      id: section.id,
      title: section.title,
      durationMinutes: section.duration_minutes,
      questions: section.questions.map((q: any) => ({
        id: q.id,
        type: q.type,
        number: q.number,
        question: q.question,
        context: q.context,
        readingText: q.reading_text,
        audioUrl: q.audio_url,
        imageUrl: q.image_url,
        correctOptionId: q.correct_option_id,
        explanation: q.explanation,
        options: q.question_options.map((opt: any) => ({
          id: opt.id,
          text: opt.text
        }))
      }))
    }))
  };
}

function transformExamsFromDB(dbExams: any[]): Exam[] {
  return dbExams.map(transformExamFromDB);
}

function transformResultFromDB(dbResult: any): ExamResult {
  const answers: Record<string, any> = {};
  
  dbResult.user_answers.forEach((answer: any) => {
    answers[answer.question_id] = {
      questionId: answer.question_id,
      selectedOptionId: answer.selected_option_id,
      isCorrect: answer.is_correct
    };
  });
  
  return {
    examId: dbResult.exam_id,
    score: dbResult.score,
    totalScore: dbResult.total_score,
    correctCount: dbResult.correct_count,
    totalQuestions: dbResult.total_questions,
    answers,
    date: dbResult.completed_at,
    timeSpentSeconds: dbResult.time_spent_seconds
  };
}
```

## Update UI Components

### Example: Fetch Exams in StudentDashboard

Replace mock data with database calls:

```typescript
// Before
import { MOCK_EXAMS } from '../constants';

// After
import { getExams } from '../services/database';

// In component
useEffect(() => {
  async function loadExams() {
    try {
      const exams = await getExams('N3', 'published');
      setExams(exams);
    } catch (error) {
      console.error('Failed to load exams:', error);
    }
  }
  loadExams();
}, []);
```

## Migration Script

Create `migrations/001_initial_schema.sql` with the SQL from `DATABASE_DESIGN.md`.

## Seed Data

Create `migrations/002_seed_data.sql`:

```sql
-- Insert admin user (password: admin123)
INSERT INTO users (id, email, password_hash, name, role) VALUES
('admin-1', 'admin@jlpt.com', '$2b$10$...', 'Admin User', 'admin');

-- Insert sample exam
-- (Copy structure from constants.ts)
```

## Testing

1. Test database connection
2. Test CRUD operations
3. Test authentication flow
4. Test exam taking flow
5. Test result storage

---

**Next Steps:**
1. Choose database option (Supabase recommended)
2. Set up database
3. Run migrations
4. Implement service layer
5. Update UI components
6. Test thoroughly
