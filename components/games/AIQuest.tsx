import React, { useState, useRef, useEffect } from 'react';
import { Send, Scroll, Map, Sword } from 'lucide-react';
import { generateTextResponse } from '../../services/geminiService';
import { ChatMessage } from '../../types';

export const AIQuest: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Bienvenido aventurero. Estás parado frente a las puertas de un castillo antiguo y olvidado. La niebla es densa. ¿Qué deseas hacer?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Context building for RPG
    const contextPrompt = `
      Actúa como un narrador de juegos de rol de fantasía (Dungeon Master). 
      El idioma es español. Sé descriptivo pero conciso (máximo 100 palabras por turno).
      La historia hasta ahora:
      ${messages.slice(-5).map(m => `${m.role === 'user' ? 'Jugador' : 'Narrador'}: ${m.text}`).join('\n')}
      
      Jugador: ${input}
      Narrador:
    `;

    const responseText = await generateTextResponse(contextPrompt);
    
    const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100 font-serif">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center justify-between shadow-md">
        <h2 className="text-xl text-amber-500 font-bold flex items-center gap-2">
            <Scroll size={24} /> Crónicas de Eldoria
        </h2>
        <div className="flex gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1"><Map size={16}/> Castillo Olvidado</span>
            <span className="flex items-center gap-1"><Sword size={16}/> Nivel 1</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-xl shadow-lg border ${
              msg.role === 'user' 
                ? 'bg-blue-900/50 border-blue-700/50 text-blue-100 rounded-br-none' 
                : 'bg-gray-800/80 border-amber-900/30 text-amber-50 rounded-bl-none'
            }`}>
              <p className="leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800/80 p-4 rounded-xl rounded-bl-none border border-amber-900/30">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="¿Qué quieres hacer?"
            className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            disabled={loading}
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};