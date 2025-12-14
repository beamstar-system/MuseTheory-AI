import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, Loader2, Download, AlertCircle } from 'lucide-react';
import { generateMusicImage } from '../services/geminiService';
import { ImageConfig } from '../types';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageConfig['size']>('1K');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    setImageSrc(null);

    try {
      const dataUri = await generateMusicImage(prompt, size);
      setImageSrc(dataUri);
    } catch (err) {
      setError("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-slate-900 to-slate-800">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400 flex items-center gap-2 mb-2">
          <ImageIcon className="w-6 h-6 text-pink-400" />
          AI Album Art Generator
        </h2>
        <p className="text-sm text-slate-400">Create visuals for your music using Gemini 3 Pro Image Preview.</p>
      </div>

      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Describe your image</label>
            <textarea
              className="w-full h-24 bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              placeholder="A surreal landscape made of musical instruments, neon synthwave style..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Quality</label>
            <div className="flex gap-3">
              {(['1K', '2K', '4K'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    size === s 
                      ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/50' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 rounded-lg text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Artwork
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg flex items-center gap-3 text-red-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {imageSrc && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative group rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-black">
              <img src={imageSrc} alt="Generated" className="w-full h-auto object-cover max-h-[400px]" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <a 
                  href={imageSrc} 
                  download={`muse-art-${Date.now()}.png`}
                  className="px-6 py-3 bg-white text-black rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <Download className="w-5 h-5" />
                  Download
                </a>
              </div>
            </div>
            <p className="text-center text-xs text-slate-500 mt-2">Generated with Gemini 3 Pro Image Preview</p>
          </div>
        )}
      </div>
    </div>
  );
};
