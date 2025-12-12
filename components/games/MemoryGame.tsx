import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const EMOJIS = ['🚀', '🍕', '🎮', '💀', '👽', '👾', '🤖', '🎲'];

interface Card {
    id: number;
    emoji: string;
    flipped: boolean;
    matched: boolean;
}

interface MemoryGameProps {
    onComplete: () => void;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ onComplete }) => {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);

    useEffect(() => {
        shuffleCards();
    }, []);

    const shuffleCards = () => {
        const duplicated = [...EMOJIS, ...EMOJIS];
        const shuffled = duplicated
            .sort(() => Math.random() - 0.5)
            .map((emoji, index) => ({
                id: index,
                emoji,
                flipped: false,
                matched: false
            }));
        setCards(shuffled);
        setMoves(0);
        setFlippedCards([]);
    };

    const handleCardClick = (id: number) => {
        if (flippedCards.length === 2) return;
        if (cards[id].matched || cards[id].flipped) return;

        const newCards = [...cards];
        newCards[id].flipped = true;
        setCards(newCards);

        const newFlipped = [...flippedCards, id];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            checkForMatch(newFlipped, newCards);
        }
    };

    const checkForMatch = (currentFlipped: number[], currentCards: Card[]) => {
        const [id1, id2] = currentFlipped;
        if (currentCards[id1].emoji === currentCards[id2].emoji) {
            currentCards[id1].matched = true;
            currentCards[id2].matched = true;
            setCards([...currentCards]);
            setFlippedCards([]);
            
            if (currentCards.every(c => c.matched)) {
                setTimeout(onComplete, 500);
            }
        } else {
            setTimeout(() => {
                currentCards[id1].flipped = false;
                currentCards[id2].flipped = false;
                setCards([...currentCards]);
                setFlippedCards([]);
            }, 1000);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full bg-indigo-900 text-white">
            <div className="flex justify-between w-full max-w-md mb-6 px-4">
                <h2 className="text-2xl font-bold flex gap-2"><Sparkles className="text-yellow-400"/> Memory Match</h2>
                <span className="text-xl font-mono bg-indigo-950 px-4 py-1 rounded-lg">Movimientos: {moves}</span>
            </div>

            <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-lg">
                {cards.map((card, index) => (
                    <button
                        key={index}
                        onClick={() => handleCardClick(index)}
                        className={`
                            w-16 h-16 md:w-24 md:h-24 rounded-xl text-4xl flex items-center justify-center transition-all duration-300 transform
                            ${card.flipped || card.matched ? 'bg-white rotate-y-180' : 'bg-indigo-600 hover:bg-indigo-500'}
                            ${card.matched ? 'opacity-50 scale-95' : ''}
                        `}
                        style={{ perspective: '1000px' }}
                    >
                        {(card.flipped || card.matched) ? card.emoji : '?'}
                    </button>
                ))}
            </div>

            <button 
                onClick={shuffleCards}
                className="mt-8 px-6 py-2 bg-indigo-500 hover:bg-indigo-400 rounded-lg font-bold transition-colors"
            >
                Reiniciar Tablero
            </button>
        </div>
    );
};