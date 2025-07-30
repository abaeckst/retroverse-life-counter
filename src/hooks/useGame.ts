import { useContext } from 'react';
import type { GameSetup } from '../types/game';
import { GameContext } from '../contexts/GameContext';

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export function useLastSetup(): GameSetup | null {
  const saved = localStorage.getItem('retroverse-last-setup');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
}