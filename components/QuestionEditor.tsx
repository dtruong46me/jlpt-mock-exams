import React, { useState } from 'react';
import { Question, QuestionType, Option } from '../types';
import { Button, Badge } from './UI';
import { PlusCircle, Trash2, Image as ImageIcon, Upload, Music } from './Icons';
import FuriganaEditor from './FuriganaEditor';

interface QuestionEditorProps {
  question: Question;
  onChange: (question: Question) => void;
  onDelete?: () => void;
  questionNumber: number;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ 
  question, 
  onChange, 
  onDelete,
  questionNumber 
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    question.imageUrl || null
  );

  const handleTypeChange = (type: QuestionType) => {
    onChange({ ...question, type });
  };

  const handleAddOption = () => {
    const newOption: Option = {
      id: `opt-${Date.now()}`,
      text: ''
    };
    onChange({ 
      ...question, 
      options: [...question.options, newOption] 
    });
  };

  const handleOptionChange = (optionId: string, text: string) => {
    onChange({
      ...question,
      options: question.options.map(opt => 
        opt.id === optionId ? { ...opt, text } : opt
      )
    });
  };

  const handleDeleteOption = (optionId: string) => {
    if (question.options.length <= 2) {
      alert('A question must have at least 2 options');
      return;
    }
    onChange({
      ...question,
      options: question.options.filter(opt => opt.id !== optionId)
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      onChange({ 
        ...question, 
        imageFile: file,
        imageUrl: URL.createObjectURL(file)
      });
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange({ 
        ...question, 
        audioFile: file,
        audioUrl: URL.createObjectURL(file)
      });
    }
  };

  const questionTypes: { value: QuestionType; label: string }[] = [
    { value: 'vocabulary', label: 'Vocabulary' },
    { value: 'grammar', label: 'Grammar' },
    { value: 'reading', label: 'Reading' },
    { value: 'listening', label: 'Listening' }
  ];

  return (
    <div className="bg-white border-2 border-slate-200 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Badge className="bg-primary-100 text-primary-700 text-lg px-3 py-1">
            Q{questionNumber}
          </Badge>
          <select
            value={question.type}
            onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {questionTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        {onDelete && (
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 size={16} className="text-red-600" />
          </Button>
        )}
      </div>

      {/* Question Text */}
      <div>
        <FuriganaEditor
          label="Question"
          value={question.question}
          onChange={(val) => onChange({ ...question, question: val })}
          placeholder="Enter the question (e.g., What does this word mean?)"
        />
      </div>

      {/* Context (for vocabulary/grammar) */}
      {(question.type === 'vocabulary' || question.type === 'grammar') && (
        <div>
          <FuriganaEditor
            label="Context / Example Sentence (Optional)"
            value={question.context || ''}
            onChange={(val) => onChange({ ...question, context: val })}
            placeholder="Enter example sentence with the word/grammar point"
          />
        </div>
      )}

      {/* Reading Text */}
      {question.type === 'reading' && (
        <div>
          <FuriganaEditor
            label="Reading Passage"
            value={question.readingText || ''}
            onChange={(val) => onChange({ ...question, readingText: val })}
            placeholder="Enter the reading passage with furigana where needed"
          />
        </div>
      )}

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Image (Optional)
        </label>
        <div className="flex gap-4">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg hover:border-primary-400 transition-colors">
              <ImageIcon size={20} className="text-slate-400" />
              <span className="text-sm text-slate-600">Upload Image</span>
            </div>
          </label>
          {imagePreview && (
            <div className="relative group">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="h-20 w-auto rounded-lg border border-slate-200"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  onChange({ ...question, imageUrl: undefined, imageFile: undefined });
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Audio Upload (for listening questions) */}
      {question.type === 'listening' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Audio File *
          </label>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="audio/*"
              onChange={handleAudioUpload}
              className="hidden"
            />
            <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg hover:border-primary-400 transition-colors">
              <Music size={20} className="text-slate-400" />
              <span className="text-sm text-slate-600">
                {question.audioUrl ? 'Change Audio' : 'Upload Audio'}
              </span>
            </div>
          </label>
          {question.audioUrl && (
            <div className="mt-2 flex items-center gap-2">
              <audio controls className="h-10 flex-1">
                <source src={question.audioUrl} />
              </audio>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange({ ...question, audioUrl: undefined, audioFile: undefined })}
              >
                <Trash2 size={16} className="text-red-600" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Options */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-slate-700">
            Answer Options *
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAddOption}
          >
            <PlusCircle size={16} className="mr-1" />
            Add Option
          </Button>
        </div>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <div key={option.id} className="flex items-start gap-3">
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="radio"
                  name={`correct-${question.id}`}
                  checked={question.correctOptionId === option.id}
                  onChange={() => onChange({ ...question, correctOptionId: option.id })}
                  className="mt-3 h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="text-xs text-slate-500 mb-1">Option {String.fromCharCode(65 + index)}</div>
                  <FuriganaEditor
                    label=""
                    value={option.text}
                    onChange={(val) => handleOptionChange(option.id, val)}
                    placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
                  />
                </div>
              </div>
              {question.options.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteOption(option.id)}
                  className="mt-8"
                >
                  <Trash2 size={16} className="text-red-600" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">
          ℹ️ Select the radio button to mark the correct answer
        </p>
      </div>

      {/* Explanation */}
      <div>
        <FuriganaEditor
          label="Explanation (shown after answer)"
          value={question.explanation}
          onChange={(val) => onChange({ ...question, explanation: val })}
          placeholder="Explain why this is the correct answer"
        />
      </div>
    </div>
  );
};

export default QuestionEditor;
