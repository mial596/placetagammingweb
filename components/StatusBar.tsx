import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Coins } from 'lucide-react';

interface StatusBarProps {
  balance: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({ balance }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="flex justify-between items-center px-8 py-4 w-full text-white text-sm select-none border-b border-white/5 bg-gradient-to-b from-black/50 to-transparent z-50">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-600 bg-gray-800">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
        </div>
        
        {/* Currency Display */}
        <div className="flex items-center bg-gray-800/80 px-3 py-1.5 rounded-full border border-yellow-500/30 text-yellow-400 space-x-2">
            <Coins size={14} className="fill-yellow-400" />
            <span className="font-bold font-mono">{balance.toLocaleString()} P</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-6 text-gray-200">
        <span className="font-bold tracking-wider text-lg">{formatTime(time)}</span>
        <Wifi size={20} />
        <div className="flex items-center space-x-1">
          <span className="text-xs font-bold">85%</span>
          <Battery size={24} className="text-green-400 rotate-90" />
        </div>
      </div>
    </div>
  );
};