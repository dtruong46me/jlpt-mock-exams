# Database Design for JLPT Mock Exam System

## Overview

This document outlines the database schema design for the JLPT Mock Exam application, including tables, relationships, and implementation guidelines.

## Database Schema

### 1. Users Table

Stores user authentication and profile information.

```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role ENUM('student', 'teacher', 'admin') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);
```

### 2. Exams Table

Stores exam metadata and configuration.

```sql
CREATE TABLE exams (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  level ENUM('N1', 'N2', 'N3', 'N4', 'N5') NOT NULL,
  total_questions INT NOT NULL,
  total_duration INT NOT NULL, -- in minutes
  status ENUM('draft', 'published') DEFAULT 'draft',
  created_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_level (level),
  INDEX idx_status (status),
  INDEX idx_created_by (created_by)
);
```

### 3. Exam Sections Table

Stores sections within each exam.

```sql
CREATE TABLE exam_sections (
  id VARCHAR(36) PRIMARY KEY,
  exam_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  duration_minutes INT NOT NULL,
  order_index INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
  INDEX idx_exam_id (exam_id),
  INDEX idx_order (exam_id, order_index)
);
```

### 4. Questions Table

Stores all questions with support for different question types.

```sql
CREATE TABLE questions (
  id VARCHAR(36) PRIMARY KEY,
  section_id VARCHAR(36) NOT NULL,
  type ENUM('vocabulary', 'grammar', 'reading', 'listening') NOT NULL,
  number INT NOT NULL,
  question TEXT NOT NULL,
  context TEXT,
  reading_text TEXT,
  audio_url VARCHAR(500),
  image_url VARCHAR(500),
  correct_option_id VARCHAR(36) NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (section_id) REFERENCES exam_sections(id) ON DELETE CASCADE,
  INDEX idx_section_id (section_id),
  INDEX idx_type (type)
);
```

### 5. Question Options Table

Stores answer options for each question.

```sql
CREATE TABLE question_options (
  id VARCHAR(36) PRIMARY KEY,
  question_id VARCHAR(36) NOT NULL,
  text TEXT NOT NULL,
  order_index INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  INDEX idx_question_id (question_id)
);
```

### 6. Exam Results Table

Stores student exam attempts and results.

```sql
CREATE TABLE exam_results (
  id VARCHAR(36) PRIMARY KEY,
  exam_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  score INT NOT NULL,
  total_score INT NOT NULL,
  correct_count INT NOT NULL,
  total_questions INT NOT NULL,
  time_spent_seconds INT NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_exam_id (exam_id),
  INDEX idx_user_id (user_id),
  INDEX idx_completed_at (completed_at)
);
```

### 7. User Answers Table

Stores individual answers for each question in an exam attempt.

```sql
CREATE TABLE user_answers (
  id VARCHAR(36) PRIMARY KEY,
  result_id VARCHAR(36) NOT NULL,
  question_id VARCHAR(36) NOT NULL,
  selected_option_id VARCHAR(36) NOT NULL,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (result_id) REFERENCES exam_results(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  FOREIGN KEY (selected_option_id) REFERENCES question_options(id) ON DELETE CASCADE,
  INDEX idx_result_id (result_id),
  INDEX idx_question_id (question_id)
);
```

### 8. Exam Drafts Table (Optional)

Stores work-in-progress exams for teachers/admins.

```sql
CREATE TABLE exam_drafts (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  step INT DEFAULT 1,
  title VARCHAR(255),
  level ENUM('N1', 'N2', 'N3', 'N4', 'N5'),
  description TEXT,
  draft_data JSON, -- Stores the entire draft structure
  last_saved TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);
```

## Entity Relationship Diagram

```
┌─────────────┐
│    Users    │
└──────┬──────┘
       │
       ├──────────────────────────────┐
       │                              │
       ▼                              ▼
┌─────────────┐              ┌──────────────┐
│    Exams    │              │ Exam Results │
└──────┬──────┘              └──────┬───────┘
       │                            │
       ▼                            ▼
┌──────────────┐            ┌──────────────┐
│Exam Sections │            │User Answers  │
└──────┬───────┘            └──────────────┘
       │
       ▼
┌──────────────┐
│  Questions   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Options    │
└──────────────┘
```

## Database Technology Recommendations

### Option 1: PostgreSQL (Recommended for Production)
- **Pros**: Robust, supports JSON, excellent for complex queries
- **Cons**: Requires server setup
- **Best for**: Production deployment, scalability

### Option 2: MySQL/MariaDB
- **Pros**: Widely supported, good performance
- **Cons**: Less advanced JSON support than PostgreSQL
- **Best for**: Traditional web hosting environments

### Option 3: SQLite (Current Development)
- **Pros**: No server needed, file-based, perfect for prototyping
- **Cons**: Limited concurrency, not ideal for production
- **Best for**: Development, small-scale deployments

### Option 4: Supabase (Recommended for Quick Start)
- **Pros**: PostgreSQL + Auth + Real-time + Storage, generous free tier
- **Cons**: Vendor lock-in
- **Best for**: Rapid development, MVP

## Implementation Steps

### Phase 1: Setup Database Connection

1. **Install Database Client**
   ```bash
   npm install @supabase/supabase-js
   # OR for direct PostgreSQL
   npm install pg
   # OR for MySQL
   npm install mysql2
   ```

2. **Create Database Configuration**
   - See `DATABASE_SETUP.md` for detailed setup instructions

### Phase 2: Create Database Tables

1. Run migration scripts (see `migrations/` folder)
2. Seed initial data (admin user, sample exams)

### Phase 3: Implement Data Layer

1. Create API service layer (`services/database.ts`)
2. Implement CRUD operations for each entity
3. Add data validation and error handling

### Phase 4: Connect to UI

1. Replace mock data in `constants.ts` with database queries
2. Update components to fetch from API
3. Implement loading states and error handling

## Data Migration Strategy

To migrate from current mock data to database:

1. **Export Current Data**: Convert `constants.ts` to SQL insert statements
2. **Create Seed Script**: Populate database with initial exams
3. **Update Data Layer**: Replace static imports with API calls
4. **Test Thoroughly**: Ensure all features work with real database

## Security Considerations

1. **Password Hashing**: Use bcrypt with salt rounds ≥ 10
2. **SQL Injection**: Use parameterized queries
3. **Authentication**: Implement JWT or session-based auth
4. **Authorization**: Verify user roles before data access
5. **Data Validation**: Validate all inputs on server side

## Performance Optimization

1. **Indexing**: Add indexes on frequently queried columns
2. **Caching**: Cache exam data to reduce database load
3. **Pagination**: Implement pagination for large result sets
4. **Connection Pooling**: Reuse database connections

## Next Steps

1. Review `DATABASE_SETUP.md` for implementation guide
2. Choose database technology based on requirements
3. Set up development database
4. Create migration scripts
5. Implement API layer
6. Update UI components

---

**Related Documentation:**
- [Database Setup Guide](./DATABASE_SETUP.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Authentication Guide](../AUTH_README.md)
