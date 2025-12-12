import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface SnakeGameProps {
  onScore?: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScore }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAME_OVER'>('START');
  const [score, setScore] = useState(0);

  // Game Logic Refs (to avoid re-renders loop)
  const snake = useRef([{ x: 10, y: 10 }]);
  const food = useRef({ x: 15, y: 15 });
  const direction = useRef({ x: 0, y: 0 });
  const speed = useRef(100);
  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null);

  const gridSize = 20;
  const tileCount = 20; // 400x400 canvas

  const startGame = () => {
    snake.current = [{ x: 10, y: 10 }];
    food.current = { x: 5, y: 5 };
    direction.current = { x: 1, y: 0 };
    setScore(0);
    setGameState('PLAYING');
    if (intervalId.current) clearInterval(intervalId.current);
    intervalId.current = setInterval(gameLoop, speed.current);
  };

  const gameLoop = () => {
    const head = { 
        x: snake.current[0].x + direction.current.x, 
        y: snake.current[0].y + direction.current.y 
    };

    // Wall Collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Self Collision
    for (let i = 0; i < snake.current.length; i++) {
        if (head.x === snake.current[i].x && head.y === snake.current[i].y) {
            gameOver();
            return;
        }
    }

    snake.current.unshift(head);

    // Eat Food
    if (head.x === food.current.x && head.y === food.current.y) {
        setScore(s => {
            const newScore = s + 10;
            if (onScore && newScore === 50) onScore(50); // Achievement trigger example
            return newScore;
        });
        food.current = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        // Don't pop tail
    } else {
        snake.current.pop();
    }

    draw();
  };

  const gameOver = () => {
    if (intervalId.current) clearInterval(intervalId.current);
    setGameState('GAME_OVER');
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Food
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(food.current.x * gridSize + gridSize/2, food.current.y * gridSize + gridSize/2, gridSize/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Snake
    ctx.fillStyle = '#22c55e';
    snake.current.forEach((part, index) => {
        if (index === 0) ctx.fillStyle = '#4ade80'; // Head is lighter
        else ctx.fillStyle = '#22c55e';
        
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
        switch(e.key) {
            case 'ArrowUp': if (direction.current.y === 0) direction.current = {x: 0, y: -1}; break;
            case 'ArrowDown': if (direction.current.y === 0) direction.current = {x: 0, y: 1}; break;
            case 'ArrowLeft': if (direction.current.x === 0) direction.current = {x: -1, y: 0}; break;
            case 'ArrowRight': if (direction.current.x === 0) direction.current = {x: 1, y: 0}; break;
        }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-zinc-900 text-white font-mono">
        <div className="mb-4 text-center">
            <h2 className="text-3xl font-bold text-green-500 mb-2">NEON SNAKE</h2>
            <p className="text-xl">Puntuación: {score}</p>
        </div>

        <div className="relative">
            <canvas 
                ref={canvasRef} 
                width={400} 
                height={400} 
                className="bg-black border-4 border-zinc-700 rounded-lg shadow-2xl shadow-green-900/20"
            />
            
            {gameState !== 'PLAYING' && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg">
                    <h3 className="text-4xl font-bold mb-6">{gameState === 'START' ? '¿LISTO?' : 'GAME OVER'}</h3>
                    <button 
                        onClick={startGame}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black font-bold py-3 px-8 rounded-full text-xl transition-transform hover:scale-105"
                    >
                        {gameState === 'START' ? <Play /> : <RotateCcw />}
                        {gameState === 'START' ? 'JUGAR' : 'REINTENTAR'}
                    </button>
                </div>
            )}
        </div>
        <p className="mt-4 text-zinc-500 text-sm">Usa las flechas del teclado para moverte</p>
    </div>
  );
};