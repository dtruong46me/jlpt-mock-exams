# JLPT Mock Exam Platform

A comprehensive web application for creating, taking, and reviewing JLPT (Japanese Language Proficiency Test) mock exams.

## Features

- 📝 **Exam Creation**: Teachers can create custom JLPT exams with multiple sections
- 📖 **Furigana Support**: Display ruby text above kanji using `{漢字|かんじ}` format
- 🎯 **Multiple Question Types**: Vocabulary, Grammar, Reading, and Listening
- ⏱️ **Timed Exams**: Automatic submission when time runs out
- 📊 **Results & Review**: Detailed answer review with explanations
- 👥 **Role-based Access**: Student, Teacher, and Admin roles
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS

## Documentation

- [Quick Start Guide](./docs/QUICK_START.md)
- [Database Design](./docs/DATABASE_DESIGN.md)
- [Database Setup Guide](./docs/DATABASE_SETUP.md)
- [API Documentation](./docs/API_DOCUMENTATION.md)
- [Exam Creator Guide](./docs/EXAM_CREATOR_GUIDE.md)
- [Authentication Guide](./docs/AUTH_README.md)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:5173` to see the application.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL) - See [Database Setup](./docs/DATABASE_SETUP.md)
- **Authentication**: Supabase Auth

## Project Structure

```
jlpt-mock-exams/
├── components/          # Reusable UI components
│   ├── FuriganaText.tsx # Ruby text renderer
│   ├── UI.tsx           # Common UI components
│   └── ...
├── views/               # Page components
│   ├── ExamTake.tsx     # Exam taking interface
│   ├── Result.tsx       # Results and review
│   └── ...
├── docs/                # Documentation
├── types.ts             # TypeScript type definitions
└── constants.ts         # Mock data (to be replaced with DB)
```

## Furigana Format

Use the format `{漢字|かんじ}` in your questions to display furigana:

```
この{漢字|かんじ}の{読み方|よみかた}を{教|おし}えてください。
```

This will render with small hiragana above the kanji characters.

## License

MIT
