# Documentation Index

Welcome to the JLPT Mock Exam Platform documentation!

## Getting Started

1. **[Quick Start Guide](./QUICK_START.md)** - Get the app running in minutes
2. **[Authentication Guide](./AUTH_README.md)** - User authentication and roles

## Database & Backend

3. **[Database Design](./DATABASE_DESIGN.md)** - Complete database schema and architecture
4. **[Database Setup Guide](./DATABASE_SETUP.md)** - Step-by-step database implementation
5. **[API Documentation](./API_DOCUMENTATION.md)** - API endpoints and service layer

## Features & Guides

6. **[Exam Creator Guide](./EXAM_CREATOR_GUIDE.md)** - How to create and manage exams

## Quick Links

### For Developers
- [Database Schema](./DATABASE_DESIGN.md#database-schema)
- [API Service Layer](./DATABASE_SETUP.md#database-service-layer)
- [Supabase Setup](./DATABASE_SETUP.md#quick-start-with-supabase-recommended)

### For Content Creators
- [Creating Exams](./EXAM_CREATOR_GUIDE.md)
- [Furigana Format](../README.md#furigana-format)

### For Students
- [Taking Exams](./QUICK_START.md)
- [Viewing Results](./QUICK_START.md)

## Architecture Overview

```
┌─────────────────────────────────────────┐
│          React Frontend (UI)            │
│  - ExamTake, Result, Dashboard, etc.    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      API Service Layer (TypeScript)     │
│  - database.ts, auth.ts, etc.           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│     Database Client (Supabase)          │
│  - PostgreSQL + Auth + Storage          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         PostgreSQL Database             │
│  - Users, Exams, Questions, Results     │
└─────────────────────────────────────────┘
```

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth (JWT-based)
- **File Storage**: Supabase Storage (for audio/images)

## Development Workflow

1. **Setup**: Follow [Quick Start](./QUICK_START.md)
2. **Database**: Set up using [Database Setup](./DATABASE_SETUP.md)
3. **Development**: Make changes and test locally
4. **Testing**: Test all features thoroughly
5. **Deployment**: Deploy to production

## Common Tasks

### Adding a New Feature
1. Design database schema changes (if needed)
2. Create migration script
3. Update TypeScript types
4. Implement API service functions
5. Update UI components
6. Test thoroughly

### Creating Sample Data
1. Use Supabase SQL Editor
2. Insert test users, exams, questions
3. Or use the Exam Creator UI

### Debugging
- Check browser console for errors
- Check Supabase logs
- Use React DevTools
- Check network requests

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev
- **TypeScript Docs**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

## Contributing

When contributing:
1. Follow existing code style
2. Update documentation
3. Add tests where applicable
4. Update migration scripts if changing schema

---

**Last Updated**: December 2025
