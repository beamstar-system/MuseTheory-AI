import React, { useState } from 'react';
import { Music, MessageSquare, Image as ImageIcon, Search, LayoutGrid, Loader2 } from 'lucide-react';
import { generateTheoryData } from './services/geminiService';
import { VisualizationData, AppMode } from './types';
import { Piano } from './components/Piano';
import { Guitar } from './components/Guitar';
import { ChatBot } from './components/ChatBot';
import { ImageGenerator } from './components/ImageGenerator';

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.THEORY);
  const [theoryPrompt, setTheoryPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [theoryData, setTheoryData] = useState<VisualizationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTheorySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theoryPrompt.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await generateTheoryData(theoryPrompt);
      setTheoryData(data);
    } catch (err) {
      setError("Failed to load theory data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row font-sans selection:bg-indigo-500/30">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 z-20">
        <div className="p-6 flex items-center justify-center md:justify-start gap-3 border-b border-slate-800">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Music className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden lg:block text-slate-100">MuseAI</span>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          <button
            onClick={() => setMode(AppMode.THEORY)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              mode === AppMode.THEORY 
                ? 'bg-slate-800 text-indigo-400 font-medium shadow-inner' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="hidden lg:block">Visualizer</span>
          </button>
          
          <button
            onClick={() => setMode(AppMode.CHAT)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              mode === AppMode.CHAT
                ? 'bg-slate-800 text-teal-400 font-medium shadow-inner' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="hidden lg:block">AI Tutor</span>
          </button>

          <button
            onClick={() => setMode(AppMode.IMAGE)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              mode === AppMode.IMAGE
                ? 'bg-slate-800 text-pink-400 font-medium shadow-inner' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            <span className="hidden lg:block">Art Generator</span>
          </button>
        </nav>
        
        <div className="p-6 border-t border-slate-800 hidden lg:block">
            <div className="bg-slate-800/50 rounded-lg p-4 text-xs text-slate-500">
                <p>Gemini Powered</p>
                <p className="mt-1">v1.0.0</p>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden h-screen flex flex-col relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none z-0"></div>

        {/* Header / Search Bar (only for Theory Mode) */}
        {mode === AppMode.THEORY && (
          <header className="p-6 md:p-8 z-10 w-full max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">What do you want to play?</h1>
            <p className="text-slate-400 mb-6">Ask for any scale, chord, or interval.</p>
            
            <form onSubmit={handleTheorySearch} className="relative group">
              <input
                type="text"
                value={theoryPrompt}
                onChange={(e) => setTheoryPrompt(e.target.value)}
                placeholder="e.g. 'G Mixolydian', 'Cm7 on Guitar', 'Eb Major Scale'"
                className="w-full bg-slate-900/80 backdrop-blur-sm border border-slate-700 text-slate-100 text-lg rounded-2xl py-4 pl-14 pr-32 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-xl"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-6 h-6 group-focus-within:text-indigo-400 transition-colors" />
              <button 
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Visualize'}
              </button>
            </form>
          </header>
        )}

        {/* Content Views */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 z-10 scrollbar-hide">
          <div className="max-w-6xl mx-auto h-full">
            
            {/* THEORY VISUALIZER */}
            {mode === AppMode.THEORY && (
              <div className="space-y-8 animate-in fade-in duration-500">
                {error && (
                  <div className="p-4 bg-red-900/20 border border-red-800 text-red-200 rounded-xl">
                    {error}
                  </div>
                )}

                {theoryData ? (
                  <div className="space-y-8">
                    <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between border-b border-slate-800 pb-6">
                      <div>
                         <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                             {theoryData.type}
                         </span>
                         <h2 className="text-4xl font-bold text-white mb-2">{theoryData.title}</h2>
                         <p className="text-slate-400 text-lg">{theoryData.description}</p>
                      </div>
                      <div className="flex gap-2">
                          {theoryData.notes.map((n, i) => (
                              <div key={i} className="flex flex-col items-center">
                                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-200 border border-slate-700 mb-1">
                                      {n}
                                  </div>
                                  <span className="text-[10px] text-slate-500 uppercase">{theoryData.intervals[i]}</span>
                              </div>
                          ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-slate-300 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Piano View
                            </h3>
                            <Piano highlightedNotes={theoryData.notes} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-slate-300 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-teal-500"></span> Guitar View
                            </h3>
                            <Guitar highlightedNotes={theoryData.notes} />
                        </div>
                    </div>
                  </div>
                ) : !isLoading && (
                   <div className="h-[50vh] flex flex-col items-center justify-center text-slate-600">
                       <Music className="w-16 h-16 mb-4 opacity-20" />
                       <p className="text-lg">Enter a scale or chord above to get started.</p>
                   </div>
                )}
                
                {isLoading && (
                   <div className="h-[50vh] flex flex-col items-center justify-center text-indigo-400 animate-pulse">
                       <Loader2 className="w-12 h-12 mb-4 animate-spin" />
                       <p>Analyzing music theory...</p>
                   </div>
                )}
              </div>
            )}

            {/* CHAT INTERFACE */}
            {mode === AppMode.CHAT && (
              <div className="h-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <ChatBot />
              </div>
            )}

            {/* IMAGE GENERATOR */}
            {mode === AppMode.IMAGE && (
              <div className="h-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ImageGenerator />
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
