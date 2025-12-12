import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

export const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const calculateWinner = (squares: any[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(Boolean);

  const handleClick = (i: number) => {
    if (winner || board[i]) return;
    const newBoard = [...board];
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="flex flex-col h-full bg-cyan-900/20 items-center justify-center text-white">
      <h1 className="text-4xl font-black mb-8 text-cyan-400 drop-shadow-md tracking-wider uppercase">
        Tres en Raya
      </h1>
      
      <div className="grid grid-cols-3 gap-3 bg-cyan-950 p-4 rounded-xl shadow-2xl border-4 border-cyan-800">
        {board.map((square, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={`w-24 h-24 sm:w-32 sm:h-32 bg-cyan-900 rounded-lg text-6xl font-bold flex items-center justify-center transition-all hover:bg-cyan-800 ${
              square === 'X' ? 'text-pink-500' : 'text-yellow-400'
            }`}
          >
            {square}
          </button>
        ))}
      </div>

      <div className="mt-8 h-12 flex items-center">
        {winner ? (
          <div className="animate-bounce bg-green-500 text-black px-6 py-2 rounded-full font-bold text-xl shadow-lg shadow-green-500/50">
            ¡Ganador: {winner}!
          </div>
        ) : isDraw ? (
          <div className="bg-gray-500 text-white px-6 py-2 rounded-full font-bold text-xl">
            ¡Empate!
          </div>
        ) : (
          <div className="text-xl font-medium text-cyan-200">
            Turno de: <span className={xIsNext ? 'text-pink-500 font-bold' : 'text-yellow-400 font-bold'}>{xIsNext ? 'X' : 'O'}</span>
          </div>
        )}
      </div>

      <button 
        onClick={resetGame}
        className="mt-6 flex items-center gap-2 text-cyan-300 hover:text-white transition-colors uppercase text-sm font-bold tracking-widest"
      >
        <RotateCcw size={16} /> Reiniciar Partida
      </button>
    </div>
  );
};