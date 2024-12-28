import React from 'react';
import { type Character, type Dialogue, type CodeExample, type Exercise } from '@/constants/constant';
import { DialogueBox } from './DialogueBox';
import { CodeEditor } from './CodeEditor';
import type { ActiveDialogue } from '@/types';

interface LearningInterfaceProps {
  activeDialogue: ActiveDialogue | null;
  currentExample: CodeExample | null;
  currentExercise: Exercise | null;
  characterEmojis: Record<string, string>;
  codeEditor: {
    code: string;
    output: string;
    isRunning: boolean;
  };
  onCloseDialog: () => void;
  onNextDialogue: () => void;
  onCodeChange: (code: string) => void;
  onRunCode: () => void;
}

export const LearningInterface: React.FC<LearningInterfaceProps> = ({
  activeDialogue,
  currentExample,
  currentExercise,
  characterEmojis,
  codeEditor,
  onCloseDialog,
  onNextDialogue,
  onCodeChange,
  onRunCode,
}) => {
  if (!activeDialogue && !currentExample && !currentExercise) return null;

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-xl shadow-xl max-w-2xl w-full mx-4 border border-slate-100">
      {/* Close Button */}
      <button 
        onClick={onCloseDialog}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full 
                  hover:bg-slate-100 transition-colors duration-200"
        aria-label="Close dialog"
      >
        <span className="text-slate-500 text-xl">×</span>
      </button>

      {/* Character Dialogue */}
      {activeDialogue && (
        <DialogueBox
          character={activeDialogue.character}
          dialogue={activeDialogue.dialogue}
          characterEmojis={characterEmojis}
        />
      )}

      {/* Code Example */}
      {currentExample && (
        <div className="bg-slate-800 text-white p-4 rounded-lg mb-4">
          <h4 className="text-lg font-semibold mb-2">{currentExample.title}</h4>
          <pre className="font-mono text-sm overflow-x-auto">
            <code>{currentExample.code}</code>
          </pre>
          <p className="mt-2 text-slate-300">{currentExample.explanation}</p>
        </div>
      )}

      {/* Exercise */}
      {currentExercise && (
        <CodeEditor
          exercise={currentExercise}
          code={codeEditor.code}
          output={codeEditor.output}
          isRunning={codeEditor.isRunning}
          onCodeChange={onCodeChange}
          onRunCode={onRunCode}
        />
      )}

      <div className="mt-4 flex justify-end pt-2">
        <button
          onClick={onNextDialogue}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
                   transition-colors duration-200 font-medium text-sm"
        >
          {activeDialogue?.dialogue.next ? 'Continue →' : 'Close'}
        </button>
      </div>
    </div>
  );
}; 