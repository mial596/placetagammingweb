import React, { useState, useEffect } from 'react';
import { Game, Achievement } from './types';
import { StatusBar } from './components/StatusBar';
import { Footer } from './components/Footer';
import { GameContainer } from './components/GameContainer';
import { Notification } from './components/Notification';
import { AIQuest } from './components/games/AIQuest';
import { PixelPainter } from './components/games/PixelPainter';
import { TicTacToe } from './components/games/TicTacToe';
import { SnakeGame } from './components/games/SnakeGame';
import { MemoryGame } from './components/games/MemoryGame';
import { JokerPoker } from './components/games/JokerPoker';
import { BlockCraft } from './components/games/BlockCraft';
import { CroquetaClicker } from './components/games/CroquetaClicker';
import { Shop } from './components/Shop';
import { Sword, Palette, Grip, ShoppingBag, Gamepad2, Sparkles, Club, Box, Cookie } from 'lucide-react';

export default function App() {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  
  // State for Currency and Achievements
  const [placetas, setPlacetas] = useState(100);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [currentNotification, setCurrentNotification] = useState<Achievement | null>(null);
  const [shopOpen, setShopOpen] = useState(false);

  // Persistence (Simplified)
  useEffect(() => {
    // Listen for storage events (to sync money between games)
    const handleStorage = () => {
        const savedPlacetas = localStorage.getItem('placetas');
        if (savedPlacetas) setPlacetas(parseInt(savedPlacetas));
    };
    
    handleStorage();
    window.addEventListener('storage', handleStorage);
    // Poll local storage periodically for single-page updates from sub-components
    const interval = setInterval(handleStorage, 1000);

    const savedAchievements = localStorage.getItem('achievements');
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));

    return () => {
        window.removeEventListener('storage', handleStorage);
        clearInterval(interval);
    };
  }, []);

  const updatePlacetas = (amount: number) => {
    const newVal = placetas + amount;
    setPlacetas(newVal);
    localStorage.setItem('placetas', newVal.toString());
    
    // Achievement: Rich
    if (newVal >= 1000) unlockAchievement('rich_kid');
  };

  const unlockAchievement = (id: string) => {
    if (achievements.includes(id)) return;
    
    const achievementList: Record<string, Achievement> = {
      'first_game': { id: 'first_game', title: 'Primeros Pasos', description: 'Has jugado tu primer juego.', icon: '🎮' },
      'snake_master': { id: 'snake_master', title: 'Encantador de Serpientes', description: 'Consigue 50 puntos en Snake.', icon: '🐍' },
      'memory_king': { id: 'memory_king', title: 'Memoria Fotográfica', description: 'Completa el juego de memoria.', icon: '🧠' },
      'croqueta_god': { id: 'croqueta_god', title: 'Rey de la Fritanga', description: 'El imperio de la croqueta ha comenzado.', icon: '🧆' },
      'rich_kid': { id: 'rich_kid', title: 'Magnate', description: 'Acumula 1000 Placetas.', icon: '💰' },
      'shopper': { id: 'shopper', title: 'Consumista', description: 'Realiza una compra en la tienda.', icon: '🛍️' }
    };

    const newAch = achievementList[id];
    if (newAch) {
        const updated = [...achievements, id];
        setAchievements(updated);
        localStorage.setItem('achievements', JSON.stringify(updated));
        setCurrentNotification(newAch);
    }
  };

  // Game Definitions with Props passed for achievements
  const GAMES: Game[] = [
    {
      id: 'croqueta-clicker',
      title: 'Croqueta Clicker',
      icon: Cookie,
      color: 'bg-amber-700',
      description: 'El imperio de la bechamel.',
      component: <CroquetaClicker onMilestone={() => unlockAchievement('croqueta_god')} />
    },
    {
      id: 'joker-poker',
      title: 'Joker Poker',
      icon: Club,
      color: 'bg-purple-900',
      description: 'Roguelike de cartas estilo Balatro.',
      component: <JokerPoker />
    },
    {
      id: 'block-craft',
      title: 'BlockCraft 2D',
      icon: Box,
      color: 'bg-cyan-600',
      description: 'Construye y explora tu mundo.',
      component: <BlockCraft />
    },
    {
      id: 'snake',
      title: 'Neon Snake',
      icon: Gamepad2,
      color: 'bg-green-600',
      description: 'El clásico arcade renovado.',
      component: <SnakeGame onScore={(s) => { if(s >= 50) unlockAchievement('snake_master'); }} />
    },
    {
      id: 'memory',
      title: 'Memory Match',
      icon: Sparkles,
      color: 'bg-indigo-600',
      description: 'Entrena tu cerebro.',
      component: <MemoryGame onComplete={() => { 
          updatePlacetas(50); 
          unlockAchievement('memory_king'); 
      }} />
    },
    {
      id: 'ai-quest',
      title: 'Aventura IA',
      icon: Sword,
      color: 'bg-amber-600',
      description: 'RPG narrativo infinito.',
      component: <AIQuest />
    },
    {
      id: 'pixel-painter',
      title: 'Arte Studio',
      icon: Palette,
      color: 'bg-pink-600',
      description: 'Crea arte con IA.',
      component: <PixelPainter />
    },
    {
      id: 'tictactoe',
      title: 'Tres en Raya',
      icon: Grip,
      color: 'bg-cyan-600',
      description: 'Estrategia clásica.',
      component: <TicTacToe />
    },
    {
      id: 'shop_launcher',
      title: 'Banco Placeta',
      icon: ShoppingBag,
      color: 'bg-yellow-500',
      description: 'Adquiere divisas del juego.',
      component: null // Special handler
    }
  ];

  // Featured Games Logic (Rotational)
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featuredGames = [GAMES[0], GAMES[1], GAMES[2]]; 

  useEffect(() => {
    const timer = setInterval(() => {
        setFeaturedIndex(prev => (prev + 1) % featuredGames.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const activeGame = GAMES.find(g => g.id === activeGameId) || null;

  const handleLaunch = (gameId: string) => {
    if (gameId === 'shop_launcher') {
        setShopOpen(true);
    } else {
        setActiveGameId(gameId);
        unlockAchievement('first_game');
    }
  };

  const handleBack = () => {
    setActiveGameId(null);
  };

  return (
    <div className="w-full h-screen bg-[#202020] flex flex-col relative overflow-hidden font-sans">
      
      {/* Notifications */}
      <Notification achievement={currentNotification} onClose={() => setCurrentNotification(null)} />

      {/* Top Status Bar */}
      <StatusBar balance={placetas} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10">
        
        {/* Main Menu Layer */}
        {!activeGame && !shopOpen && (
          <div className="flex flex-col h-full animate-in fade-in duration-500">
             
             {/* Featured Section (Hero) */}
             <div className="flex-1 relative flex items-center justify-center overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-gradient-to-t from-[#202020] to-transparent z-10" />
                {/* Background blurring based on current featured game color */}
                <div className={`absolute inset-0 opacity-20 transition-colors duration-1000 ${featuredGames[featuredIndex].color}`} />
                
                <div className="flex items-center gap-8 z-20 max-w-4xl px-8 w-full">
                    <div className={`w-64 h-64 rounded-2xl shadow-2xl flex items-center justify-center text-white ${featuredGames[featuredIndex].color} transform -rotate-3 transition-all duration-700`}>
                         {React.createElement(featuredGames[featuredIndex].icon, { size: 100 })}
                    </div>
                    <div className="flex-1 text-white space-y-4">
                        <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-widest">Destacado</span>
                        <h1 className="text-5xl font-black italic tracking-tighter drop-shadow-lg transition-all duration-500">{featuredGames[featuredIndex].title}</h1>
                        <p className="text-xl text-gray-300 max-w-md">{featuredGames[featuredIndex].description}</p>
                        <button 
                            onClick={() => handleLaunch(featuredGames[featuredIndex].id)}
                            className="bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform flex items-center gap-2 shadow-xl"
                        >
                            <Gamepad2 size={20}/> Jugar Ahora
                        </button>
                    </div>
                </div>
             </div>

             {/* Game Carousel (Bottom Half) */}
             <div className="h-1/2 flex flex-col justify-center bg-[#2d2d2d]">
                 <div className="px-12 mb-4">
                    <h3 className="text-gray-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                        <Grip size={16}/> Biblioteca de Juegos
                    </h3>
                 </div>
                 <div className="flex items-center px-12 space-x-6 overflow-x-auto no-scrollbar pb-8 snap-x snap-mandatory h-64 items-center">
                    {GAMES.map((game, idx) => {
                      const isFocused = idx === focusedIndex;
                      return (
                        <div 
                          key={game.id}
                          onClick={() => {
                            setFocusedIndex(idx);
                            if (isFocused) handleLaunch(game.id);
                          }}
                          className={`
                            relative flex-shrink-0 w-48 h-48 rounded-xl cursor-pointer transition-all duration-300 transform snap-center
                            ${isFocused ? 'scale-110 z-10 shadow-[0_0_0_4px_#0ea5e9] translate-y-[-10px]' : 'scale-95 opacity-60 hover:opacity-100 hover:scale-100'}
                          `}
                        >
                          <div className={`w-full h-full ${game.color} rounded-xl shadow-lg flex flex-col items-center justify-center text-white relative overflow-hidden group`}>
                             <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/30 pointer-events-none" />
                             <game.icon size={60} className="drop-shadow-md mb-2 group-hover:scale-110 transition-transform duration-500" />
                             {isFocused && <span className="text-sm font-bold absolute bottom-4 animate-pulse">Iniciar</span>}
                          </div>
                          {isFocused && (
                             <div className="absolute -bottom-10 left-0 right-0 text-center">
                                <span className="text-white font-bold text-lg drop-shadow">{game.title}</span>
                             </div>
                          )}
                        </div>
                      );
                    })}
                 </div>
             </div>
          </div>
        )}

        {/* Shop Layer */}
        {shopOpen && (
            <Shop 
                onBuy={(amount) => {
                    updatePlacetas(amount);
                    unlockAchievement('shopper');
                }} 
                onClose={() => setShopOpen(false)} 
            />
        )}

        {/* Active Game Layer */}
        <GameContainer game={activeGame} />

      </div>

      {/* Footer Controls */}
      <Footer inGame={!!activeGame || shopOpen} onBack={shopOpen ? () => setShopOpen(false) : handleBack} />

    </div>
  );
}