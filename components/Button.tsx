
import React from 'react';
import { playClickSound } from '../services/soundService';

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ onClick, disabled, label, className = '' }) => {
  
  const handleClick = () => {
    if (!disabled) {
      playClickSound();
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative group font-anton tracking-wider uppercase text-2xl md:text-4xl px-8 py-4 
        transition-transform duration-100 ease-in-out
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:-translate-y-1 hover:translate-x-1
        active:translate-y-1 active:-translate-x-0
        ${className}
      `}
    >
      {/* Shadow Block */}
      <span className="absolute inset-0 w-full h-full bg-black translate-y-2 translate-x-2 group-hover:translate-y-3 group-hover:translate-x-3 transition-transform border-2 border-black"></span>
      
      {/* Main Block */}
      <span className="relative block w-full h-full bg-white border-4 border-black text-black p-4 hover:bg-yellow-300 transition-colors">
        {label}
      </span>
    </button>
  );
};
