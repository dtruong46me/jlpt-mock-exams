# Exam Creation System - Documentation

## Overview

The exam creation system provides teachers and administrators with a comprehensive 3-step wizard to create JLPT exams with advanced features including:
- Multiple question types (vocabulary, grammar, reading, listening)
- Furigana support with ruby text rendering
- Media uploads (images, audio)
- Draft auto-saving
- Preview and edit modes
- Step-by-step navigation with progress tracking

## Features

### 🎯 3-Step Exam Creation Wizard

#### **Step 1: Basic Information**
- **Exam Title**: Name your exam
- **JLPT Level**: Select from N5 to N1
- **Description**: Optional exam description

#### **Step 2: Sections**
- Add multiple sections to organize content
- Set section title (e.g., "Language Knowledge (Vocabulary)")
- Configure duration per section (5-180 minutes)
- Delete or edit sections
- Minimum 1 section required

#### **Step 3: Questions**
- Switch between sections to add questions
- Create questions with multiple types
- Edit existing questions
- Delete questions
- Questions auto-renumber

### 📝 Question Types

#### 1. **Vocabulary Questions**
- Question text with furigana support
- Context/example sentence (optional)
- Multiple choice options (2-10 options)
- Correct answer selection
- Explanation text

#### 2. **Grammar Questions**
- Question with grammar point
- Context sentence with blank
- Multiple choice options
- Detailed explanation

#### 3. **Reading Comprehension**
- Long reading passage with furigana
- Question about the passage
- Multiple choice answers
- Optional image support
- Explanation

#### 4. **Listening Questions**
- Audio file upload (required)
- Question text
- Optional image
- Multiple choice options
- Explanation

### ✨ Furigana Editor

#### **Edit Mode**
Type Japanese text with furigana using the syntax:
```
{漢字|かんじ}
```

Example:
```
これは{日本語|にほんご}の{勉強|べんきょう}です。
```

#### **Preview Mode**
Renders furigana as ruby text above kanji:
```html
<ruby>日本語<rt>にほんご</rt></ruby>
```

The preview shows exactly how students will see the text in the exam.

#### **Features**
- Toggle between Edit and Preview modes
- "Add Furigana" button inserts template
- Real-time preview rendering
- Syntax: `{kanji|furigana}`

### 🖼️ Media Upload

#### **Image Upload**
- Supported for all question types
- Drag & drop or click to upload
- Image preview thumbnail
- Delete option
- Formats: JPG, PNG, GIF, WebP

#### **Audio Upload**
- Required for listening questions
- Audio player preview
- Replace or delete audio
- Formats: MP3, WAV, OGG, M4A

### 💾 Draft System

#### **Auto-Save**
- Automatically saves every 5 seconds
- Saves to browser localStorage
- Preserves:
  - Current step
  - Basic information
  - All sections
  - All questions
  - Last saved timestamp

#### **Manual Save**
- "Save Draft" button in header
- Confirmation message
- Can resume later from any step

#### **Resume Draft**
- Load existing draft on component mount
- Continue from last saved step
- All data restored

### 🔄 Navigation

#### **Back Button**
- Available from Step 2 and Step 3
- Returns to previous step
- No data loss
- Validates before moving forward

#### **Next Button**
- Validates current step
- Shows error if required fields missing
- Moves to next step

#### **Cancel Button**
- Exits exam creation
- Prompts to save draft
- Returns to dashboard

#### **Finish Options**
1. **Save as Draft**: Saves without publishing
2. **Publish Exam**: Makes exam available to students

## Usage Guide

### For Teachers

#### Creating an Exam

1. **Access Creator**
   - Go to Teacher Dashboard
   - Click "Create Exam" tab
   - Click "Start Creating Exam" button

2. **Step 1: Basic Info**
   - Enter exam title (e.g., "N3 Full Mock Exam December 2024")
   - Select JLPT level
   - Add description (optional)
   - Click "Next"

3. **Step 2: Sections**
   - Click "Add Section"
   - Enter section title (e.g., "言語知識 (文字・語彙)")
   - Set duration in minutes
   - Add more sections as needed
   - Click "Next"

4. **Step 3: Questions**
   - Select section from dropdown
   - Click "Add Question"
   - Fill in question details:
     - Select question type
     - Enter question text with furigana
     - Add context/reading text if needed
     - Upload media (image/audio)
     - Add answer options
     - Mark correct answer (radio button)
     - Add explanation
   - Click outside to save question
   - Repeat for all questions
   - Click "Publish Exam" or "Save as Draft"

#### Adding Furigana

1. Type your Japanese text in any text field
2. For kanji that needs furigana:
   - Click "Add Furigana" button, or
   - Type manually: `{漢字|かんじ}`
3. Toggle to Preview mode to see rendering
4. Example:
   ```
   この{問題|もんだい}を{解|と}いてください。
   ```

#### Editing Questions

1. Navigate to Step 3
2. Click "Edit" button on question card
3. Make changes in the editor
4. Question auto-saves when you edit another question

#### Deleting Questions

1. In edit mode, click trash icon in question header
2. Confirm deletion
3. Remaining questions renumber automatically

### For Administrators

Admins have the same exam creation capabilities as teachers, plus:
- Can edit any teacher's exams
- Can approve/reject submitted exams
- Access from "Manage Exams" tab

## Component Structure

```
ExamCreator (Main Wizard)
├── Step Indicator
├── Step 1: BasicInfo Form
├── Step 2: Sections Manager
│   └── Section Cards (add/edit/delete)
└── Step 3: Questions Manager
    ├── Section Selector
    └── QuestionEditor
        ├── Question Type Selector
        ├── FuriganaEditor (multiple instances)
        │   ├── Edit Mode (textarea)
        │   └── Preview Mode (ruby rendering)
        ├── Image Upload
        ├── Audio Upload (listening)
        ├── Options Editor
        │   └── FuriganaEditor per option
        └── Explanation Editor
```

## File Structure

```
components/
├── ExamCreator.tsx          # Main 3-step wizard
├── QuestionEditor.tsx       # Question editing interface
├── FuriganaEditor.tsx       # Furigana input with preview
└── UI.tsx                   # Reusable UI components

views/
├── TeacherDashboard.tsx     # Integrated with ExamCreator
└── AdminDashboard.tsx       # Integrated with ExamCreator

types.ts                     # Extended with Exam, Question types
```

## API Integration

The current implementation uses mock data. To integrate with a real backend:

### 1. Save Exam
```typescript
const handleSaveExam = async (exam: Exam) => {
  try {
    const response = await fetch('/api/exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exam)
    });
    const savedExam = await response.json();
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

### 2. Upload Media
```typescript
const handleMediaUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  const { url } = await response.json();
  return url;
};
```

### 3. Load Draft
```typescript
const loadDraft = async (userId: string) => {
  const response = await fetch(`/api/exams/draft/${userId}`);
  const draft = await response.json();
  return draft;
};
```

## Validation Rules

### Basic Info (Step 1)
- ✅ Title: Required, min 3 characters
- ✅ Level: Required, must be N1-N5
- ⚠️ Description: Optional

### Sections (Step 2)
- ✅ Minimum 1 section required
- ✅ Section title: Required
- ✅ Duration: 5-180 minutes

### Questions (Step 3)
- ✅ Minimum 1 question per section
- ✅ Question text: Required
- ✅ Options: Minimum 2, maximum 10
- ✅ Correct answer: Must be selected
- ✅ Explanation: Required
- ✅ Audio file: Required for listening questions

## Keyboard Shortcuts

- **Ctrl + S**: Save draft
- **Tab**: Navigate between fields
- **Enter**: Add new option (in options list)
- **Escape**: Cancel current action

## Tips & Best Practices

### Creating Effective Exams

1. **Organize Logically**: Group similar question types in sections
2. **Set Realistic Times**: Allow ~1-2 minutes per question
3. **Use Furigana Wisely**: Add reading hints for N3-N5 levels
4. **Provide Clear Explanations**: Help students learn from mistakes
5. **Test Questions**: Preview before publishing

### Furigana Guidelines

- **N5/N4**: Add furigana for most kanji
- **N3**: Add for uncommon kanji
- **N2/N1**: Minimal furigana, only for rare kanji

### Media Best Practices

- **Images**: Use clear, high-contrast images
- **Audio**: Use high-quality recordings
- **File Size**: Keep images under 2MB, audio under 5MB

## Troubleshooting

### Issue: Furigana not displaying correctly
**Solution**: Check syntax `{kanji|reading}` with no spaces

### Issue: Auto-save not working
**Solution**: Check browser localStorage is enabled

### Issue: Image not uploading
**Solution**: Check file size and format (max 2MB, JPG/PNG only)

### Issue: Can't move to next step
**Solution**: Check validation messages, fill required fields

### Issue: Draft not loading
**Solution**: Check localStorage for saved draft, clear if corrupted

## Future Enhancements

- [ ] Bulk question import from CSV
- [ ] Question templates library
- [ ] Collaborative editing
- [ ] Version history
- [ ] Question bank/reuse
- [ ] Advanced preview mode
- [ ] Print/PDF export
- [ ] Rich text editor for questions
- [ ] Math equation support
- [ ] Video question support

## Support

For assistance with exam creation:
1. Check this documentation
2. View example exams
3. Contact system administrator

---

**Version**: 1.0  
**Last Updated**: December 4, 2024  
**Maintained By**: JLPT Platform Team
