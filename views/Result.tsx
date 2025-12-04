import React, { useState, useRef } from 'react';
import { ExamResult, Exam, Question } from '../types';
import { Button, Card, Badge, cn } from '../components/UI';
import {
  CheckCircle, XCircle, RefreshCw, Home, ChevronRight, BarChart,
  Menu, X, ChevronDown, ChevronUp, FileText
} from '../components/Icons';

interface ResultProps {
  result: ExamResult;
  exam: Exam;
  onRetake: () => void;
  onHome: () => void;
}

const Result: React.FC<ResultProps> = ({ result, exam, onRetake, onHome }) => {
  const [view, setView] = useState<'overview' | 'review'>('overview');
  const percentage = Math.round((result.correctCount / result.totalQuestions) * 100);
  const isPass = percentage >= 60; // JLPT general pass rule (simplified)

  // --- Confetti Effect (CSS only for simplicity) ---
  // In a real app, use a canvas library. Here we simulate the celebration if passed.

  const ResultOverview = () => (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-white shadow-lg mb-6 ring-8 ring-slate-50 relative overflow-hidden">
          <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
            <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
            <path
              className={isPass ? "text-green-500" : "text-red-500"}
              strokeDasharray={`${percentage}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none" stroke="currentColor" strokeWidth="3"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-2xl font-bold text-slate-900">{result.score}</span>
            <span className="text-[10px] text-slate-400 font-medium">/ 180</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {isPass ? "Congratulations!" : "Keep Practicing!"}
        </h1>
        <p className="text-slate-500">
          You scored <span className={isPass ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{percentage}%</span> on {exam.title}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="text-slate-400 mb-1 font-medium text-xs uppercase tracking-wide">Correct Answers</div>
          <div className="text-2xl font-bold text-green-600">{result.correctCount}</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="text-slate-400 mb-1 font-medium text-xs uppercase tracking-wide">Incorrect</div>
          <div className="text-2xl font-bold text-red-600">{result.totalQuestions - result.correctCount}</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="text-slate-400 mb-1 font-medium text-xs uppercase tracking-wide">Time Spent</div>
          <div className="text-2xl font-bold text-slate-700">{Math.floor(result.timeSpentSeconds / 60)}m</div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={() => setView('review')} size="lg">Review Answers</Button>
        <Button variant="secondary" onClick={onRetake} size="lg"><RefreshCw size={18} className="mr-2" /> Retake Exam</Button>
        <Button variant="ghost" onClick={onHome} size="lg"><Home size={18} className="mr-2" /> Home</Button>
      </div>
    </div>
  );

  const ReviewSection = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>({});
    const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const toggleExplanation = (qId: string) => {
      setExpandedExplanations(prev => ({ ...prev, [qId]: !prev[qId] }));
    };

    const scrollToQuestion = (qId: string) => {
      const el = questionRefs.current[qId];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setSidebarOpen(false);
      }
    };

    // Helper to get absolute question number
    const getAbsoluteIndex = (sectionIdx: number, questionIdx: number) => {
      let count = 0;
      for (let i = 0; i < sectionIdx; i++) count += exam.sections[i].questions.length;
      return count + questionIdx + 1;
    };

    return (
      <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-600">
              <Menu size={20} />
            </button>
            <h1 className="font-bold text-slate-800 text-sm sm:text-base">Answer Review</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setView('overview')}>
              Back to Summary
            </Button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden relative">
          {/* Sidebar */}
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
                      const isCorrect = result.answers[q.id]?.isCorrect;
                      const isAnswered = !!result.answers[q.id];

                      return (
                        <button
                          key={q.id}
                          onClick={() => scrollToQuestion(q.id)}
                          className={cn(
                            "h-10 w-10 rounded-lg text-sm font-medium flex items-center justify-center transition-all border",
                            isCorrect
                              ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                              : isAnswered
                                ? "bg-red-100 text-red-700 border-red-200 hover:bg-red-200"
                                : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
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

            <div className="p-4 mt-auto border-t border-slate-100 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-2">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div> Correct</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div> Incorrect</div>
              </div>
              <Button variant="secondary" className="w-full" onClick={onRetake}>
                <RefreshCw size={16} className="mr-2" /> Retake Exam
              </Button>
              <Button variant="ghost" className="w-full" onClick={onHome}>
                <Home size={16} className="mr-2" /> Back Home
              </Button>
            </div>
          </aside>

          {/* Backdrop */}
          {isSidebarOpen && (
            <div
              className="absolute inset-0 bg-black/20 z-20 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth pb-24 bg-slate-50">
            <div className="max-w-3xl mx-auto space-y-8">
              {exam.sections.map((section, sIdx) => (
                <div key={section.id} className="space-y-8">
                  <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800">{section.title}</h2>
                  </div>

                  {section.questions.map((q, qIdx) => {
                    const userAnswer = result.answers[q.id];
                    const isCorrect = userAnswer?.isCorrect;
                    const absoluteIndex = getAbsoluteIndex(sIdx, qIdx);
                    const isExpanded = expandedExplanations[q.id];

                    return (
                      <div
                        key={q.id}
                        ref={el => questionRefs.current[q.id] = el}
                        className="scroll-mt-24"
                      >
                        <Card className={cn(
                          "p-6 md:p-8 shadow-sm transition-shadow border-l-4",
                          isCorrect ? "border-l-green-500" : "border-l-red-500"
                        )}>
                          {/* Header */}
                          <div className="flex items-start gap-4 mb-6">
                            <span className={cn(
                              "flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm text-white",
                              isCorrect ? "bg-green-500" : "bg-red-500"
                            )}>
                              {absoluteIndex}
                            </span>

                            <div className="flex-1">
                              {/* Reading */}
                              {q.readingText && (
                                <div className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-100 text-slate-700 font-jp leading-loose text-sm">
                                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                    <FileText size={12} /> Reading
                                  </div>
                                  {q.readingText}
                                </div>
                              )}

                              {/* Context */}
                              {q.context && (
                                <div className="text-lg font-jp mb-3 leading-relaxed text-slate-800" dangerouslySetInnerHTML={{ __html: q.context }} />
                              )}

                              {/* Question */}
                              <h3 className="text-lg font-medium text-slate-900 font-jp mb-2">
                                {q.question}
                              </h3>

                              {/* Image */}
                              {q.imageUrl && (
                                <img src={q.imageUrl} alt="Question" className="mt-4 rounded-lg border border-slate-200 max-h-64 object-contain" />
                              )}
                            </div>
                          </div>

                          {/* Options */}
                          <div className="pl-12 space-y-3 mb-6">
                            {q.options.map((opt) => {
                              const isSelected = userAnswer?.selectedOptionId === opt.id;
                              const isCorrectOption = opt.id === q.correctOptionId;

                              let styleClass = "border-slate-200 bg-white";
                              let iconClass = "border-slate-300";

                              if (isCorrectOption) {
                                styleClass = "border-green-500 bg-green-50";
                                iconClass = "border-green-500 bg-green-500";
                              } else if (isSelected && !isCorrect) {
                                styleClass = "border-red-500 bg-red-50";
                                iconClass = "border-red-500 bg-red-500";
                              }

                              return (
                                <div
                                  key={opt.id}
                                  className={cn(
                                    "relative flex items-center p-3 rounded-lg border transition-all",
                                    styleClass
                                  )}
                                >
                                  <div className={cn(
                                    "h-5 w-5 rounded-full border flex items-center justify-center mr-3 shrink-0",
                                    iconClass
                                  )}>
                                    {isCorrectOption && <CheckCircle size={12} className="text-white" />}
                                    {isSelected && !isCorrect && <XCircle size={12} className="text-white" />}
                                  </div>
                                  <span className="text-base font-jp text-slate-700">{opt.text}</span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Explanation Toggle */}
                          <div className="pl-12">
                            <button
                              onClick={() => toggleExplanation(q.id)}
                              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                            >
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              {isExpanded ? "Hide Explanation" : "Show Explanation"}
                            </button>

                            {isExpanded && (
                              <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Explanation</h4>
                                <p className="font-jp leading-relaxed">{q.explanation || "No explanation provided."}</p>
                              </div>
                            )}
                          </div>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {view === 'overview' ? <ResultOverview /> : <ReviewSection />}
    </div>
  );
};

export default Result;