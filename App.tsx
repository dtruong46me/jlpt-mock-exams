import React, { useState } from 'react';
import Home from './views/Home';
import ExamList from './views/ExamList';
import ExamTake from './views/ExamTake';
import Result from './views/Result';
import { JLPTLevel, Exam, ExamResult } from './types';

// Simple Router State to simulate Next.js pages in a single component tree
type ViewState = 
  | { type: 'home' }
  | { type: 'list', level: JLPTLevel }
  | { type: 'take', exam: Exam }
  | { type: 'result', result: ExamResult, exam: Exam };

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>({ type: 'home' });

  const navigateToHome = () => setView({ type: 'home' });
  
  const handleLevelSelect = (level: JLPTLevel) => {
    setView({ type: 'list', level });
  };

  const handleStartExam = (exam: Exam) => {
    setView({ type: 'take', exam });
  };

  const handleFinishExam = (result: ExamResult, exam: Exam) => {
    setView({ type: 'result', result, exam });
  };

  return (
    <div className="font-sans text-slate-900">
      {/* 
        In a real Next.js app, these would be separate routes. 
        Here we conditionally render to simulate routing in an SPA. 
      */}
      
      {view.type === 'home' && (
        <Home onSelectLevel={handleLevelSelect} />
      )}

      {view.type === 'list' && (
        <ExamList 
          level={view.level} 
          onBack={navigateToHome}
          onStartExam={handleStartExam}
        />
      )}

      {view.type === 'take' && (
        <ExamTake 
          exam={view.exam}
          onExit={() => setView({ type: 'list', level: view.exam.level })}
          onFinish={(result) => handleFinishExam(result, view.exam)}
        />
      )}

      {view.type === 'result' && (
        <Result 
          result={view.result}
          exam={view.exam}
          onRetake={() => setView({ type: 'take', exam: view.exam })}
          onHome={navigateToHome}
        />
      )}
    </div>
  );
};

export default App;