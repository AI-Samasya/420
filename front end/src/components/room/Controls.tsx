import React from 'react';

export const Controls: React.FC = () => {
  return (
    <div className="fixed top-8 right-8 bg-white/90 p-5 rounded-xl shadow-lg border border-slate-100">
      <h3 className="font-semibold text-slate-800 mb-3">Controls</h3>
      <ul className="space-y-2 text-sm text-slate-600">
        <li className="flex items-center gap-2">
          <span className="font-medium">↑</span> Move Up
        </li>
        <li className="flex items-center gap-2">
          <span className="font-medium">↓</span> Move Down
        </li>
        <li className="flex items-center gap-2">
          <span className="font-medium">←</span> Move Left
        </li>
        <li className="flex items-center gap-2">
          <span className="font-medium">→</span> Move Right
        </li>
        <li className="flex items-center gap-2">
          <span className="font-medium">Enter</span> Interact
        </li>
      </ul>
    </div>
  );
}; 