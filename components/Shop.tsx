import React, { useState } from 'react';
import { ShoppingBag, CreditCard, Check, X, Coins, Building2 } from 'lucide-react';

interface ShopProps {
  onBuy: (amount: number) => void;
  onClose: () => void;
}

export const Shop: React.FC<ShopProps> = ({ onBuy, onClose }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);

  const packs = [
    { amount: 500, price: '4.99€', color: 'bg-emerald-600' },
    { amount: 2000, price: '14.99€', color: 'bg-blue-600' },
    { amount: 5000, price: '29.99€', color: 'bg-purple-600' },
    { amount: 10000, price: '49.99€', color: 'bg-black' },
  ];

  const handleSelect = (amount: number) => {
    setSelectedPack(amount);
    setModalOpen(true);
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
        if (selectedPack) onBuy(selectedPack);
        setProcessing(false);
        setModalOpen(false);
    }, 2000);
  };

  return (
    <div className="absolute inset-0 bg-slate-100 z-50 flex flex-col animate-in slide-in-from-bottom text-slate-900 font-sans">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
                <Building2 size={32} className="text-yellow-400" />
                <div>
                    <h1 className="text-xl font-bold uppercase tracking-widest">Banco de La Placeta</h1>
                    <p className="text-xs text-slate-400">Sucursal Digital</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
                <X size={28} />
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-black text-slate-800 mb-2">Adquirir Divisas</h2>
                    <p className="text-slate-500">Tipo de cambio actual garantizado por el Banco Central.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {packs.map((pack) => (
                        <div key={pack.amount} className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:-translate-y-2 transition-transform cursor-pointer border border-slate-200" onClick={() => handleSelect(pack.amount)}>
                            <div className={`${pack.color} h-40 flex items-center justify-center text-white relative overflow-hidden`}>
                                <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12">
                                    <Coins size={100} />
                                </div>
                                <div className="text-center z-10">
                                    <h3 className="text-4xl font-black drop-shadow-md">{pack.amount.toLocaleString()}</h3>
                                    <span className="text-xs font-bold uppercase tracking-widest bg-black/20 px-2 py-1 rounded mt-2 inline-block">Placetas</span>
                                </div>
                            </div>
                            <div className="p-6 text-center bg-slate-50">
                                <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-lg group-hover:shadow-xl">
                                    Comprar • {pack.price}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Checkout Modal */}
        {modalOpen && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-[60] backdrop-blur-md p-4">
                <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 border border-slate-200">
                    
                    {/* Simulated Card Header */}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Building2 size={120} /></div>
                        <div className="flex justify-between items-start mb-8">
                            <Building2 size={24} className="text-yellow-400"/>
                            <span className="font-mono text-sm opacity-70">DEBIT</span>
                        </div>
                        <div className="font-mono text-xl tracking-widest mb-4">•••• •••• •••• 4242</div>
                        <div className="flex justify-between items-end">
                            <div>
                                <div className="text-[10px] opacity-60 uppercase">Titular</div>
                                <div className="font-bold text-sm tracking-wide">USUARIO DE PLACETA</div>
                            </div>
                            <div className="w-8 h-5 bg-yellow-400/80 rounded-sm"></div>
                        </div>
                    </div>

                    <form onSubmit={handleCheckout} className="p-8 space-y-6">
                        <div className="text-center mb-4">
                            <h3 className="font-bold text-lg text-slate-800">Confirmar Transacción</h3>
                            <p className="text-sm text-slate-500">Estás a punto de pagar <span className="font-bold text-slate-900">{packs.find(p => p.amount === selectedPack)?.price}</span></p>
                        </div>

                        {processing ? (
                            <div className="flex flex-col items-center justify-center py-4 space-y-4">
                                <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                                <p className="font-semibold text-slate-600 text-sm animate-pulse">Contactando con el banco...</p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nº Tarjeta Banco Placeta</label>
                                        <input required type="text" defaultValue="4532 1234 5678 9000" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Caducidad</label>
                                            <input required type="text" placeholder="12/28" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
                                        </div>
                                        <div className="w-1/3">
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CVC</label>
                                            <input required type="text" placeholder="***" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">
                                        Cancelar
                                    </button>
                                    <button type="submit" className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transform active:scale-95 transition-all">
                                        <Check size={18} /> Autorizar Pago
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};