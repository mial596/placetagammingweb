import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { Achievement } from '../types';

interface NotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ achievement, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 500); // Wait for animation
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div className={`fixed top-8 left-8 z-[100] transition-all duration-500 transform ${visible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
      <div className="bg-gray-800 border-l-4 border-yellow-500 text-white px-6 py-4 rounded shadow-2xl flex items-center gap-4 min-w-[300px]">
        <div className="bg-yellow-500/20 p-2 rounded-full text-yellow-400">
            <Trophy size={24} />
        </div>
        <div>
            <h4 className="font-bold text-yellow-400 text-sm uppercase tracking-wider">Logro Desbloqueado</h4>
            <p className="font-bold text-lg leading-tight">{achievement.title}</p>
            <p className="text-xs text-gray-400 mt-1">{achievement.description}</p>
        </div>
      </div>
    </div>
  );
};