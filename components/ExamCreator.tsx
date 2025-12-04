import React, { useState, useEffect } from 'react';
import { Exam, ExamSection, Question, JLPTLevel, ExamDraft } from '../types';
import { Button, Card, Badge } from './UI';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Check, 
  PlusCircle,
  Eye,
  Edit,
  Trash2 
} from './Icons';
import QuestionEditor from './QuestionEditor';

interface ExamCreatorProps {
  onSave: (exam: Exam) => void;
  onCancel: () => void;
  existingDraft?: ExamDraft;
}

const ExamCreator: React.FC<ExamCreatorProps> = ({ onSave, onCancel, existingDraft }) => {
  const [currentStep, setCurrentStep] = useState(existingDraft?.step || 1);
  const [isDraft, setIsDraft] = useState(true);

  // Step 1: Basic Information
  const [basicInfo, setBasicInfo] = useState({
    title: existingDraft?.basicInfo.title || '',
    level: (existingDraft?.basicInfo.level || 'N3') as JLPTLevel,
    description: existingDraft?.basicInfo.description || ''
  });

  // Step 2: Sections
  const [sections, setSections] = useState<ExamSection[]>(
    existingDraft?.sections || []
  );

  // Step 3: Questions
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

  const steps = [
    { id: 1, name: 'Basic Info', description: 'Exam details' },
    { id: 2, name: 'Sections', description: 'Organize content' },
    { id: 3, name: 'Questions', description: 'Add questions' }
  ];

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraft();
    }, 5000); // Auto-save every 5 seconds

    return () => clearTimeout(timer);
  }, [basicInfo, sections, currentStep]);

  const saveDraft = () => {
    const draft: ExamDraft = {
      id: existingDraft?.id || `draft-${Date.now()}`,
      step: currentStep,
      basicInfo,
      sections,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem('examDraft', JSON.stringify(draft));
  };

  const handleNext = () => {
    if (currentStep === 1 && !basicInfo.title) {
      alert('Please enter exam title');
      return;
    }
    if (currentStep === 2 && sections.length === 0) {
      alert('Please add at least one section');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleAddSection = () => {
    const newSection: ExamSection = {
      id: `section-${Date.now()}`,
      title: `Section ${sections.length + 1}`,
      questions: [],
      durationMinutes: 30
    };
    setSections([...sections, newSection]);
  };

  const handleDeleteSection = (index: number) => {
    if (sections.length === 1) {
      alert('Exam must have at least one section');
      return;
    }
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleUpdateSection = (index: number, updated: Partial<ExamSection>) => {
    setSections(sections.map((section, i) => 
      i === index ? { ...section, ...updated } : section
    ));
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      type: 'vocabulary',
      number: sections[currentSectionIndex].questions.length + 1,
      question: '',
      options: [
        { id: `opt-${Date.now()}-1`, text: '' },
        { id: `opt-${Date.now()}-2`, text: '' },
        { id: `opt-${Date.now()}-3`, text: '' },
        { id: `opt-${Date.now()}-4`, text: '' }
      ],
      correctOptionId: `opt-${Date.now()}-1`,
      explanation: ''
    };

    const updatedSections = [...sections];
    updatedSections[currentSectionIndex].questions.push(newQuestion);
    setSections(updatedSections);
    setEditingQuestionIndex(updatedSections[currentSectionIndex].questions.length - 1);
  };

  const handleUpdateQuestion = (questionIndex: number, updatedQuestion: Question) => {
    const updatedSections = [...sections];
    updatedSections[currentSectionIndex].questions[questionIndex] = updatedQuestion;
    setSections(updatedSections);
  };

  const handleDeleteQuestion = (questionIndex: number) => {
    const updatedSections = [...sections];
    updatedSections[currentSectionIndex].questions.splice(questionIndex, 1);
    // Renumber questions
    updatedSections[currentSectionIndex].questions.forEach((q, i) => {
      q.number = i + 1;
    });
    setSections(updatedSections);
    setEditingQuestionIndex(null);
  };

  const handleFinish = (publish: boolean) => {
    // Validate
    if (!basicInfo.title) {
      alert('Please enter exam title');
      return;
    }
    if (sections.length === 0) {
      alert('Please add at least one section');
      return;
    }
    if (sections.some(s => s.questions.length === 0)) {
      alert('All sections must have at least one question');
      return;
    }

    const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);
    const totalDuration = sections.reduce((sum, s) => sum + s.durationMinutes, 0);

    const exam: Exam = {
      id: `exam-${Date.now()}`,
      title: basicInfo.title,
      level: basicInfo.level,
      totalQuestions,
      totalDuration,
      sections,
      status: publish ? 'published' : 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Clear draft
    localStorage.removeItem('examDraft');
    onSave(exam);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Step Indicator */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Create Exam</h2>
          <Button variant="ghost" size="sm" onClick={() => {
            saveDraft();
            alert('Draft saved!');
          }}>
            <Save size={16} className="mr-2" />
            Save Draft
          </Button>
        </div>

        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                    ${currentStep === step.id
                      ? 'bg-primary-600 text-white'
                      : currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                    }
                  `}
                >
                  {currentStep > step.id ? <Check size={20} /> : step.id}
                </div>
                <div className="text-center mt-2">
                  <p className={`text-sm font-medium ${currentStep === step.id ? 'text-primary-600' : 'text-slate-600'}`}>
                    {step.name}
                  </p>
                  <p className="text-xs text-slate-500">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 rounded ${currentStep > step.id ? 'bg-green-500' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <Card className="p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Basic Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Exam Title *
              </label>
              <input
                type="text"
                value={basicInfo.title}
                onChange={(e) => setBasicInfo({ ...basicInfo, title: e.target.value })}
                placeholder="e.g., JLPT N3 Full Mock Exam"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                JLPT Level *
              </label>
              <select
                value={basicInfo.level}
                onChange={(e) => setBasicInfo({ ...basicInfo, level: e.target.value as JLPTLevel })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="N5">N5 - Beginner</option>
                <option value="N4">N4 - Elementary</option>
                <option value="N3">N3 - Intermediate</option>
                <option value="N2">N2 - Pre-Advanced</option>
                <option value="N1">N1 - Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={basicInfo.description}
                onChange={(e) => setBasicInfo({ ...basicInfo, description: e.target.value })}
                placeholder="Brief description of the exam..."
                rows={4}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Step 2: Sections */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Exam Sections</h3>
            <Button onClick={handleAddSection}>
              <PlusCircle size={18} className="mr-2" />
              Add Section
            </Button>
          </div>

          {sections.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-slate-500 mb-4">No sections yet</p>
              <Button onClick={handleAddSection}>
                <PlusCircle size={18} className="mr-2" />
                Add First Section
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {sections.map((section, index) => (
                <Card key={section.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge className="bg-primary-100 text-primary-700">
                      Section {index + 1}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSection(index)}
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => handleUpdateSection(index, { title: e.target.value })}
                        placeholder="e.g., Language Knowledge (Vocabulary)"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={section.durationMinutes}
                        onChange={(e) => handleUpdateSection(index, { durationMinutes: parseInt(e.target.value) })}
                        min="5"
                        max="180"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-slate-600">
                    {section.questions.length} question(s) in this section
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Questions */}
      {currentStep === 3 && (
        <div className="space-y-4">
          {/* Section Selector */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700">
                  Current Section:
                </label>
                <select
                  value={currentSectionIndex}
                  onChange={(e) => {
                    setCurrentSectionIndex(parseInt(e.target.value));
                    setEditingQuestionIndex(null);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {sections.map((section, index) => (
                    <option key={section.id} value={index}>
                      {section.title} ({section.questions.length} questions)
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={handleAddQuestion}>
                <PlusCircle size={18} className="mr-2" />
                Add Question
              </Button>
            </div>
          </Card>

          {/* Questions List */}
          {sections[currentSectionIndex]?.questions.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-slate-500 mb-4">No questions in this section yet</p>
              <Button onClick={handleAddQuestion}>
                <PlusCircle size={18} className="mr-2" />
                Add First Question
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {sections[currentSectionIndex]?.questions.map((question, qIndex) => (
                <div key={question.id}>
                  {editingQuestionIndex === qIndex ? (
                    <QuestionEditor
                      question={question}
                      questionNumber={question.number}
                      onChange={(updated) => handleUpdateQuestion(qIndex, updated)}
                      onDelete={() => handleDeleteQuestion(qIndex)}
                    />
                  ) : (
                    <Card className="p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-primary-100 text-primary-700">
                              Q{question.number}
                            </Badge>
                            <Badge>{question.type}</Badge>
                          </div>
                          <p className="text-slate-900 font-medium mb-1">{question.question || 'Untitled question'}</p>
                          <p className="text-sm text-slate-600">{question.options.length} options</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setEditingQuestionIndex(qIndex)}
                          >
                            <Edit size={16} className="mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteQuestion(qIndex)}
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <div>
          {currentStep > 1 && (
            <Button variant="secondary" onClick={handleBack}>
              <ArrowLeft size={18} className="mr-2" />
              Back
            </Button>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          
          {currentStep < 3 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight size={18} className="ml-2" />
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => handleFinish(false)}>
                <Save size={18} className="mr-2" />
                Save as Draft
              </Button>
              <Button onClick={() => handleFinish(true)}>
                <Check size={18} className="mr-2" />
                Publish Exam
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamCreator;
