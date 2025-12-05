import React, { useState, useEffect, useRef } from 'react';
import { Exam, Question, UserAnswer, ExamResult } from '../types';
import { Button, Card, cn } from '../components/UI';
import {
  Clock, CheckCircle, Menu, X, ChevronLeft, ChevronRight, AlertCircle, FileText
} from '../components/Icons';
import FuriganaText from '../components/FuriganaText';

interface ExamTakeProps {
  exam: Exam;
  onFinish: (result: ExamResult) => void;
  onExit: () => void;
}

const ExamTake: React.FC<ExamTakeProps> = ({ exam, onFinish, onExit }) => {
  // --- State ---
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});
  const [timeLeft, setTimeLeft] = useState(exam.totalDuration * 60);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Refs for scrolling
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const currentSection = exam.sections[currentSectionIndex];
  const totalQuestions = exam.totalQuestions;

  // --- Helper to get absolute question number ---
  const getAbsoluteIndex = (sectionIdx: number, questionIdx: number) => {
    let count = 0;
    for (let i = 0; i < sectionIdx; i++) count += exam.sections[i].questions.length;
    return count + questionIdx + 1;
  };

  // --- Timer ---
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Also scroll the main container if it's the one scrolling
    const mainContainer = document.getElementById('main-scroll-container');
    if (mainContainer) {
      mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentSectionIndex]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // --- Handlers ---
  const handleOptionSelect = (question: Question, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [question.id]: {
        questionId: question.id,
        selectedOptionId: optionId,
        isCorrect: optionId === question.correctOptionId
      }
    }));
  };

  const handleNextSection = () => {
    if (currentSectionIndex < exam.sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
    }
  };

  const handleJumpTo = (sIdx: number, qIdx: number) => {
    if (sIdx !== currentSectionIndex) {
      setCurrentSectionIndex(sIdx);
      // Wait for render then scroll
      setTimeout(() => {
        const qId = exam.sections[sIdx].questions[qIdx].id;
        const el = questionRefs.current[qId];
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else {
      const qId = exam.sections[sIdx].questions[qIdx].id;
      const el = questionRefs.current[qId];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setSidebarOpen(false);
  };

  const handleSubmit = () => {
    const correctCount = (Object.values(answers) as UserAnswer[]).filter(a => a.isCorrect).length;
    // Calculate simplified score
    const score = Math.round((correctCount / totalQuestions) * 180); // JLPT max is 180

    const result: ExamResult = {
      examId: exam.id,
      score,
      totalScore: 180,
      correctCount,
      totalQuestions,
      answers,
      date: new Date().toISOString(),
      timeSpentSeconds: (exam.totalDuration * 60) - timeLeft
    };
    onFinish(result);
  };

  const progressPercentage = (Object.keys(answers).length / totalQuestions) * 100;

  // --- Render ---
  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-600">
            <Menu size={20} />
          </button>
          <div className="hidden sm:block">
            <h1 className="font-bold text-slate-800 text-sm sm:text-base line-clamp-1">{exam.title}</h1>
            <div className="text-xs text-slate-500">{currentSection.title}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <div className={cn(
            "flex items-center gap-2 font-mono text-lg font-medium px-3 py-1 rounded-md transition-colors",
            timeLeft < 300 ? "bg-red-50 text-red-600 animate-pulse" : "bg-slate-100 text-slate-700"
          )}>
            <Clock size={16} />
            {formatTime(timeLeft)}
          </div>

          <Button variant="secondary" size="sm" className="hidden sm:flex" onClick={() => setShowExitConfirm(true)}>
            Exit
          </Button>
        </div>
      </header>

      {/* Progress Line */}
      <div className="h-1 bg-slate-200 shrink-0">
        <div className="h-full bg-primary-600 transition-all duration-300" style={{ width: `${progressPercentage}%` }} />
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar (Desktop: Fixed, Mobile: Overlay) */}
        <aside className={cn(
          "absolute inset-y-0 left-0 z-30 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:relative lg:translate-x-0 overflow-y-auto",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-4 border-b border-slate-100 flex justify-between items-center lg:hidden">
            <span className="font-bold">Question Palette</span>
            <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
          </div>

          <div className="p-4 space-y-6">
            {exam.sections.map((section, sIdx) => (
              <div key={section.id}>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {section.questions.map((q, qIdx) => {
                    const isAnswered = !!answers[q.id];
                    const isCurrentSection = sIdx === currentSectionIndex;
                    return (
                      <button
                        key={q.id}
                        onClick={() => handleJumpTo(sIdx, qIdx)}
                        className={cn(
                          "h-10 w-10 rounded-lg text-sm font-medium flex items-center justify-center transition-all",
                          isCurrentSection ? "ring-1 ring-primary-200" : "", // Highlight current section questions slightly
                          isAnswered
                            ? "bg-primary-100 text-primary-700 border border-primary-200"
                            : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                        )}
                      >
                        {getAbsoluteIndex(sIdx, qIdx)}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 mt-auto border-t border-slate-100">
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-4">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-primary-100 border border-primary-200 rounded"></div> Answered</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-50 border border-slate-200 rounded"></div> Unanswered</div>
            </div>
            <Button variant="primary" className="w-full" onClick={handleSubmit}>
              Submit Exam
            </Button>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="absolute inset-0 bg-black/20 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area - SCROLLABLE LIST */}
        <main
          id="main-scroll-container"
          className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth pb-24 bg-slate-50"
        >
          <div className="max-w-3xl mx-auto space-y-12">

            {/* Section Title */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-slate-800">{currentSection.title}</h2>
              <p className="text-slate-500 mt-1">
                Section {currentSectionIndex + 1} of {exam.sections.length}
              </p>
            </div>

            {currentSection.questions.map((q, qIdx) => {
              const absoluteIndex = getAbsoluteIndex(currentSectionIndex, qIdx);

              return (
                <div
                  key={q.id}
                  ref={el => questionRefs.current[q.id] = el}
                  className="scroll-mt-24" // Offset for sticky header if needed, though header is fixed
                >
                  <Card className="p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                    {/* Question Header */}
                    <div className="flex items-start gap-4 mb-6">
                      <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 text-slate-600 font-bold text-sm">
                        {absoluteIndex}
                      </span>

                      <div className="flex-1">
                        {/* Reading/Context (if attached to single question) */}
                        {q.readingText && (
                          <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100 text-slate-700 font-jp leading-loose">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                              <FileText size={12} /> Reading
                            </div>
                            <FuriganaText text={q.readingText} />
                          </div>
                        )}

                        {/* Listening Audio */}
                        {q.type === 'listening' && q.audioUrl && (
                          <div className="mb-6">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                              <CheckCircle size={12} /> Audio
                            </div>
                            {/* Placeholder for Audio Player - assuming it handles its own state */}
                            <audio controls src={q.audioUrl} className="w-full" />
                          </div>
                        )}

                        {/* Context Sentence */}
                        {q.context && (
                          <div className="text-lg font-jp mb-3 leading-relaxed text-slate-800">
                            <FuriganaText text={q.context} />
                          </div>
                        )}

                        {/* The Question */}
                        <h3 className="text-lg font-medium text-slate-900 font-jp mb-2">
                          <FuriganaText text={q.question} />
                        </h3>

                        {/* Image */}
                        {q.imageUrl && (
                          <img src={q.imageUrl} alt="Question" className="mt-4 rounded-lg border border-slate-200 max-h-64 object-contain" />
                        )}
                      </div>
                    </div>

                    {/* Options */}
                    <div className="pl-12 space-y-3">
                      {q.options.map((opt) => {
                        const isSelected = answers[q.id]?.selectedOptionId === opt.id;
                        return (
                          <div
                            key={opt.id}
                            onClick={() => handleOptionSelect(q, opt.id)}
                            className={cn(
                              "relative flex items-center p-3 rounded-lg border cursor-pointer transition-all group",
                              isSelected
                                ? "border-primary-600 bg-primary-50"
                                : "border-slate-200 bg-white hover:border-primary-200 hover:bg-slate-50"
                            )}
                          >
                            <div className={cn(
                              "h-5 w-5 rounded-full border flex items-center justify-center mr-3 transition-colors shrink-0",
                              isSelected ? "border-primary-600 bg-primary-600" : "border-slate-300 group-hover:border-primary-300"
                            )}>
                              {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                            </div>
                            <span className="text-base font-jp text-slate-700">
                              <FuriganaText text={opt.text} />
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </div>
              );
            })}

            {/* Section Navigation Buttons at bottom of list */}
            <div className="flex items-center justify-between pt-8 pb-12">
              <Button
                variant="secondary"
                onClick={handlePrevSection}
                disabled={currentSectionIndex === 0}
                className="w-32"
              >
                <ChevronLeft size={16} className="mr-2" /> Prev Section
              </Button>

              {currentSectionIndex === exam.sections.length - 1 ? (
                <Button variant="primary" onClick={handleSubmit} size="lg" className="w-40">
                  Finish Exam
                </Button>
              ) : (
                <Button variant="primary" onClick={handleNextSection} className="w-32">
                  Next Section <ChevronRight size={16} className="ml-2" />
                </Button>
              )}
            </div>

          </div>
        </main>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm p-6 text-center">
            <div className="h-12 w-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Exit Exam?</h3>
            <p className="text-slate-500 mb-6">Your progress will be lost. Are you sure you want to quit?</p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => setShowExitConfirm(false)}>Cancel</Button>
              <Button variant="danger" onClick={onExit}>Exit Exam</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ExamTake;