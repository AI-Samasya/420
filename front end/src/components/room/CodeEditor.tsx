import React from 'react';
import { type Exercise } from '@/constants/constant';

interface CodeEditorProps {
  exercise: Exercise;
  code: string;
  output: string;
  isRunning: boolean;
  onCodeChange: (code: string) => void;
  onRunCode: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  exercise,
  code,
  output,
  isRunning,
  onCodeChange,
  onRunCode,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-lg text-slate-800 mb-2">{exercise.question}</h4>
        <div className="flex gap-2">
          {exercise.hints.map((hint, i) => (
            <span key={i} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
              💡 {hint}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-4">
        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          className="w-full h-32 bg-slate-900 text-white font-mono p-2 rounded"
        />
        <div className="flex justify-between items-center mt-2">
          <button
            onClick={onRunCode}
            disabled={isRunning}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
          <div className="text-white">{output}</div>
        </div>
      </div>
    </div>
  );
}; 