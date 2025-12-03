import React, { useState } from 'react';
import { ExamResult, Exam } from '../types';
import { Button, Card, Badge, cn } from '../components/UI';
import { CheckCircle, XCircle, RefreshCw, Home, ChevronRight, BarChart } from '../components/Icons';

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
        <Button variant="secondary" onClick={onRetake} size="lg"><RefreshCw size={18} className="mr-2"/> Retake Exam</Button>
        <Button variant="ghost" onClick={onHome} size="lg"><Home size={18} className="mr-2"/> Home</Button>
      </div>
    </div>
  );

  const ReviewSection = () => (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-slate-50 pt-4 pb-4 z-20 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900">Answer Review</h2>
        <Button variant="secondary" size="sm" onClick={() => setView('overview')}>Back to Summary</Button>
      </div>

      <div className="space-y-8">
        {exam.sections.map((section) => (
          <div key={section.id}>
            <h3 className="text-lg font-bold text-slate-800 mb-4 bg-white inline-block px-3 py-1 rounded-lg border border-slate-200 shadow-sm">
              {section.title}
            </h3>
            <div className="space-y-4">
              {section.questions.map((q, idx) => {
                const userAnswer = result.answers[q.id];
                const isCorrect = userAnswer?.isCorrect;
                const userSelectedOpt = q.options.find(o => o.id === userAnswer?.selectedOptionId);

                return (
                  <Card key={q.id} className={cn("p-6 border-l-4", isCorrect ? "border-l-green-500" : "border-l-red-500")}>
                    <div className="flex items-start gap-3 mb-4">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center mt-0.5">
                        {q.number}
                      </span>
                      <div className="flex-1">
                        <p className="font-jp font-medium text-lg text-slate-900">{q.question}</p>
                        {q.context && <p className="mt-2 text-slate-600 font-jp" dangerouslySetInnerHTML={{__html: q.context}} />}
                      </div>
                      <Badge color={isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                        {isCorrect ? "Correct" : "Incorrect"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                       <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Your Answer</span>
                          <span className={cn("font-jp", isCorrect ? "text-green-700 font-medium" : "text-red-700 font-medium")}>
                            {userSelectedOpt?.text || "Not answered"}
                          </span>
                       </div>
                       {!isCorrect && (
                         <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                            <span className="text-xs text-green-600/70 font-bold uppercase block mb-1">Correct Answer</span>
                            <span className="font-jp text-green-800 font-medium">
                              {q.options.find(o => o.id === q.correctOptionId)?.text}
                            </span>
                         </div>
                       )}
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600">
                      <p className="font-bold text-slate-700 mb-1 text-xs uppercase">Explanation</p>
                      {q.explanation}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {view === 'overview' ? <ResultOverview /> : <ReviewSection />}
    </div>
  );
};

export default Result;