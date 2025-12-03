import React, { useState, useEffect, useMemo } from 'react';
import { Exam, Question, UserAnswer, ExamResult } from '../types';
import { Button, Card, Badge, Progress, AudioPlayer, cn } from '../components/UI';
import { 
  Clock, CheckCircle, XCircle, Menu, X, ChevronLeft, ChevronRight, AlertCircle, FileText 
} from '../components/Icons';

interface ExamTakeProps {
  exam: Exam;
  onFinish: (result: ExamResult) => void;
  onExit: () => void;
}

const ExamTake: React.FC<ExamTakeProps> = ({ exam, onFinish, onExit }) => {
  // --- State ---
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Relative to section
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});
  const [timeLeft, setTimeLeft] = useState(exam.totalDuration * 60);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Flatten questions for easier absolute indexing if needed, but we'll stick to Section > Question
  const currentSection = exam.sections[currentSectionIndex];
  const currentQuestion = currentSection.questions[currentQuestionIndex];
  
  // Helper to get absolute question number
  const getAbsoluteIndex = (sectionIdx: number, questionIdx: number) => {
    let count = 0;
    for (let i = 0; i < sectionIdx; i++) count += exam.sections[i].questions.length;
    return count + questionIdx + 1;
  };
  
  const absoluteCurrentIndex = getAbsoluteIndex(currentSectionIndex, currentQuestionIndex);
  const totalQuestions = exam.totalQuestions;

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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // --- Handlers ---
  const handleOptionSelect = (optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        selectedOptionId: optionId,
        isCorrect: optionId === currentQuestion.correctOptionId
      }
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentSectionIndex < exam.sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
      setCurrentQuestionIndex(exam.sections[currentSectionIndex - 1].questions.length - 1);
    }
  };

  const handleJumpTo = (sIdx: number, qIdx: number) => {
    setCurrentSectionIndex(sIdx);
    setCurrentQuestionIndex(qIdx);
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
                    const isCurrent = sIdx === currentSectionIndex && qIdx === currentQuestionIndex;
                    return (
                      <button
                        key={q.id}
                        onClick={() => handleJumpTo(sIdx, qIdx)}
                        className={cn(
                          "h-10 w-10 rounded-lg text-sm font-medium flex items-center justify-center transition-all",
                          isCurrent ? "ring-2 ring-primary-600 ring-offset-2 z-10" : "",
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

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth pb-24">
          <div className="max-w-5xl mx-auto h-full flex flex-col">
            
            {/* Split View Container */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:h-full">
              
              {/* Left Panel: Reading/Context (Conditional) */}
              {currentQuestion.readingText ? (
                 <Card className="flex flex-col h-full lg:max-h-[calc(100vh-140px)] overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 p-3 flex items-center gap-2 text-sm font-medium text-slate-600">
                      <FileText size={16} /> Reading Section
                    </div>
                    <div className="p-6 overflow-y-auto font-jp leading-loose text-lg text-slate-800">
                       {currentQuestion.readingText}
                    </div>
                 </Card>
              ) : currentQuestion.type === 'listening' ? (
                 <div className="lg:col-span-2">
                    <div className="max-w-2xl mx-auto">
                       <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                         <span className="bg-indigo-100 text-indigo-700 p-1.5 rounded-md"><CheckCircle size={20} /></span>
                         Listening Section
                       </h2>
                       <AudioPlayer src={currentQuestion.audioUrl || ''} />
                       {currentQuestion.imageUrl && (
                         <img src={currentQuestion.imageUrl} alt="Context" className="mt-6 rounded-xl border border-slate-200 w-full" />
                       )}
                    </div>
                 </div>
              ) : (
                // Spacer for layout consistency or single column centering
                <div className="hidden lg:block lg:col-span-1 lg:order-2" /> 
              )}

              {/* Right Panel: Question & Options */}
              <div className={cn(
                "flex flex-col",
                currentQuestion.readingText ? "lg:h-full lg:overflow-y-auto" : "lg:col-span-2 lg:max-w-2xl lg:mx-auto w-full"
              )}>
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold tracking-wide mb-3 uppercase">
                    Question {absoluteCurrentIndex}
                  </span>
                  
                  {/* Context Sentence (for Vocab/Grammar) */}
                  {currentQuestion.context && (
                    <div className="text-xl font-jp mb-4 leading-relaxed" dangerouslySetInnerHTML={{__html: currentQuestion.context}} />
                  )}
                  
                  <h2 className="text-lg font-medium text-slate-700 font-jp mb-6">
                    {currentQuestion.question}
                  </h2>

                  <div className="space-y-3">
                    {currentQuestion.options.map((opt) => {
                      const isSelected = answers[currentQuestion.id]?.selectedOptionId === opt.id;
                      return (
                        <div 
                          key={opt.id}
                          onClick={() => handleOptionSelect(opt.id)}
                          className={cn(
                            "relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all group",
                            isSelected 
                              ? "border-primary-600 bg-primary-50" 
                              : "border-slate-200 bg-white hover:border-primary-200 hover:bg-slate-50"
                          )}
                        >
                          <div className={cn(
                            "h-6 w-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors",
                            isSelected ? "border-primary-600 bg-primary-600" : "border-slate-300 group-hover:border-primary-300"
                          )}>
                            {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
                          </div>
                          <span className="text-lg font-jp text-slate-800">{opt.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* Sticky Bottom Nav (Mobile Only mostly, but styled for all) */}
      <div className="h-16 bg-white border-t border-slate-200 flex items-center justify-between px-4 lg:px-8 z-30 shrink-0">
        <Button 
          variant="secondary" 
          onClick={handlePrev} 
          disabled={currentSectionIndex === 0 && currentQuestionIndex === 0}
        >
          <ChevronLeft size={16} className="mr-2" /> Prev
        </Button>
        
        <span className="text-sm font-medium text-slate-500 hidden sm:block">
          {Object.keys(answers).length} of {totalQuestions} answered
        </span>

        {absoluteCurrentIndex === totalQuestions ? (
           <Button variant="primary" onClick={handleSubmit}>
             Finish Exam
           </Button>
        ) : (
          <Button variant="primary" onClick={handleNext}>
            Next <ChevronRight size={16} className="ml-2" />
          </Button>
        )}
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