import React from 'react';
import { JLPTLevel, Exam } from '../types';
import { MOCK_EXAMS } from '../constants';
import { Card, Badge, Button } from '../components/UI';
import { Clock, FileText, ChevronLeft, Play } from '../components/Icons';

interface ExamListProps {
  level: JLPTLevel;
  onBack: () => void;
  onStartExam: (exam: Exam) => void;
}

const ExamList: React.FC<ExamListProps> = ({ level, onBack, onStartExam }) => {
  // Filter exams for this level (mock filter since we only have limited mock data)
  // In a real app, this would match `exam.level === level`
  const exams = MOCK_EXAMS.filter(e => e.level === level || (level === 'N5' && e.level === 'N5'));
  
  // If no exams match strict filter, just show N3 for demo purposes if N3 selected
  const displayExams = exams.length > 0 ? exams : MOCK_EXAMS.filter(e => e.level === 'N3'); 

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb / Header */}
        <div className="mb-8">
          <button 
            onClick={onBack}
            className="flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" /> Back to Levels
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-lg font-mono">{level}</span>
                Mock Exams
              </h1>
              <p className="text-slate-500 mt-2">Choose a practice test to begin.</p>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayExams.map((exam) => (
            <Card key={exam.id} className="flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <Badge color="bg-primary-50 text-primary-700 ring-1 ring-primary-100">New</Badge>
                  <span className="text-xs font-mono text-slate-400">ID: {exam.id}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{exam.title}</h3>
                
                <div className="space-y-3 mt-6">
                  <div className="flex items-center text-sm text-slate-600">
                    <Clock size={16} className="mr-3 text-slate-400" />
                    <span>{exam.totalDuration} minutes</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <FileText size={16} className="mr-3 text-slate-400" />
                    <span>{exam.totalQuestions} Questions</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <div className="w-4 h-4 rounded border border-slate-300 mr-3 flex items-center justify-center">
                       <div className="w-2 h-2 bg-slate-300 rounded-sm"></div>
                    </div>
                    <span>3 Sections (Vocab, Reading, Listening)</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <Button className="w-full justify-between group" onClick={() => onStartExam(exam)}>
                  Start Exam
                  <Play size={16} className="opacity-70 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}

          {/* Empty State / Coming Soon */}
          {displayExams.length < 4 && (
             <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center opacity-70">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                  <Clock size={20} className="text-slate-400" />
                </div>
                <h3 className="font-medium text-slate-900">More coming soon</h3>
                <p className="text-sm text-slate-500 mt-1">We add new mock exams weekly.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamList;