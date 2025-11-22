
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { GeneratorForm } from './components/GeneratorForm';
import { ImageGrid } from './components/ImageGrid';
import { generateImages } from './services/geminiService';
import { GeneratedImage, SavedMood } from './types';
import { Toaster, toast } from 'react-hot-toast';

const App: React.FC = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastPrompt, setLastPrompt] = useState<string>('');
  const [lastStyle, setLastStyle] = useState<string>('');
  const [savedMoods, setSavedMoods] = useState<SavedMood[]>([]);

  const handleGenerate = useCallback(async (prompt: string, style: string, language: string, count: number, ratio: string) => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setImages([]); // Clear previous images
    setLastPrompt(prompt);
    setLastStyle(style);

    try {
      // Create placeholder items for the UI
      const placeholders: GeneratedImage[] = Array(count).fill(null).map((_, i) => ({
        id: `pending-${i}`,
        url: '',
        prompt: prompt,
        isLoading: true,
        ratio: ratio
      }));
      setImages(placeholders);

      // Generate images in parallel
      const results = await generateImages(prompt, style, language, count, ratio);
      
      setImages(results);
      toast.success('Images generated successfully!');
    } catch (error) {
      console.error("Generation error:", error);
      toast.error('Failed to generate images. Please try again.');
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSaveMood = () => {
    if (!images.length || loading) return;

    // Check if already saved
    const alreadySaved = savedMoods.some(m => m.prompt === lastPrompt && m.images[0].id === images[0].id);
    if (alreadySaved) {
      toast("This mood is already in your collection.", { icon: 'ℹ️' });
      return;
    }

    const newMood: SavedMood = {
      id: Date.now().toString(),
      prompt: lastPrompt,
      timestamp: Date.now(),
      images: [...images],
      style: lastStyle
    };

    setSavedMoods(prev => [newMood, ...prev]);
    toast.success('Mood saved to your collection!');
  };

  const handleBack = () => {
    setLastPrompt('');
    setImages([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100 font-sans selection:bg-indigo-500 selection:text-white">
      <Toaster position="bottom-center" toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
        },
      }}/>
      
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl flex flex-col gap-10">
        <div className="w-full max-w-3xl mx-auto">
          <div className="text-center mb-8 space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Visualize Your Mood
            </h2>
            <p className="text-gray-400">
              Select a style, choose your language, format, and describe an emotion.
            </p>
          </div>
          
          <GeneratorForm onGenerate={handleGenerate} isLoading={loading} />
        </div>

        <div className="w-full min-h-[400px]">
          {lastPrompt && (
            <div className="animate-fade-in">
               <div className="flex flex-col md:flex-row justify-between items-end mb-6 px-2 gap-4">
                  <div className="text-center md:text-left w-full md:w-auto">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Current Mood</span>
                      <span className="text-xs font-medium text-gray-600 px-2 py-0.5 rounded border border-gray-800">{lastStyle}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mt-1">"{lastPrompt}"</h3>
                  </div>
                  
                  {!loading && images.length > 0 && (
                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                      <button 
                        onClick={handleBack}
                        className="bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-700 font-semibold py-2 px-6 rounded-full flex items-center gap-2 transition-all shadow-md hover:text-white w-full md:w-auto justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Indietro
                      </button>

                      <button 
                        onClick={handleSaveMood}
                        className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 font-semibold py-2 px-6 rounded-full flex items-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/20 w-full md:w-auto justify-center group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Salvare Mood
                      </button>
                    </div>
                  )}
              </div>
              
              <ImageGrid images={images} />
            </div>
          )}
        </div>

        {/* Saved Moods Section */}
        {savedMoods.length > 0 && (
          <div className="mt-12 border-t border-gray-900 pt-12 animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-8 px-2 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Saved Collections
            </h2>
            <div className="space-y-16">
              {savedMoods.map((mood) => (
                <div key={mood.id} className="bg-gray-900/30 rounded-3xl p-6 border border-gray-800/50">
                  <div className="mb-4 flex items-center gap-3">
                     <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
                     <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-500">{new Date(mood.timestamp).toLocaleDateString()}</p>
                          <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{mood.style}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-200">"{mood.prompt}"</h3>
                     </div>
                  </div>
                  <ImageGrid images={mood.images} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-gray-600 text-sm border-t border-gray-900 bg-gray-950">
        <p>Powered by Google Gemini 2.5 Flash Image</p>
      </footer>
    </div>
  );
};

export default App;
