
import React from 'react';
import { GameScenario, ScenarioOption } from '../types';
import { playClickSound } from '../services/soundService';

interface ScenarioCardProps {
  scenario: GameScenario;
  onOptionSelect: (option: ScenarioOption) => void;
  disabled?: boolean;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onOptionSelect, disabled }) => {
  
  const handleSelect = (option: ScenarioOption) => {
    playClickSound();
    onOptionSelect(option);
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-[fadeIn_0.5s_ease-out]">
      
      {/* Scene Context Card */}
      <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 mb-8 relative">
        <div className="absolute -top-5 -left-4 bg-black text-white px-4 py-1 font-bebas text-xl tracking-widest transform -rotate-2">
          СЦЕНА 1
        </div>
        <p className="font-marker text-2xl md:text-3xl leading-tight text-black">
          {scenario.context}
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid gap-4">
        {scenario.options.map((option, index) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option)}
            disabled={disabled}
            className={`
              group relative w-full text-left transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <div className={`
              absolute inset-0 bg-black translate-y-2 translate-x-2 
              group-hover:translate-y-3 group-hover:translate-x-3 transition-transform
            `}></div>
            
            <div className={`
              relative border-4 border-black bg-yellow-400 p-4 md:p-5
              group-hover:bg-yellow-300 group-active:translate-y-1 group-active:translate-x-1
              flex items-center gap-4
            `}>
              <span className="font-anton text-4xl text-black/20 group-hover:text-black/40 transition-colors">
                {index + 1}
              </span>
              <span className="font-bebas text-xl md:text-2xl text-black uppercase tracking-wide leading-none pt-1">
                {option.text}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
