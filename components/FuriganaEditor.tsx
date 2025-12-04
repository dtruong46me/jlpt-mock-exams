import React, { useState } from 'react';
import { Button } from './UI';
import { Eye, Edit } from './Icons';

interface FuriganaEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

/**
 * FuriganaEditor component allows users to add furigana (ruby text) to Japanese text.
 * Format: Use {kanji|furigana} syntax in edit mode, which renders as ruby text in preview.
 * Example: {漢字|かんじ} becomes <ruby>漢字<rt>かんじ</rt></ruby>
 */
const FuriganaEditor: React.FC<FuriganaEditorProps> = ({ 
  value, 
  onChange, 
  label = 'Text with Furigana',
  placeholder = 'Type text and use {漢字|かんじ} for furigana'
}) => {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  // Convert {kanji|furigana} to ruby HTML
  const parseToRuby = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    
    // Regex to match {kanji|furigana} pattern
    const regex = /\{([^|]+)\|([^}]+)\}/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {text.substring(lastIndex, match.index)}
          </span>
        );
      }

      // Add ruby text
      parts.push(
        <ruby key={`ruby-${match.index}`} className="text-lg">
          {match[1]}
          <rt className="text-xs">{match[2]}</rt>
        </ruby>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {text.substring(lastIndex)}
        </span>
      );
    }

    return parts.length > 0 ? parts : [<span key="empty">{text}</span>];
  };

  const addFuriganaTemplate = () => {
    const template = '{漢字|かんじ}';
    const cursorPos = value.length;
    onChange(value + template);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addFuriganaTemplate}
          >
            + Add Furigana
          </Button>
          <div className="flex border border-slate-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setMode('edit')}
              className={`px-3 py-1 text-sm font-medium transition-colors ${
                mode === 'edit'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Edit size={14} className="inline mr-1" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => setMode('preview')}
              className={`px-3 py-1 text-sm font-medium transition-colors ${
                mode === 'preview'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Eye size={14} className="inline mr-1" />
              Preview
            </button>
          </div>
        </div>
      </div>

      {mode === 'edit' ? (
        <div>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-jp"
            rows={4}
          />
          <p className="text-xs text-slate-500 mt-1">
            💡 Use syntax: <code className="bg-slate-100 px-1 py-0.5 rounded">{'例{漢字|かんじ}'}</code> to add furigana
          </p>
        </div>
      ) : (
        <div className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 min-h-[100px] font-jp text-lg leading-relaxed">
          {value ? parseToRuby(value) : (
            <span className="text-slate-400">Preview will appear here...</span>
          )}
        </div>
      )}
    </div>
  );
};

export default FuriganaEditor;
