import React, { useState, useEffect } from 'react';
import type { GameSetup as GameSetupType } from '../types/game';
import { MIN_BOSS_HEALTH, MAX_BOSS_HEALTH } from '../types/game';
import { useGame, useLastSetup } from '../hooks/useGame';
import { validatePlayerName } from '../utils/gameUtils';
import './GameSetup.css';

export function GameSetup() {
  const { setupGame } = useGame();
  const lastSetup = useLastSetup();
  
  const [playerCount, setPlayerCount] = useState<2 | 3 | 4>(lastSetup?.playerCount || 2);
  const [playerNames, setPlayerNames] = useState<string[]>(
    lastSetup?.playerNames || ['', '', '', '']
  );
  const [startingBossHealth, setStartingBossHealth] = useState(
    lastSetup?.startingBossHealth || 20
  );
  const [randomizeInitiative, setRandomizeInitiative] = useState(
    lastSetup?.randomizeInitiative ?? true
  );
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    // Initialize with last setup if available
    if (lastSetup) {
      setPlayerCount(lastSetup.playerCount);
      setPlayerNames(lastSetup.playerNames);
      setStartingBossHealth(lastSetup.startingBossHealth);
      setRandomizeInitiative(lastSetup.randomizeInitiative);
    }
  }, [lastSetup]);

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...playerNames];
    newNames[index] = value.slice(0, 10); // Enforce 10 character limit
    setPlayerNames(newNames);
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];
    
    for (let i = 0; i < playerCount; i++) {
      if (!validatePlayerName(playerNames[i])) {
        newErrors.push(`Player ${i + 1} name is required`);
      }
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const setup: GameSetupType = {
      playerCount,
      playerNames: playerNames.slice(0, playerCount),
      startingBossHealth,
      randomizeInitiative,
    };
    
    setupGame(setup);
  };

  return (
    <div className="game-setup">
      <h1>RetroVerse Life Counter</h1>
      <form onSubmit={handleSubmit} className="setup-form">
        <div className="form-group">
          <label>Number of Players</label>
          <div className="player-count-buttons">
            {[2, 3, 4].map(count => (
              <button
                key={count}
                type="button"
                className={`count-button ${playerCount === count ? 'active' : ''}`}
                onClick={() => setPlayerCount(count as 2 | 3 | 4)}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Player Names</label>
          {Array.from({ length: playerCount }).map((_, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Player ${index + 1}`}
              value={playerNames[index]}
              onChange={(e) => handleNameChange(index, e.target.value)}
              maxLength={10}
              className="player-name-input"
            />
          ))}
        </div>

        <div className="form-group">
          <label>Starting Boss Health</label>
          <div className="health-selector">
            <button
              type="button"
              onClick={() => setStartingBossHealth(Math.max(MIN_BOSS_HEALTH, startingBossHealth - 1))}
              className="adjust-button"
            >
              -
            </button>
            <span className="health-value">{startingBossHealth}</span>
            <button
              type="button"
              onClick={() => setStartingBossHealth(Math.min(MAX_BOSS_HEALTH, startingBossHealth + 1))}
              className="adjust-button"
            >
              +
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={randomizeInitiative}
              onChange={(e) => setRandomizeInitiative(e.target.checked)}
            />
            <span>Randomize Starting Player</span>
          </label>
        </div>

        {errors.length > 0 && (
          <div className="errors">
            {errors.map((error, index) => (
              <p key={index} className="error">{error}</p>
            ))}
          </div>
        )}

        <button type="submit" className="start-button">
          Start Game
        </button>
      </form>
    </div>
  );
}