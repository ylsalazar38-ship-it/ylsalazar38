
import React, { useState } from 'react';
import { GeneratorFormProps, STYLES, LANGUAGES, ASPECT_RATIOS } from '../types';

export const GeneratorForm: React.FC<GeneratorFormProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [selectedLanguage, setSelectedLanguage] = useState('it');
  const [imageCount, setImageCount] = useState(4);
  const [selectedRatio, setSelectedRatio] = useState(ASPECT_RATIOS[4].id); // Default 16:9

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt, selectedStyle, selectedLanguage, imageCount, selectedRatio);
    }
  };

  const handleRandomStyle = () => {
    const randomIndex = Math.floor(Math.random() * STYLES.length);
    setSelectedStyle(STYLES[randomIndex]);
  };

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleSubmit} className="relative w-full group z-20">
        <div className={`absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-500 ${isLoading ? 'opacity-0' : ''}`}></div>
        <div className="relative flex flex-col md:flex-row items-center bg-gray-900 rounded-xl border border-gray-800 shadow-xl overflow-hidden p-1 gap-2">
          
          {/* Language Selector */}
          <div className="relative hidden md:block border-r border-gray-800 pr-2">
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-transparent text-gray-400 text-sm font-medium py-4 px-3 outline-none appearance-none cursor-pointer hover:text-white transition-colors"
              disabled={isLoading}
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code} className="bg-gray-900 text-white">{lang.label}</option>
              ))}
            </select>
             {/* Custom Arrow Icon */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Mobile Language Selector (Visible only on small screens) */}
           <div className="w-full md:hidden border-b border-gray-800 pb-2 mb-2 px-2 relative">
             <span className="text-xs text-gray-500 uppercase font-bold mb-1 block">Language</span>
             <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-gray-800 rounded p-2 text-white text-sm outline-none"
              disabled={isLoading}
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
           </div>

          <div className="pl-2 md:pl-4 text-gray-400 hidden md:block">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={selectedLanguage === 'it' ? "Scrivi un'emozione o un tema..." : "Describe an emotion or theme..."}
            className="w-full bg-transparent border-none outline-none text-white px-4 py-3 md:py-4 placeholder-gray-500 font-medium"
            disabled={isLoading}
          />
          
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className={`w-full md:w-auto md:mr-1 px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap
              ${!prompt.trim() || isLoading 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg hover:shadow-indigo-500/30 active:transform active:scale-95'
              }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating...</span>
              </>
            ) : (
              <span>Generate</span>
            )}
          </button>
        </div>
      </form>

      {/* Configuration Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Quantity Selector */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Quantità</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map(num => (
              <button
                key={num}
                onClick={() => setImageCount(num)}
                className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold transition-colors ${
                  imageCount === num 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 flex flex-col gap-2">
           <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Formato Immagine</span>
           <select
             value={selectedRatio}
             onChange={(e) => setSelectedRatio(e.target.value)}
             className="w-full bg-gray-800 text-white text-sm rounded p-2 border border-gray-700 outline-none focus:border-indigo-500"
           >
             {ASPECT_RATIOS.map(ratio => (
               <option key={ratio.id} value={ratio.id}>{ratio.label}</option>
             ))}
           </select>
        </div>
      </div>

      {/* Style Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Scegli lo Stile</label>
            <button
              type="button"
              onClick={handleRandomStyle}
              className="p-1.5 rounded-full bg-gray-800 hover:bg-indigo-600 text-indigo-400 hover:text-white transition-all duration-200 group/random"
              title="Stile Casuale (Random Style)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover/random:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <span className="text-xs text-indigo-400 font-medium px-2 py-1 bg-indigo-500/10 rounded border border-indigo-500/20">{selectedStyle}</span>
        </div>
        <div className="relative group">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-950 to-transparent z-10 pointer-events-none"></div>
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-950 to-transparent z-10 pointer-events-none"></div>
          
          <div className="flex overflow-x-auto gap-2 py-2 px-1 no-scrollbar snap-x">
            {STYLES.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setSelectedStyle(style)}
                className={`snap-start shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 whitespace-nowrap
                  ${selectedStyle === style 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/40 scale-105' 
                    : 'bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-gray-200 hover:border-gray-700'
                  }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
