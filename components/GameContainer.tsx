import React from 'react';
import { Game } from '../types';

interface GameContainerProps {
  game: Game | null;
}

export const GameContainer: React.FC<GameContainerProps> = ({ game }) => {
  if (!game) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black animate-in slide-in-from-bottom duration-500 flex flex-col">
       {/* Game Content */}
       <div className="flex-1 relative overflow-hidden">
         {game.component}
       </div>
    </div>
  );
};