import React, { useState, useEffect, useRef } from 'react';
import { Pickaxe, Box, ArrowLeft, ArrowRight, ArrowUp, ShoppingCart, Lock } from 'lucide-react';

// --- Types ---
type BlockType = 'sky' | 'dirt' | 'grass' | 'stone' | 'wood' | 'leaf' | 'diamond' | 'tnt';

interface BlockDef {
    color: string;
    border: string;
    name: string;
    premium?: boolean;
    cost?: number;
}

const BLOCKS: Record<BlockType, BlockDef> = {
    sky: { color: 'bg-cyan-300', border: '', name: 'Cielo' },
    dirt: { color: 'bg-[#5d4037]', border: 'border-[#3e2723]', name: 'Tierra' },
    grass: { color: 'bg-[#7cb342]', border: 'border-[#558b2f]', name: 'Césped' },
    stone: { color: 'bg-[#757575]', border: 'border-[#616161]', name: 'Piedra' },
    wood: { color: 'bg-[#795548]', border: 'border-[#5d4037]', name: 'Madera' },
    leaf: { color: 'bg-[#33691e]', border: 'border-[#1b5e20]', name: 'Hoja' },
    diamond: { color: 'bg-[#00e5ff]', border: 'border-[#00b8d4]', name: 'Diamante', premium: true, cost: 500 },
    tnt: { color: 'bg-red-500', border: 'border-white', name: 'TNT', premium: true, cost: 200 }
};

// World Config
const ROWS = 15;
const COLS = 20;

export const BlockCraft: React.FC = () => {
    // Game State
    const [grid, setGrid] = useState<BlockType[][]>([]);
    const [selectedBlock, setSelectedBlock] = useState<BlockType>('dirt');
    const [inventory, setInventory] = useState<BlockType[]>(['dirt', 'stone', 'wood', 'grass']);
    const [placetas, setPlacetas] = useState(parseInt(localStorage.getItem('placetas') || '0'));
    const [shopOpen, setShopOpen] = useState(false);

    // Init World
    useEffect(() => {
        const newGrid: BlockType[][] = [];
        for (let r = 0; r < ROWS; r++) {
            const row: BlockType[] = [];
            for (let c = 0; c < COLS; c++) {
                if (r > 10) row.push('stone');
                else if (r > 8) row.push('dirt');
                else if (r === 8) row.push('grass');
                else if (r === 7 && c === 10) row.push('wood'); // Tree trunk base
                else if (r === 6 && c === 10) row.push('wood');
                else if (r === 5 && c >= 9 && c <= 11) row.push('leaf');
                else row.push('sky');
            }
            newGrid.push(row);
        }
        setGrid(newGrid);
    }, []);

    const handleBlockClick = (r: number, c: number) => {
        const current = grid[r][c];
        const newGrid = [...grid.map(row => [...row])];

        if (current !== 'sky') {
            // Mine
            newGrid[r][c] = 'sky';
            // simple particle effect could go here
        } else {
            // Place
            newGrid[r][c] = selectedBlock;
        }
        setGrid(newGrid);
    };

    const buyBlock = (type: BlockType) => {
        const def = BLOCKS[type];
        if (!def.cost) return;

        if (placetas >= def.cost && !inventory.includes(type)) {
            const newMoney = placetas - def.cost;
            setPlacetas(newMoney);
            localStorage.setItem('placetas', newMoney.toString());
            setInventory([...inventory, type]);
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-900 relative font-sans">
            
            {/* Top Bar */}
            <div className="h-14 bg-slate-800 flex items-center justify-between px-4 border-b border-slate-700">
                <div className="flex items-center gap-2 text-white font-bold">
                    <Pickaxe size={20} className="text-yellow-400" />
                    <span>BlockCraft 2D</span>
                </div>
                <div className="flex items-center gap-4">
                     <span className="text-yellow-400 font-bold">{placetas} P</span>
                     <button 
                        onClick={() => setShopOpen(!shopOpen)}
                        className={`p-2 rounded hover:bg-slate-700 transition ${shopOpen ? 'bg-slate-700 text-yellow-400' : 'text-white'}`}
                    >
                        <ShoppingCart size={20} />
                     </button>
                </div>
            </div>

            {/* Game World */}
            <div className="flex-1 bg-cyan-200 overflow-hidden relative cursor-crosshair flex items-center justify-center p-4">
                <div 
                    className="grid bg-sky-200 shadow-2xl"
                    style={{ 
                        gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
                        width: '100%',
                        maxWidth: '800px',
                        aspectRatio: `${COLS}/${ROWS}`
                    }}
                >
                    {grid.map((row, r) => (
                        row.map((block, c) => (
                            <div 
                                key={`${r}-${c}`}
                                onClick={() => handleBlockClick(r, c)}
                                className={`
                                    w-full h-full border-[0.5px] border-black/5 hover:border-white/50 transition-colors
                                    ${BLOCKS[block].color}
                                    ${BLOCKS[block].border ? `border-2 ${BLOCKS[block].border}` : ''}
                                `}
                            />
                        ))
                    ))}
                </div>
            </div>

            {/* Inventory Toolbar */}
            <div className="h-20 bg-slate-800 border-t border-slate-600 flex items-center justify-center gap-2 p-2">
                {inventory.map(type => (
                    <button
                        key={type}
                        onClick={() => setSelectedBlock(type)}
                        className={`
                            w-14 h-14 rounded-lg border-4 flex items-center justify-center relative
                            ${selectedBlock === type ? 'border-yellow-400 scale-110' : 'border-slate-600 hover:border-slate-400'}
                            bg-slate-700 transition-all
                        `}
                    >
                        <div className={`w-8 h-8 ${BLOCKS[type].color} border border-black/20`} />
                    </button>
                ))}
            </div>

            {/* Block Shop Overlay */}
            {shopOpen && (
                <div className="absolute top-14 right-0 w-64 bg-slate-800/95 backdrop-blur shadow-xl border-l border-slate-600 p-4 h-[calc(100%-80px)] overflow-y-auto animate-in slide-in-from-right z-20">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Box size={18}/> Bloques Premium</h3>
                    <div className="space-y-3">
                        {(['diamond', 'tnt'] as BlockType[]).map(type => {
                            const def = BLOCKS[type];
                            const owned = inventory.includes(type);
                            return (
                                <div key={type} className="bg-slate-700 p-3 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 ${def.color} border border-white/20 rounded-sm`} />
                                        <div className="flex flex-col">
                                            <span className="text-white text-sm font-bold">{def.name}</span>
                                            {!owned && <span className="text-yellow-400 text-xs">{def.cost} P</span>}
                                        </div>
                                    </div>
                                    {owned ? (
                                        <span className="text-green-400 text-xs font-bold">EN USO</span>
                                    ) : (
                                        <button 
                                            onClick={() => buyBlock(type)}
                                            disabled={placetas < (def.cost || 0)}
                                            className="bg-blue-600 p-2 rounded hover:bg-blue-500 disabled:opacity-50 disabled:bg-slate-600"
                                        >
                                            <Lock size={14} className="text-white" />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};