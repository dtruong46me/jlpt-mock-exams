# API Documentation

This document describes the API endpoints and data service layer for the JLPT Mock Exam application.

## Service Layer Architecture

```
UI Components
     ↓
API Services (services/database.ts)
     ↓
Database Client (Supabase/PostgreSQL)
     ↓
Database
```

## Authentication APIs

### Sign Up
```typescript
createUser(email: string, password: string, name: string, role?: string): Promise<User>
```

**Example:**
```typescript
const user = await createUser('student@example.com', 'password123', 'John Doe', 'student');
```

### Login
```typescript
loginUser(email: string, password: string): Promise<User>
```

**Example:**
```typescript
const user = await loginUser('student@example.com', 'password123');
```

### Get Current User
```typescript
getCurrentUser(): Promise<User | null>
```

### Logout
```typescript
logoutUser(): Promise<void>
```

## Exam APIs

### Get All Exams
```typescript
getExams(level?: JLPTLevel, status?: 'draft' | 'published'): Promise<Exam[]>
```

**Example:**
```typescript
// Get all published N3 exams
const exams = await getExams('N3', 'published');
```

### Get Exam by ID
```typescript
getExamById(examId: string): Promise<Exam>
```

**Example:**
```typescript
const exam = await getExamById('n3-dec-2023');
```

### Create Exam
```typescript
createExam(exam: Partial<Exam>, userId: string): Promise<Exam>
```

**Example:**
```typescript
const newExam = await createExam({
  title: 'JLPT N3 Practice Test',
  level: 'N3',
  totalQuestions: 20,
  totalDuration: 120,
  sections: [...]
}, currentUser.id);
```

### Update Exam
```typescript
updateExam(examId: string, updates: Partial<Exam>): Promise<Exam>
```

### Delete Exam
```typescript
deleteExam(examId: string): Promise<void>
```

## Exam Results APIs

### Save Exam Result
```typescript
saveExamResult(result: ExamResult, userId: string): Promise<ExamResult>
```

**Example:**
```typescript
const savedResult = await saveExamResult({
  examId: 'n3-dec-2023',
  score: 150,
  totalScore: 180,
  correctCount: 15,
  totalQuestions: 20,
  answers: {...},
  date: new Date().toISOString(),
  timeSpentSeconds: 3600
}, currentUser.id);
```

### Get User Results
```typescript
getUserResults(userId: string): Promise<ExamResult[]>
```

**Example:**
```typescript
const results = await getUserResults(currentUser.id);
```

### Get Result by ID
```typescript
getResultById(resultId: string): Promise<ExamResult>
```

## Question APIs

### Get Questions by Section
```typescript
getQuestionsBySection(sectionId: string): Promise<Question[]>
```

### Create Question
```typescript
createQuestion(question: Partial<Question>): Promise<Question>
```

### Update Question
```typescript
updateQuestion(questionId: string, updates: Partial<Question>): Promise<Question>
```

### Delete Question
```typescript
deleteQuestion(questionId: string): Promise<void>
```

## Error Handling

All API functions throw errors that should be caught and handled:

```typescript
try {
  const exams = await getExams('N3');
  setExams(exams);
} catch (error) {
  console.error('Failed to load exams:', error);
  setError('Failed to load exams. Please try again.');
}
```

## Loading States

Implement loading states in components:

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

async function loadData() {
  setLoading(true);
  setError(null);
  try {
    const data = await getExams();
    setExams(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}
```

## Caching Strategy

For better performance, implement caching:

```typescript
// Simple in-memory cache
const examCache = new Map<string, Exam>();

export async function getCachedExam(examId: string): Promise<Exam> {
  if (examCache.has(examId)) {
    return examCache.get(examId)!;
  }
  
  const exam = await getExamById(examId);
  examCache.set(examId, exam);
  return exam;
}
```

## Real-time Updates (Supabase)

Subscribe to real-time changes:

```typescript
// Subscribe to exam updates
const subscription = supabase
  .channel('exams')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'exams' },
    (payload) => {
      console.log('Exam changed:', payload);
      // Update UI
    }
  )
  .subscribe();

// Cleanup
return () => {
  subscription.unsubscribe();
};
```

## File Upload (Audio/Images)

For uploading audio files and images:

```typescript
export async function uploadFile(file: File, bucket: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);
  
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);
  
  return publicUrl;
}

// Usage
const audioUrl = await uploadFile(audioFile, 'audio-files');
const imageUrl = await uploadFile(imageFile, 'question-images');
```

## Pagination

For large datasets, implement pagination:

```typescript
export async function getExamsPaginated(
  page: number = 1,
  pageSize: number = 10,
  level?: JLPTLevel
) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;
  
  let query = supabase
    .from('exams')
    .select('*', { count: 'exact' })
    .range(start, end);
  
  if (level) query = query.eq('level', level);
  
  const { data, error, count } = await query;
  if (error) throw error;
  
  return {
    exams: data,
    total: count,
    page,
    pageSize,
    totalPages: Math.ceil(count / pageSize)
  };
}
```

## Search and Filtering

```typescript
export async function searchExams(searchTerm: string) {
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .ilike('title', `%${searchTerm}%`);
  
  if (error) throw error;
  return data;
}
```

---

**Related Documentation:**
- [Database Design](./DATABASE_DESIGN.md)
- [Database Setup](./DATABASE_SETUP.md)
