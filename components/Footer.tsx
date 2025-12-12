import React from 'react';
import { Gamepad2, Reply, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  inGame: boolean;
  onBack?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ inGame, onBack }) => {
  return (
    <div className="w-full py-4 border-t border-gray-800 bg-[#2d2d2d] text-gray-400 flex items-center justify-between px-8 select-none">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
           <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
             <Gamepad2 size={16} />
           </div>
           <span className="text-sm">Menú</span>
        </div>
      </div>

      <div className="flex items-center space-x-8">
        {inGame ? (
             <button onClick={onBack} className="flex items-center space-x-2 hover:text-white transition-colors group cursor-pointer">
                <div className="w-6 h-6 rounded-full bg-red-500 text-black font-bold flex items-center justify-center text-xs group-hover:scale-110 transition-transform">B</div>
                <span className="text-sm font-semibold">Volver</span>
             </button>
        ) : (
            <>
                <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-transparent border border-gray-500 text-gray-500 font-bold flex items-center justify-center text-xs">B</div>
                    <span className="text-sm font-semibold">Volver</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-sky-400 text-black font-bold flex items-center justify-center text-xs">A</div>
                    <span className="text-sm font-semibold">Seleccionar</span>
                </div>
            </>
        )}
      </div>
    </div>
  );
};