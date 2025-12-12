import React, { useState } from 'react';
import { Palette, Image as ImageIcon, Download, RefreshCw } from 'lucide-react';
import { generateImageResponse } from '../../services/geminiService';

export const PixelPainter: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    const result = await generateImageResponse(prompt);
    setImageUrl(result);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-white">
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
        
        {/* Canvas Area */}
        <div className="relative w-full max-w-lg aspect-square bg-black rounded-xl border-4 border-dashed border-zinc-700 flex items-center justify-center overflow-hidden shadow-2xl">
          {loading ? (
             <div className="flex flex-col items-center space-y-4">
                <RefreshCw size={48} className="animate-spin text-pink-500" />
                <span className="text-zinc-400 font-medium">Creando obra maestra...</span>
             </div>
          ) : imageUrl ? (
            <img src={imageUrl} alt="Generated" className="w-full h-full object-contain animate-in fade-in duration-700" />
          ) : (
            <div className="text-center text-zinc-500 p-6">
                <Palette size={64} className="mx-auto mb-4 opacity-50" />
                <p>Describe una imagen para pintarla con IA</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="w-full max-w-lg space-y-4">
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ej: Un gato cyberpunk comiendo pizza en neón"
                    className="flex-1 bg-zinc-800 border-none rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-pink-500 outline-none"
                    disabled={loading}
                />
                <button 
                    onClick={handleGenerate}
                    disabled={loading || !prompt}
                    className="bg-pink-600 hover:bg-pink-500 disabled:bg-zinc-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                    <ImageIcon size={20} />
                    Pintar
                </button>
            </div>
            
            {imageUrl && (
                <a 
                  href={imageUrl} 
                  download="arte-ia.png"
                  className="block w-full text-center bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2 rounded-lg text-sm transition-colors"
                >
                  <Download size={16} className="inline mr-2" /> Descargar Imagen
                </a>
            )}
        </div>
      </div>
    </div>
  );
};