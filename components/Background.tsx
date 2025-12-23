import React from 'react';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
        }}
      />

      {/* Radial Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-vite-dark/50 to-vite-dark" />

      {/* Top Right Cyan Glow */}
      <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-vite-cyan/10 blur-[120px] rounded-full mix-blend-screen opacity-40 animate-pulse-slow" />
      
      {/* Bottom Left Purple Glow */}
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-vite-purple/15 blur-[100px] rounded-full mix-blend-screen opacity-40" />
      
      {/* Center Floating Shape */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-vite-blue/10 to-transparent rounded-full blur-3xl animate-float opacity-30" />
    </div>
  );
};
