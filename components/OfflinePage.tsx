import React from 'react';

export const OfflinePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Starry Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-lg z-10 flex flex-col items-center">
        {/* Illustration: Robot Sleeping on Moon */}
        <div className="relative w-72 h-72 mb-8 animate-float">
          <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
            {/* Earth in the Sky */}
            <circle cx="320" cy="80" r="40" fill="#1e293b" className="animate-pulse-slow" />
            <circle cx="320" cy="80" r="38" fill="#3b82f6" fillOpacity="0.8" />
            {/* Earth Continents */}
            <path d="M300 70C305 60 320 60 325 75C330 85 310 90 300 70Z" fill="#4ade80" fillOpacity="0.9" />
            <path d="M330 90C340 85 350 95 345 105C335 110 325 100 330 90Z" fill="#4ade80" fillOpacity="0.9" />
            
            {/* Moon Surface */}
            <path d="M20 300 Q200 240 380 300 L380 400 L20 400 Z" fill="#27272a" stroke="#3f3f46" strokeWidth="2" />
            {/* Moon Craters */}
            <ellipse cx="100" cy="320" rx="30" ry="10" fill="#18181b" opacity="0.5" />
            <ellipse cx="250" cy="350" rx="40" ry="15" fill="#18181b" opacity="0.5" />
            <ellipse cx="320" cy="310" rx="15" ry="5" fill="#18181b" opacity="0.5" />

            {/* Robot Body (Lying down) */}
            <g transform="translate(140, 260) rotate(-10)">
                {/* Legs */}
                <rect x="10" y="50" width="10" height="30" rx="2" fill="#52525b" />
                <rect x="30" y="50" width="10" height="30" rx="2" fill="#52525b" />
                
                {/* Torso */}
                <rect x="0" y="20" width="50" height="40" rx="5" fill="#71717a" stroke="#a1a1aa" strokeWidth="2" />
                {/* Chest Panel */}
                <rect x="10" y="30" width="30" height="20" rx="2" fill="#3f3f46" />
                <circle cx="18" cy="40" r="2" fill="#ef4444" className="animate-pulse" /> {/* Low Battery Light */}
                
                {/* Head */}
                <rect x="5" y="-15" width="40" height="30" rx="4" fill="#71717a" stroke="#a1a1aa" strokeWidth="2" />
                
                {/* Eyes (Closed - Lines) */}
                <line x1="15" y1="0" x2="22" y2="0" stroke="#000" strokeWidth="2" />
                <line x1="28" y1="0" x2="35" y2="0" stroke="#000" strokeWidth="2" />
                
                {/* Antenna */}
                <line x1="25" y1="-15" x2="25" y2="-25" stroke="#a1a1aa" strokeWidth="2" />
                <circle cx="25" cy="-28" r="3" fill="#ec4899" />
            </g>

            {/* ZZZs */}
            <g className="animate-bounce-slow" style={{ opacity: 0.8 }}>
              <text x="200" y="230" fontFamily="monospace" fontSize="24" fill="#ec4899" fontWeight="bold">Z</text>
            </g>
            <g className="animate-bounce-slow" style={{ animationDelay: '0.5s', opacity: 0.6 }}>
              <text x="220" y="210" fontFamily="monospace" fontSize="20" fill="#d946ef" fontWeight="bold">z</text>
            </g>
            <g className="animate-bounce-slow" style={{ animationDelay: '1s', opacity: 0.4 }}>
              <text x="235" y="195" fontFamily="monospace" fontSize="16" fill="#a855f7" fontWeight="bold">z</text>
            </g>
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">System Offline</h1>
        <p className="text-gray-400 text-center mb-8 max-w-xs">
          The connection to the Aether has been lost. The systems are resting until signal returns.
        </p>

        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-vite-pink text-white font-bold rounded-lg border border-pink-500/50 hover:bg-pink-600 transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)]"
        >
          Try Reconnecting
        </button>
      </div>

      <div className="absolute bottom-6 text-[10px] font-mono text-gray-700 uppercase tracking-widest">
        Error_Code: 0x00_DISCONNECTED
      </div>
    </div>
  );
};