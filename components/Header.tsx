import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-5 px-6 border-b border-gray-800/50 backdrop-blur-md bg-gray-950/80 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Models<span className="text-indigo-400">Gen</span>
          </h1>
        </div>
        
        <div className="hidden sm:block text-xs font-medium text-gray-500 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
          v1.0 • Gemini Powered
        </div>
      </div>
    </header>
  );
};