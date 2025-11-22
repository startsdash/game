
import React, { useState, useCallback } from 'react';
import { GameScenario, GameResult, ScenarioOption } from './types';
import { createScenario, resolveRound } from './services/geminiService';
import { initAudio, playProjectorSound, playPaperSound } from './services/soundService'; // Import Sound Service
import { Button } from './components/Button';
import { ResultCard } from './components/ResultCard';
import { ScenarioCard } from './components/ScenarioCard';
import { Loader } from './components/Loader';

type GameState = 'idle' | 'loading_scenario' | 'scenario_active' | 'loading_result' | 'result_active';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [scenario, setScenario] = useState<GameScenario | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [likedQuotes, setLikedQuotes] = useState<string[]>([]);

  // Step 1: Generate the Situation
  const handleStartGame = useCallback(async () => {
    initAudio(); // Initialize Audio Context on first user gesture
    playProjectorSound(); // Play mechanical sound

    setGameState('loading_scenario');
    setError(null);
    setScenario(null);
    setResult(null);
    
    try {
      const newScenario = await createScenario();
      setScenario(newScenario);
      setGameState('scenario_active');
      playPaperSound(); // Play paper/shuffle sound when scenario appears
    } catch (err) {
      console.error(err);
      setError("Сценарист ушел в запой. Попробуйте снова.");
      setGameState('idle');
    }
  }, []);

  // Step 2: User picks an option -> Generate Quote & Image
  const handleOptionSelect = useCallback(async (option: ScenarioOption) => {
    if (!scenario) return;
    
    // Sound handled in ScenarioCard component for immediate feedback
    setGameState('loading_result');
    playProjectorSound();
    
    try {
      // Pass likedQuotes history to the AI
      const gameResult = await resolveRound(scenario.context, option.text, likedQuotes);
      setResult(gameResult);
      setGameState('result_active');
    } catch (err) {
      console.error(err);
      setError("Режиссер разбил камеру. Попробуйте снова.");
      setGameState('scenario_active');
    }
  }, [scenario, likedQuotes]);

  // Handle Like logic
  const handleLike = useCallback((quote: string) => {
    if (!likedQuotes.includes(quote)) {
      setLikedQuotes(prev => [...prev, quote]);
    }
  }, [likedQuotes]);

  // Reset
  const handleReset = () => {
    playPaperSound();
    setGameState('idle');
    setScenario(null);
    setResult(null);
    setError(null);
    setLikedQuotes([]);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-12 px-4 md:px-8 overflow-x-hidden">
      
      {/* Header Section */}
      <header className="text-center mb-8 relative z-10">
        <div onClick={handleReset} className="cursor-pointer hover:scale-105 transition-transform">
            <div className="bg-black text-white px-6 py-2 inline-block transform -rotate-2 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] border-2 border-white mb-4">
            <h2 className="font-mono text-sm md:text-base uppercase tracking-widest">
                Департамент Абсурда Представляет
            </h2>
            </div>
            <h1 className="font-anton text-5xl md:text-8xl lg:text-9xl uppercase leading-none text-black drop-shadow-[4px_4px_0px_#fff]">
            СЦЕНА <span className="text-red-600">ВЫРЕЗАНА</span>
            </h1>
        </div>
        
        {gameState === 'idle' && (
            <p className="mt-4 font-marker text-xl md:text-2xl rotate-1 max-w-md mx-auto bg-white/80 p-2 border-2 border-black border-dashed">
            Интерактивная игра на выживание в артхаусе.
            </p>
        )}
      </header>

      {/* Main Interaction Area */}
      <main className="w-full max-w-4xl flex flex-col items-center gap-8 mb-20">
        
        {/* IDLE STATE: Start Button */}
        {gameState === 'idle' && (
          <div className="z-20 mt-8 animate-[bounce_3s_infinite]">
             <Button 
               onClick={handleStartGame} 
               label="НАЧАТЬ СЪЕМКУ" 
               className="scale-110"
             />
          </div>
        )}

        {/* LOADING STATES */}
        {(gameState === 'loading_scenario' || gameState === 'loading_result') && (
           <Loader text={gameState === 'loading_scenario' ? "ПИШЕМ СЦЕНАРИЙ..." : "СНИМАЕМ СЦЕНУ & ПРОЯВЛЯЕМ..."} />
        )}

        {/* SCENARIO STATE: Choices */}
        {gameState === 'scenario_active' && scenario && (
           <ScenarioCard 
             scenario={scenario} 
             onOptionSelect={handleOptionSelect}
           />
        )}

        {/* RESULT STATE: Quote */}
        {gameState === 'result_active' && result && (
           <div className="flex flex-col items-center gap-8 w-full">
              <ResultCard 
                data={result} 
                onLike={() => handleLike(result.quote)}
              />
              <Button 
                onClick={handleStartGame} 
                label="СЛЕДУЮЩИЙ ДУБЛЬ" 
                className="mt-4"
              />
           </div>
        )}

        {/* ERROR DISPLAY */}
        {error && (
            <div className="bg-red-600 text-white p-6 border-4 border-black transform -rotate-1 shadow-[8px_8px_0px_0px_#000] mt-8">
              <h3 className="font-anton text-3xl">СНЯТО! (ОШИБКА)</h3>
              <p className="font-mono">{error}</p>
              <button onClick={handleReset} className="mt-4 underline font-bebas tracking-wider">ВЕРНУТЬСЯ В НАЧАЛО</button>
            </div>
        )}

      </main>

      {/* Footer / Credits */}
      <footer className="fixed bottom-0 w-full bg-black text-white py-2 px-4 text-center font-mono text-xs uppercase z-50 border-t-4 border-red-600">
        <p>Вдохновлено Тарантино, Ричи, Родригесом, Джармушем, Коэнами, Макдоной, Балабановым, Качановым | Powered by Gemini</p>
      </footer>

    </div>
  );
};

export default App;
