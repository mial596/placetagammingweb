import React, { useState, useEffect } from 'react';
import { Club, Diamond, Heart, Spade, Flame, PlusCircle } from 'lucide-react';

// --- Types ---
type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
interface Card {
  id: string;
  suit: Suit;
  rank: number; // 2-14 (11=J, 12=Q, 13=K, 14=A)
  selected: boolean;
}
interface Joker {
    id: string;
    name: string;
    desc: string;
    cost: number;
    effect: (chips: number, mult: number) => { chips: number; mult: number };
}

// --- Utils ---
const generateDeck = (): Card[] => {
    const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const deck: Card[] = [];
    let idCounter = 0;
    for (const suit of suits) {
        for (let r = 2; r <= 14; r++) {
            deck.push({ id: `card-${idCounter++}`, suit, rank: r, selected: false });
        }
    }
    return deck.sort(() => Math.random() - 0.5);
};

const getHandName = (cards: Card[]): { name: string; baseChips: number; baseMult: number } => {
    if (cards.length === 0) return { name: 'Nada', baseChips: 0, baseMult: 0 };
    
    const sorted = [...cards].sort((a, b) => a.rank - b.rank);
    const ranks = sorted.map(c => c.rank);
    const suits = sorted.map(c => c.suit);
    const isFlush = suits.every(s => s === suits[0]) && suits.length >= 5;
    
    // Check Straight
    let isStraight = false;
    if (ranks.length >= 5) {
        let sequence = 0;
        for(let i=0; i<ranks.length-1; i++) {
            if (ranks[i+1] === ranks[i] + 1) sequence++;
            else if (ranks[i+1] !== ranks[i]) sequence = 0;
            if (sequence >= 4) isStraight = true;
        }
    }

    const counts: Record<number, number> = {};
    ranks.forEach(r => counts[r] = (counts[r] || 0) + 1);
    const values = Object.values(counts).sort((a, b) => b - a); // e.g., [4, 1] for 4 of a kind

    if (isFlush && isStraight) return { name: 'Straight Flush', baseChips: 100, baseMult: 8 };
    if (values[0] === 4) return { name: '4 of a Kind', baseChips: 60, baseMult: 7 };
    if (values[0] === 3 && values[1] >= 2) return { name: 'Full House', baseChips: 40, baseMult: 4 };
    if (isFlush) return { name: 'Flush', baseChips: 35, baseMult: 4 };
    if (isStraight) return { name: 'Straight', baseChips: 30, baseMult: 4 };
    if (values[0] === 3) return { name: '3 of a Kind', baseChips: 30, baseMult: 3 };
    if (values[0] === 2 && values[1] === 2) return { name: 'Two Pair', baseChips: 20, baseMult: 2 };
    if (values[0] === 2) return { name: 'Pair', baseChips: 10, baseMult: 2 };
    
    return { name: 'High Card', baseChips: 5, baseMult: 1 };
};

const AVAILABLE_JOKERS: Joker[] = [
    { id: 'j1', name: 'El Bufón', desc: '+4 Mult', cost: 150, effect: (c, m) => ({ chips: c, mult: m + 4 }) },
    { id: 'j2', name: 'La Montaña', desc: '+50 Chips', cost: 200, effect: (c, m) => ({ chips: c + 50, mult: m }) },
    { id: 'j3', name: 'El Loco', desc: 'x2 Mult', cost: 500, effect: (c, m) => ({ chips: c, mult: m * 2 }) },
];

export const JokerPoker: React.FC = () => {
    // Game State
    const [deck, setDeck] = useState<Card[]>([]);
    const [hand, setHand] = useState<Card[]>([]);
    const [discardCount, setDiscardCount] = useState(3);
    const [handCount, setHandCount] = useState(4);
    
    const [score, setScore] = useState(0);
    const [targetScore, setTargetScore] = useState(600);
    const [round, setRound] = useState(1);
    const [myJokers, setMyJokers] = useState<Joker[]>([]);
    
    // Currency State (Local simulation of Placetas for this game session)
    // In a real app, this would sync with the global Placetas context
    const [localPlacetas, setLocalPlacetas] = useState(parseInt(localStorage.getItem('placetas') || '0'));
    
    // UI State
    const [shopOpen, setShopOpen] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [lastHandScore, setLastHandScore] = useState<{chips: number, mult: number, total: number} | null>(null);

    // Init
    useEffect(() => {
        startRound();
    }, []);

    const startRound = () => {
        const d = generateDeck();
        setHand(d.slice(0, 8));
        setDeck(d.slice(8));
        setDiscardCount(3);
        setHandCount(4);
        setLastHandScore(null);
    };

    const nextRound = () => {
        setScore(0);
        setTargetScore(prev => Math.floor(prev * 1.5));
        setRound(r => r + 1);
        startRound();
    };

    const toggleSelect = (id: string) => {
        setHand(prev => {
            const card = prev.find(c => c.id === id);
            if (!card?.selected && prev.filter(c => c.selected).length >= 5) return prev;
            return prev.map(c => c.id === id ? { ...c, selected: !c.selected } : c);
        });
    };

    const discard = () => {
        if (discardCount <= 0) return;
        const selected = hand.filter(c => c.selected);
        if (selected.length === 0) return;

        const keep = hand.filter(c => !c.selected);
        const drawNeeded = 8 - keep.length;
        const drawn = deck.slice(0, drawNeeded);
        
        setHand([...keep, ...drawn]);
        setDeck(deck.slice(drawNeeded));
        setDiscardCount(c => c - 1);
    };

    const playHand = () => {
        if (handCount <= 0) return;
        const selected = hand.filter(c => c.selected);
        if (selected.length === 0) return;

        // Calculate Score
        const { baseChips, baseMult } = getHandName(selected);
        let chips = baseChips + selected.reduce((sum, c) => sum + (c.rank > 10 ? 10 : (c.rank === 14 ? 11 : c.rank)), 0);
        let mult = baseMult;

        // Apply Jokers
        myJokers.forEach(j => {
            const res = j.effect(chips, mult);
            chips = res.chips;
            mult = res.mult;
        });

        const handTotal = chips * mult;
        
        // Update State
        const newTotalScore = score + handTotal;
        setScore(newTotalScore);
        setLastHandScore({ chips, mult, total: handTotal });

        // Remove played cards and draw
        const keep = hand.filter(c => !c.selected);
        const drawNeeded = 8 - keep.length;
        const drawn = deck.slice(0, drawNeeded);
        setHand([...keep, ...drawn]);
        setDeck(deck.slice(drawNeeded));
        setHandCount(c => c - 1);

        // Check Win Condition immediately after update (logic needs to handle state update delay, using calculated val)
        if (newTotalScore >= targetScore) {
            setTimeout(nextRound, 1500);
            // Award money
            const reward = 50;
            const newMoney = localPlacetas + reward;
            setLocalPlacetas(newMoney);
            localStorage.setItem('placetas', newMoney.toString());
        } else if (handCount - 1 <= 0) {
            setGameOver(true);
        }
    };

    const buyJoker = (joker: Joker) => {
        if (localPlacetas >= joker.cost && myJokers.length < 5) {
            const newMoney = localPlacetas - joker.cost;
            setLocalPlacetas(newMoney);
            localStorage.setItem('placetas', newMoney.toString());
            setMyJokers([...myJokers, joker]);
        }
    };

    // --- Render Helpers ---
    const getSuitIcon = (s: Suit) => {
        switch(s) {
            case 'hearts': return <Heart size={16} className="fill-red-500 text-red-500"/>;
            case 'diamonds': return <Diamond size={16} className="fill-red-500 text-red-500"/>;
            case 'clubs': return <Club size={16} className="fill-black text-black"/>;
            case 'spades': return <Spade size={16} className="fill-black text-black"/>;
        }
    };

    const getRankLabel = (r: number) => {
        if (r <= 10) return r;
        if (r === 11) return 'J';
        if (r === 12) return 'Q';
        if (r === 13) return 'K';
        if (r === 14) return 'A';
    };

    if (gameOver) {
        return (
            <div className="h-full bg-slate-900 flex flex-col items-center justify-center text-white">
                <h2 className="text-6xl font-black text-red-500 mb-4 tracking-tighter">GAME OVER</h2>
                <p className="text-2xl mb-8">Ronda Alcanzada: {round}</p>
                <button onClick={() => window.location.reload()} className="bg-red-600 px-8 py-3 rounded-xl font-bold hover:bg-red-500">Reiniciar</button>
            </div>
        );
    }

    return (
        <div className="h-full bg-[#1a1a2e] text-white flex flex-col overflow-hidden font-mono relative">
            
            {/* Top Info Bar */}
            <div className="bg-[#16213e] p-4 flex justify-between items-center border-b border-white/10">
                <div className="flex flex-col">
                    <span className="text-xs text-slate-400 uppercase tracking-widest">Puntuación Objetiva</span>
                    <div className="text-3xl font-black text-red-400 flex items-center gap-2">
                        <Flame size={24} className="fill-red-500 animate-pulse" />
                        {targetScore.toLocaleString()}
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-400 uppercase tracking-widest">Tu Puntuación</span>
                    <div className="text-3xl font-black text-white">{score.toLocaleString()}</div>
                </div>
            </div>

            {/* Play Area */}
            <div className="flex-1 flex flex-col items-center justify-center relative p-4">
                
                {/* Last Hand Feedback */}
                {lastHandScore && (
                    <div className="absolute top-10 bg-black/80 p-4 rounded-xl border border-yellow-500/50 flex gap-4 animate-in fade-in zoom-in">
                        <div className="flex flex-col items-center">
                            <span className="text-blue-400 font-bold text-xl">{lastHandScore.chips}</span>
                            <span className="text-xs text-slate-400">CHIPS</span>
                        </div>
                        <div className="text-xl font-bold text-slate-500">X</div>
                        <div className="flex flex-col items-center">
                            <span className="text-red-400 font-bold text-xl">{lastHandScore.mult}</span>
                            <span className="text-xs text-slate-400">MULT</span>
                        </div>
                        <div className="w-px bg-slate-600"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-yellow-400 font-black text-2xl">{lastHandScore.total}</span>
                            <span className="text-xs text-slate-400">TOTAL</span>
                        </div>
                    </div>
                )}

                {/* Cards */}
                <div className="flex gap-2 justify-center items-end h-48 mb-8">
                    {hand.map((card, i) => (
                        <div 
                            key={card.id}
                            onClick={() => toggleSelect(card.id)}
                            className={`
                                w-24 h-36 bg-white rounded-lg shadow-xl border-4 cursor-pointer transition-all duration-200 relative
                                flex flex-col items-center justify-between p-2 select-none
                                ${card.selected ? 'border-yellow-400 -translate-y-6 shadow-yellow-500/50' : 'border-slate-300 hover:-translate-y-2'}
                            `}
                        >
                            <div className="w-full flex justify-start font-bold text-xl" style={{color: (card.suit === 'hearts' || card.suit === 'diamonds') ? 'red' : 'black'}}>
                                {getRankLabel(card.rank)}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                {getSuitIcon(card.suit)}
                            </div>
                            <div className="w-full flex justify-end">
                                {getSuitIcon(card.suit)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Controls */}
                <div className="flex gap-4 items-center">
                    <div className="flex flex-col gap-2">
                        <button 
                            onClick={playHand}
                            disabled={handCount <= 0}
                            className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-black py-3 px-8 rounded-lg shadow-lg border-b-4 border-orange-700 active:border-b-0 active:translate-y-1 transition-all"
                        >
                            JUGAR MANO
                        </button>
                        <span className="text-center text-xs uppercase tracking-widest text-slate-400">Manos: {handCount}</span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button 
                            onClick={discard}
                            disabled={discardCount <= 0}
                            className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg shadow-lg border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all"
                        >
                            DESCARTAR
                        </button>
                        <span className="text-center text-xs uppercase tracking-widest text-slate-400">Descartes: {discardCount}</span>
                    </div>
                </div>
            </div>

            {/* Bottom Panel (Economy & Jokers) */}
            <div className="h-48 bg-[#0f3460] p-4 flex gap-4 border-t border-white/10">
                {/* Joker Slots */}
                <div className="flex-1 bg-black/30 rounded-xl p-2 flex gap-2 overflow-x-auto items-center">
                    {myJokers.length === 0 && <span className="text-slate-500 text-sm p-4">Sin Jokers activos</span>}
                    {myJokers.map((j, i) => (
                        <div key={i} className="min-w-[80px] h-28 bg-purple-900 rounded border border-purple-500 p-2 flex flex-col items-center justify-center text-center shadow-lg">
                            <span className="text-xs font-bold text-purple-200">{j.name}</span>
                            <span className="text-[10px] text-white mt-1">{j.desc}</span>
                        </div>
                    ))}
                </div>

                {/* Shop Button / Money */}
                <div className="w-48 flex flex-col gap-2">
                     <div className="bg-black/50 p-2 rounded text-center">
                        <span className="text-yellow-400 font-bold">{localPlacetas} Placetas</span>
                     </div>
                     <button 
                        onClick={() => setShopOpen(!shopOpen)}
                        className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                     >
                        <PlusCircle size={20} /> TIENDA
                     </button>
                </div>
            </div>

            {/* In-Game Shop Overlay */}
            {shopOpen && (
                <div className="absolute inset-0 bg-black/90 z-20 p-8 flex flex-col items-center justify-center animate-in slide-in-from-bottom">
                    <h2 className="text-3xl font-bold mb-8 text-yellow-400">Tienda de Jokers</h2>
                    <div className="flex gap-4">
                        {AVAILABLE_JOKERS.map(j => (
                            <div key={j.id} className="w-40 bg-slate-800 border-2 border-slate-600 p-4 rounded-xl flex flex-col items-center gap-4 hover:border-yellow-400 transition-colors">
                                <h4 className="font-bold text-center">{j.name}</h4>
                                <p className="text-sm text-center text-slate-300">{j.desc}</p>
                                <button 
                                    onClick={() => buyJoker(j)}
                                    disabled={localPlacetas < j.cost || myJokers.some(mj => mj.id === j.id)}
                                    className="bg-green-600 w-full py-2 rounded font-bold disabled:opacity-50 disabled:bg-slate-600"
                                >
                                    ${j.cost}
                                </button>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setShopOpen(false)} className="mt-8 text-slate-400 hover:text-white underline">Cerrar Tienda</button>
                </div>
            )}
        </div>
    );
};