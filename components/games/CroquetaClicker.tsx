import React, { useEffect, useState } from 'react';
import { ExternalLink, Maximize2, AlertTriangle } from 'lucide-react';

export const CroquetaClicker: React.FC<{ onMilestone?: () => void }> = ({ onMilestone }) => {
    const [iframeError, setIframeError] = useState(false);

    // Simple timer to award "participation" achievement since we can't track iframe events easily
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onMilestone) onMilestone();
        }, 60000); // Award after 1 minute of gameplay
        return () => clearTimeout(timer);
    }, [onMilestone]);

    if (iframeError) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#3e2723] text-[#ffcc80] p-8 text-center">
                <AlertTriangle size={64} className="mb-4 text-yellow-500" />
                <h2 className="text-2xl font-bold mb-2">No se pudo cargar el juego aquí</h2>
                <p className="mb-6 max-w-md">
                    El navegador ha bloqueado la carga de Croqueta Clicker dentro de esta ventana.
                </p>
                <a
                    href="https://croquetaclicker.whiteroot.studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#ffb74d] text-black font-bold py-3 px-6 rounded-full hover:bg-white transition-colors flex items-center gap-2"
                >
                    <ExternalLink size={20} /> Abrir en nueva pestaña
                </a>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-black relative flex flex-col">
            {/* Toolbar */}
            <div className="h-10 bg-[#281a16] border-b border-[#5d4037] flex items-center justify-between px-4 text-xs text-[#ffcc80]">
                <span className="font-bold flex items-center gap-2">
                    <img src="https://croquetaclicker.whiteroot.studio/favicon.ico" className="w-4 h-4" alt="" onError={(e) => e.currentTarget.style.display = 'none'} />
                    Croqueta Clicker (Oficial)
                </span>
                <a
                    href="https://croquetaclicker.whiteroot.studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white flex items-center gap-1 transition-colors"
                    title="Abrir sitio original"
                >
                    <ExternalLink size={14} /> Sitio Original
                </a>
            </div>

            {/* Game Embed */}
            <div className="flex-1 relative overflow-hidden">
                <iframe
                    src="https://croquetaclicker.whiteroot.studio"
                    title="Croqueta Clicker"
                    className="w-full h-full border-0"
                    allow="autoplay; fullscreen; clipboard-write"
                    onError={() => setIframeError(true)}
                />

                {/* Overlay for loading/interaction hint if needed */}
                <div className="absolute inset-0 pointer-events-none bg-black/0 transition-colors" />
            </div>
        </div>
    );
};
