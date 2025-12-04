# Quick Start Guide - Exam Creator

## 🚀 Getting Started

### Access the Exam Creator

**For Teachers:**
1. Login with teacher credentials: `teacher@jlpt.com` / `teacher123`
2. Click **"Create Exam"** tab in dashboard
3. Click **"Start Creating Exam"** button

**For Admins:**
1. Login with admin credentials: `admin@jlpt.com` / `admin123`
2. Click **"Manage Exams"** tab
3. Click **"Create Exam"** button

## 📋 3-Step Process

### Step 1️⃣: Basic Information
```
✓ Exam Title: "JLPT N3 Practice Test"
✓ JLPT Level: N3
✓ Description: Optional details about the exam
```
→ Click **Next**

### Step 2️⃣: Create Sections
```
Example sections:
1. 言語知識 (文字・語彙) - 30 minutes
2. 言語知識 (文法) - 45 minutes
3. 読解 (Reading) - 60 minutes
4. 聴解 (Listening) - 40 minutes
```
→ Click **Next**

### Step 3️⃣: Add Questions
1. Select section from dropdown
2. Click **"Add Question"**
3. Fill in question details
4. Repeat for all questions

## 🎌 Using Furigana

### Syntax
```
{kanji|furigana}
```

### Examples
```
この{問題|もんだい}を{解|と}いてください。
→ Displays: この問題（もんだい）を解（と）いてください。

{日本語|にほんご}を{勉強|べんきょう}します。
→ Displays: 日本語（にほんご）を勉強（べんきょう）します。
```

### Tips
- Click **"Add Furigana"** button to insert template
- Toggle **Preview** to see how it renders
- Use for any text field in questions

## 📝 Question Types

### 1. Vocabulary
- Question + Context sentence
- 4 multiple choice options
- Example: "What does 漢字 mean?"

### 2. Grammar  
- Question with blank
- Context sentence
- 4 options with particles/conjugations

### 3. Reading
- Long reading passage (use furigana!)
- Question about the passage
- 4 comprehension options

### 4. Listening
- **Upload audio file** (required)
- Optional image
- Question based on audio
- 4 answer options

## 🖼️ Adding Media

### Images (All Question Types)
1. Click **"Upload Image"** area
2. Select JPG/PNG file
3. Preview appears below
4. Click ❌ to remove

### Audio (Listening Questions)
1. Click **"Upload Audio"** area
2. Select MP3/WAV file
3. Audio player appears
4. Click 🗑️ to remove

## ✅ Creating Options

### Adding Options
- Click **"Add Option"** for more choices
- Default: 4 options (A, B, C, D)
- Minimum: 2 options
- Maximum: 10 options

### Marking Correct Answer
- Click **radio button** next to correct option
- ⚠️ Must select one correct answer

### Using Furigana in Options
```
Option A: {正|ただ}しい
Option B: {間違|まちが}い
```

## 💾 Saving Your Work

### Auto-Save
- Saves automatically every 5 seconds
- Stored in browser
- Safe to close and resume later

### Manual Save
- Click **"Save Draft"** in header
- Confirmation message appears
- Can publish later

### Publish vs Draft
**Save as Draft:**
- Not visible to students
- Can edit anytime
- Use for incomplete exams

**Publish Exam:**
- Immediately available to students
- Can still edit after publishing
- Recommended when complete

## 🔄 Navigation

### Between Steps
- **Back**: Return to previous step
- **Next**: Move to next step (validates first)
- **Cancel**: Exit without saving

### Between Questions
- Click **"Edit"** to modify question
- Click outside to auto-save
- Click 🗑️ to delete question

## ⚡ Quick Tips

1. **Use Preview Mode**: Always check furigana rendering
2. **Set Realistic Times**: ~1-2 minutes per question
3. **Add Explanations**: Help students learn
4. **Test Before Publishing**: Review all questions
5. **Save Often**: Use "Save Draft" button frequently

## 🎯 Example Workflow

```
1. Login as teacher
2. Dashboard → Create Exam tab
3. Start Creating Exam

Step 1:
- Title: "N3 Grammar Practice"
- Level: N3
- Next

Step 2:
- Add Section: "Grammar Questions"
- Duration: 45 minutes
- Next

Step 3:
- Add Question
- Type: Grammar
- Question: "Choose the correct particle"
- Context: "私___学校に行きます。" with {私|わたし}
- Options:
  A: は ← Mark as correct
  B: が
  C: を
  D: に
- Explanation: "は is used for the topic marker"
- Add more questions...
- Publish Exam
```

## 🐛 Common Issues

**Furigana not showing?**
→ Check syntax: `{kanji|reading}` (no spaces!)

**Can't add options?**
→ Maximum 10 options per question

**Image too large?**
→ Compress to under 2MB

**Can't publish?**
→ Check all sections have questions

**Draft disappeared?**
→ Check browser localStorage enabled

## 📱 Keyboard Shortcuts

- `Ctrl + S`: Save draft
- `Tab`: Next field
- `Escape`: Cancel/Close

## 🎓 Best Practices

### For N5-N4 Levels
- Use furigana for all kanji
- Simple vocabulary
- Clear audio (if listening)

### For N3-N2 Levels
- Furigana for uncommon kanji
- More complex grammar
- Longer reading passages

### For N1 Level
- Minimal furigana
- Advanced vocabulary
- Complex comprehension

## 📊 After Publishing

1. Go to **"My Exams"** tab
2. View exam statistics
3. See student results
4. Edit if needed
5. Monitor performance

## 🆘 Need Help?

1. Read full documentation: `EXAM_CREATOR_GUIDE.md`
2. Check existing exams for examples
3. Contact administrator

---

**Ready to create your first exam?** 🚀

Click **"Start Creating Exam"** and follow the 3 steps!
