import React, { useState, useEffect } from 'react';
import { MousePointer2, ChefHat, Store, Factory, Zap, TrendingUp, Utensils } from 'lucide-react';

interface Upgrade {
    id: string;
    name: string;
    cost: number;
    cps: number; // Croquetas per second
    icon: React.ReactNode;
    count: number;
}

const INITIAL_UPGRADES: Upgrade[] = [
    { id: 'cursor', name: 'Tenedor Extra', cost: 15, cps: 0.5, icon: <MousePointer2 size={18}/>, count: 0 },
    { id: 'abuela', name: 'Abuela Freidora', cost: 100, cps: 4, icon: <ChefHat size={18}/>, count: 0 },
    { id: 'freidora', name: 'Freidora Industrial', cost: 1100, cps: 12, icon: <Utensils size={18}/>, count: 0 },
    { id: 'bar', name: 'Bar Manolo', cost: 12000, cps: 50, icon: <Store size={18}/>, count: 0 },
    { id: 'fabrica', name: 'Fábrica de Bechamel', cost: 130000, cps: 250, icon: <Factory size={18}/>, count: 0 },
    { id: 'nuclear', name: 'Fritura Nuclear', cost: 1400000, cps: 1500, icon: <Zap size={18}/>, count: 0 },
];

export const CroquetaClicker: React.FC<{ onMilestone?: () => void }> = ({ onMilestone }) => {
    // Game State
    const [croquetas, setCroquetas] = useState(0);
    const [cps, setCps] = useState(0);
    const [upgrades, setUpgrades] = useState<Upgrade[]>(INITIAL_UPGRADES);
    const [particles, setParticles] = useState<{id: number, x: number, y: number, text: string}[]>([]);
    
    // Auto-Save / Load (Simplified for this session)
    // We could use localStorage here but let's keep it transient for the demo or sync with parent if needed.

    // Game Loop (Tick)
    useEffect(() => {
        if (cps === 0) return;
        const interval = setInterval(() => {
            setCroquetas(c => c + cps / 10);
        }, 100);
        return () => clearInterval(interval);
    }, [cps]);

    // Check Milestones
    useEffect(() => {
        if (croquetas > 1000 && onMilestone) {
            onMilestone();
        }
    }, [croquetas, onMilestone]);

    const handleClick = (e: React.MouseEvent) => {
        const amount = 1 + (upgrades[0].count * 0.5); // Cursor boost
        setCroquetas(c => c + amount);

        // Particle VFX
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        // Randomize position slightly around the click center or button center
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top;
        
        const id = Date.now() + Math.random();
        setParticles(prev => [...prev, { id, x, y, text: `+${amount.toFixed(1)}` }]);
        
        // Cleanup particle
        setTimeout(() => {
            setParticles(prev => prev.filter(p => p.id !== id));
        }, 800);
    };

    const buyUpgrade = (id: string) => {
        const upgradeIndex = upgrades.findIndex(u => u.id === id);
        if (upgradeIndex === -1) return;
        
        const upgrade = upgrades[upgradeIndex];
        if (croquetas >= upgrade.cost) {
            setCroquetas(c => c - upgrade.cost);
            const newUpgrades = [...upgrades];
            newUpgrades[upgradeIndex] = {
                ...upgrade,
                count: upgrade.count + 1,
                cost: Math.floor(upgrade.cost * 1.15) // Price increase
            };
            setUpgrades(newUpgrades);
            recalcCps(newUpgrades);
        }
    };

    const recalcCps = (currentUpgrades: Upgrade[]) => {
        const newCps = currentUpgrades.reduce((acc, u) => acc + (u.cps * u.count), 0);
        setCps(newCps);
    };

    return (
        <div className="flex h-full bg-[#3e2723] text-[#ffe0b2] font-mono overflow-hidden select-none">
             {/* Left Panel: The Interaction */}
             <div className="w-1/3 min-w-[300px] flex flex-col items-center justify-center border-r-4 border-[#5d4037] bg-gradient-to-b from-[#4e342e] to-[#3e2723] relative shadow-2xl z-10">
                
                {/* Stats Header */}
                <div className="absolute top-8 w-full text-center">
                    <h2 className="text-5xl font-black text-[#ffcc80] drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] mb-2">
                        {Math.floor(croquetas).toLocaleString()}
                    </h2>
                    <p className="text-sm uppercase tracking-[0.2em] opacity-70 font-bold">Croquetas</p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-black/20 px-4 py-1 rounded-full text-xs font-bold text-[#ffb74d]">
                        <TrendingUp size={14}/> {cps.toFixed(1)} / seg
                    </div>
                </div>
                
                {/* The Big Croqueta */}
                <div className="relative group mt-12">
                    <button 
                        onClick={handleClick}
                        className="
                            text-[160px] leading-none 
                            transition-transform duration-75 ease-out
                            active:scale-90 hover:scale-105 
                            cursor-pointer 
                            filter drop-shadow-2xl 
                            active:brightness-90
                        "
                        style={{ textShadow: '0 10px 20px rgba(0,0,0,0.5)' }}
                    >
                        🧆
                    </button>
                    
                    {/* Click Particles */}
                    {particles.map(p => (
                        <div 
                            key={p.id}
                            className="absolute pointer-events-none text-3xl font-black text-white"
                            style={{ 
                                left: p.x, 
                                top: p.y,
                                transform: 'translate(-50%, -50%)',
                                animation: 'floatUp 0.8s ease-out forwards'
                            }}
                        >
                            {p.text}
                        </div>
                    ))}
                </div>

                <style>{`
                    @keyframes floatUp {
                        0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                        100% { opacity: 0; transform: translate(-50%, -150px) scale(1.5); }
                    }
                `}</style>
             </div>

             {/* Right Panel: The Store */}
             <div className="flex-1 flex flex-col bg-[#3e2723] relative">
                {/* Store Header */}
                <div className="h-20 bg-[#281a16] border-b-4 border-[#5d4037] flex justify-between items-center px-6 shadow-md z-20">
                    <h3 className="font-bold text-2xl flex items-center gap-3 text-[#ffcc80]">
                        <Store className="fill-[#ffcc80] text-[#281a16]"/> Mercado de Fritanga
                    </h3>
                </div>
                
                {/* Upgrades List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                    {upgrades.map(u => {
                        const canAfford = croquetas >= u.cost;
                        return (
                            <button 
                                key={u.id}
                                onClick={() => buyUpgrade(u.id)}
                                disabled={!canAfford}
                                className={`
                                    w-full flex items-center p-4 rounded-xl border-b-4 transition-all relative overflow-hidden group
                                    ${canAfford 
                                        ? 'bg-[#5d4037] border-[#3e2723] hover:bg-[#6d4c41] hover:translate-y-[-2px] hover:border-b-8 active:translate-y-[2px] active:border-b-2' 
                                        : 'bg-[#281a16] border-transparent opacity-50 cursor-not-allowed grayscale'}
                                `}
                            >
                                {/* Icon Box */}
                                <div className={`w-16 h-16 rounded-lg bg-[#3e2723] shadow-inner flex items-center justify-center text-[#ffcc80] mr-5 shrink-0 border border-[#4e342e]`}>
                                    {u.icon}
                                </div>
                                
                                {/* Info */}
                                <div className="flex-1 text-left">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-xl text-[#ffe0b2]">{u.name}</span>
                                        <span className="text-4xl font-black text-black/20 group-hover:text-black/30 transition-colors">{u.count}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-mono">
                                        <span className={`font-bold ${canAfford ? 'text-[#69f0ae]' : 'text-red-400'}`}>
                                            {u.cost.toLocaleString()} 🧆
                                        </span>
                                        <span className="text-[#ffb74d] opacity-80">
                                            +{u.cps} cps
                                        </span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
             </div>
        </div>
    );
};