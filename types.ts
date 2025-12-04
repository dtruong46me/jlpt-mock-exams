export type JLPTLevel = 'N1' | 'N2' | 'N3' | 'N4' | 'N5';

export type QuestionType = 'vocabulary' | 'grammar' | 'reading' | 'listening';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  number: number;
  question: string; // The specific question asking what to do
  context?: string; // The sentence or phrase being tested
  readingText?: string; // Long reading passage
  audioUrl?: string; // For listening
  audioFile?: File; // For audio upload
  imageUrl?: string;
  imageFile?: File; // For image upload
  options: Option[];
  correctOptionId: string;
  explanation: string;
}

export interface ExamSection {
  id: string;
  title: string; // e.g., "Language Knowledge (Vocabulary)"
  questions: Question[];
  durationMinutes: number;
}

export interface Exam {
  id: string;
  title: string;
  level: JLPTLevel;
  totalQuestions: number;
  totalDuration: number; // minutes
  sections: ExamSection[];
  status?: 'draft' | 'published';
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExamDraft {
  id: string;
  step: number;
  basicInfo: {
    title: string;
    level: JLPTLevel;
    description: string;
  };
  sections: ExamSection[];
  lastSaved: string;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
}

export interface ExamResult {
  examId: string;
  score: number;
  totalScore: number;
  correctCount: number;
  totalQuestions: number;
  answers: Record<string, UserAnswer>;
  date: string;
  timeSpentSeconds: number;
}