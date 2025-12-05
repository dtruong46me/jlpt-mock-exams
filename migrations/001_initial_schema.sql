-- Initial Database Schema for JLPT Mock Exam System
-- Run this in your PostgreSQL database or Supabase SQL Editor

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- 2. EXAMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  level VARCHAR(2) NOT NULL CHECK (level IN ('N1', 'N2', 'N3', 'N4', 'N5')),
  total_questions INT NOT NULL,
  total_duration INT NOT NULL, -- in minutes
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exams_level ON exams(level);
CREATE INDEX idx_exams_status ON exams(status);
CREATE INDEX idx_exams_created_by ON exams(created_by);

-- ============================================
-- 3. EXAM SECTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS exam_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  duration_minutes INT NOT NULL,
  order_index INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exam_sections_exam_id ON exam_sections(exam_id);
CREATE INDEX idx_exam_sections_order ON exam_sections(exam_id, order_index);

-- ============================================
-- 4. QUESTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES exam_sections(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('vocabulary', 'grammar', 'reading', 'listening')),
  number INT NOT NULL,
  question TEXT NOT NULL,
  context TEXT,
  reading_text TEXT,
  audio_url VARCHAR(500),
  image_url VARCHAR(500),
  correct_option_id UUID NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_questions_section_id ON questions(section_id);
CREATE INDEX idx_questions_type ON questions(type);

-- ============================================
-- 5. QUESTION OPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  order_index INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_question_options_question_id ON question_options(question_id);

-- ============================================
-- 6. EXAM RESULTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS exam_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INT NOT NULL,
  total_score INT NOT NULL,
  correct_count INT NOT NULL,
  total_questions INT NOT NULL,
  time_spent_seconds INT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exam_results_exam_id ON exam_results(exam_id);
CREATE INDEX idx_exam_results_user_id ON exam_results(user_id);
CREATE INDEX idx_exam_results_completed_at ON exam_results(completed_at);

-- ============================================
-- 7. USER ANSWERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  result_id UUID NOT NULL REFERENCES exam_results(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_option_id UUID NOT NULL REFERENCES question_options(id) ON DELETE CASCADE,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_answers_result_id ON user_answers(result_id);
CREATE INDEX idx_user_answers_question_id ON user_answers(question_id);

-- ============================================
-- 8. EXAM DRAFTS TABLE (Optional)
-- ============================================
CREATE TABLE IF NOT EXISTS exam_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  step INT DEFAULT 1,
  title VARCHAR(255),
  level VARCHAR(2) CHECK (level IN ('N1', 'N2', 'N3', 'N4', 'N5')),
  description TEXT,
  draft_data JSONB, -- Stores the entire draft structure
  last_saved TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exam_drafts_user_id ON exam_drafts(user_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (for Supabase)
-- ============================================
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_drafts ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Published exams are visible to all authenticated users
CREATE POLICY "Published exams are viewable by all" ON exams
  FOR SELECT USING (status = 'published' OR created_by = auth.uid());

-- Teachers can create/edit their own exams
CREATE POLICY "Teachers can manage own exams" ON exams
  FOR ALL USING (created_by = auth.uid());

-- Exam sections inherit exam permissions
CREATE POLICY "Sections viewable with exam" ON exam_sections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM exams 
      WHERE exams.id = exam_sections.exam_id 
      AND (exams.status = 'published' OR exams.created_by = auth.uid())
    )
  );

-- Questions inherit section permissions
CREATE POLICY "Questions viewable with section" ON questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM exam_sections 
      JOIN exams ON exams.id = exam_sections.exam_id
      WHERE exam_sections.id = questions.section_id 
      AND (exams.status = 'published' OR exams.created_by = auth.uid())
    )
  );

-- Options inherit question permissions
CREATE POLICY "Options viewable with question" ON question_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM questions 
      JOIN exam_sections ON exam_sections.id = questions.section_id
      JOIN exams ON exams.id = exam_sections.exam_id
      WHERE questions.id = question_options.question_id 
      AND (exams.status = 'published' OR exams.created_by = auth.uid())
    )
  );

-- Users can view their own results
CREATE POLICY "Users can view own results" ON exam_results
  FOR SELECT USING (user_id = auth.uid());

-- Users can create their own results
CREATE POLICY "Users can create own results" ON exam_results
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can view their own answers
CREATE POLICY "Users can view own answers" ON user_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM exam_results 
      WHERE exam_results.id = user_answers.result_id 
      AND exam_results.user_id = auth.uid()
    )
  );

-- Users can manage their own drafts
CREATE POLICY "Users can manage own drafts" ON exam_drafts
  FOR ALL USING (user_id = auth.uid());

-- ============================================
-- INITIAL DATA (Optional)
-- ============================================
-- You can add seed data here or in a separate file
