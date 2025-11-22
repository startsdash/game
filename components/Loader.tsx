
import React, { useState, useEffect } from 'react';

interface LoaderProps {
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ text = "ЗАГРУЗКА..." }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let currentIndex = 0;
    const typeSpeed = 60; // ms per char
    
    const typeChar = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeChar, typeSpeed + (Math.random() * 40 - 20)); // Slight irregularity
      }
    };
    
    const timer = setTimeout(typeChar, 100);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div className="flex flex-col items-center justify-center py-16 w-full">
      
      {/* Film Reel Animation */}
      <div className="relative mb-12">
        {/* Reel Body */}
        <div className="relative w-32 h-32 rounded-full border-[6px] border-black bg-zinc-900 shadow-[0_10px_20px_rgba(0,0,0,0.4)] animate-[spin_4s_linear_infinite]">
          
          {/* Inner Rim */}
          <div className="absolute inset-2 rounded-full border-2 border-zinc-600 opacity-30"></div>

          {/* Holes (Simulated transparency using app background color yellow-400) */}
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <div 
              key={deg}
              className="absolute top-1/2 left-1/2 w-8 h-12 -ml-4 -mt-14 bg-[#facc15] rounded-xl transform origin-bottom"
              style={{ transform: `rotate(${deg}deg) translateY(6px)` }}
            >
                {/* Inner shadow for depth inside the hole */}
                <div className="w-full h-full rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"></div>
            </div>
          ))}

          {/* Center Hub */}
          <div className="absolute top-1/2 left-1/2 w-10 h-10 -ml-5 -mt-5 bg-zinc-400 rounded-full border-4 border-black z-10 flex items-center justify-center shadow-md">
             <div className="w-1 h-1 bg-black rounded-full mx-0.5"></div>
             <div className="w-1 h-1 bg-black rounded-full mx-0.5"></div>
             <div className="w-1 h-1 bg-black rounded-full mx-0.5"></div>
          </div>
        </div>

        {/* Film Strip Decor (Background) */}
        <div className="absolute top-1/2 left-1/2 w-64 h-16 bg-black -translate-x-1/2 -translate-y-1/2 -z-10 rotate-[-15deg] flex items-center overflow-hidden opacity-80 border-y-4 border-white/20">
            {/* Sprocket holes */}
            <div className="w-full h-full flex justify-between px-2 py-1">
                 <div className="flex flex-col justify-between h-full w-full">
                    <div className="flex gap-4">
                        {[...Array(8)].map((_, i) => <div key={`top-${i}`} className="w-3 h-2 bg-white/50 rounded-sm"></div>)}
                    </div>
                    <div className="flex gap-4">
                         {[...Array(8)].map((_, i) => <div key={`bot-${i}`} className="w-3 h-2 bg-white/50 rounded-sm"></div>)}
                    </div>
                 </div>
            </div>
        </div>
      </div>

      {/* Typewriter Text Card */}
      <div className="relative bg-white border-4 border-black p-6 max-w-lg shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
        
        {/* Tape effect */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/90 border-l border-r border-black/20 rotate-2 backdrop-blur-sm"></div>

        {/* Text content */}
        <div className="font-mono text-xl md:text-2xl text-black uppercase tracking-wider font-bold flex flex-wrap items-center">
          <span className="mr-2 text-gray-400 select-none">&gt;</span>
          {displayedText}
          <span className="w-3 h-6 bg-black ml-1 animate-[pulse_0.7s_infinite] inline-block align-middle"></span>
        </div>
        
        {/* Footer meta */}
        <div className="mt-4 pt-2 border-t-2 border-dashed border-black/20 flex justify-between items-center text-xs font-bebas text-gray-500 tracking-widest">
             <span>STATUS: IN_PROGRESS</span>
             <span>FRAME: {Math.floor(Date.now() / 100) % 1000}</span>
        </div>
      </div>
    </div>
  );
};
