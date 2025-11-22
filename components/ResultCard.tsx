
import React, { useState, useEffect } from 'react';
import { GameResult } from '../types';
import { playDramaticBoom, playClickSound } from '../services/soundService';

interface ResultCardProps {
  data: GameResult;
  onLike?: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ data, onLike }) => {
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    playDramaticBoom();
  }, []);

  const handleLikeClick = () => {
    if (!isLiked && onLike) {
      playClickSound();
      setIsLiked(true);
      onLike();
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto animate-[fadeIn_0.5s_ease-out]">
      
      {/* Tape effect top */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-10 bg-white/30 rotate-3 z-20 backdrop-blur-sm border-l border-r border-white/50"></div>

      <div className={`relative z-10 border-4 border-black p-6 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] ${data.themeColor} text-white transform rotate-1`}>
        
        {/* The User Action */}
        <div className="mb-6 opacity-90">
          <h3 className="font-bebas text-xl tracking-widest uppercase text-white/70 mb-1 border-b-2 border-white/20 inline-block">
            Твой выбор:
          </h3>
          <p className="font-marker text-2xl md:text-3xl leading-tight text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
            "{data.userAction}"
          </p>
        </div>

        {/* Generated Image */}
        {data.imageUrl && (
          <div className="relative w-full mb-6 transform -rotate-1 group">
             <div className="absolute inset-0 bg-black translate-y-2 translate-x-2 group-hover:translate-y-3 group-hover:translate-x-3 transition-transform border-2 border-black/50"></div>
             <div className="relative border-4 border-white bg-white overflow-hidden">
               <img 
                 src={data.imageUrl} 
                 alt="Illustration generation" 
                 className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
               />
             </div>
          </div>
        )}

        <div className="w-full h-1 bg-black/20 my-6 border-b-2 border-dashed border-white/40"></div>

        {/* The Quote */}
        <div className="mb-6 relative">
          <span className="absolute -top-8 -left-4 text-8xl font-anton text-black/20">“</span>
          <blockquote className="font-anton text-4xl md:text-6xl uppercase leading-none tracking-tight z-10 relative drop-shadow-md">
            {data.quote}
          </blockquote>
          <span className="absolute -bottom-12 -right-2 text-8xl font-anton text-black/20 rotate-180">“</span>
        </div>

        {/* The Details */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-end gap-4 font-mono text-sm md:text-base font-bold bg-black p-4 text-white border-2 border-white border-dashed w-full transform -rotate-1 relative">
          
          <div>
            <span className="block text-gray-400 text-xs uppercase tracking-wider">Герой</span>
            <span className="text-yellow-400">{data.character}</span>
          </div>
          <div className="text-right">
             <span className="block text-gray-400 text-xs uppercase tracking-wider">Фильм</span>
             <span>{data.movie} ({data.year})</span>
             <div className="text-xs text-gray-500 uppercase mt-1">Реж. {data.director}</div>
          </div>
        </div>

        {/* Stickers/Badges */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white rounded-full border-4 border-black flex items-center justify-center rotate-12 shadow-lg z-30">
            <span className="font-anton text-black text-lg leading-none text-center transform -rotate-6">
                ВЕРДИКТ<br/>РЕЖИССЕРА
            </span>
        </div>

        {/* Like Button (Stamp style) */}
        <div className="absolute bottom-2 right-2 md:-right-6 md:bottom-16 z-40">
           <button 
             onClick={handleLikeClick}
             disabled={isLiked}
             className={`
               transform transition-all duration-200
               border-4 border-dashed rounded-lg px-4 py-2
               font-anton text-xl md:text-2xl uppercase tracking-widest
               ${isLiked 
                  ? "bg-white text-green-700 border-green-700 rotate-[-10deg] scale-110 cursor-default shadow-none opacity-90" 
                  : "bg-black text-white border-white/50 hover:bg-white hover:text-black hover:border-black hover:rotate-3 hover:scale-105 cursor-pointer shadow-lg"}
             `}
           >
             {isLiked ? "ОТ ДУШИ" : "ЗАЧЁТ"}
           </button>
        </div>

      </div>
    </div>
  );
};
