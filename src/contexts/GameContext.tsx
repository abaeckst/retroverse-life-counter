import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import type { 
  GameState, 
  GameSetup, 
  Player, 
  PlayerId, 
  GameAction 
} from '../types/game';
import { PLAYER_COLORS, STARTING_LEVEL } from '../types/game';
import { generateGameId, getNextPlayerId } from '../utils/gameUtils';

interface GameContextType {
  state: GameState;
  setupGame: (setup: GameSetup) => void;
  adjustHealth: (playerId: PlayerId, amount: number) => void;
  adjustTokens: (playerId: PlayerId, amount: number) => void;
  advanceLevel: () => void;
  passPriority: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'retroverse-game-state';
const SETUP_KEY = 'retroverse-last-setup';

const initialState: GameState = {
  players: [],
  currentLevel: STARTING_LEVEL,
  activePlayerId: 1,
  initiativePlayerId: 1,
  isSetupComplete: false,
  gameId: generateGameId(),
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SETUP_GAME': {
      const { playerCount, playerNames, startingBossHealth, startingPlayerId } = action.payload;
      const players: Player[] = [];
      
      for (let i = 1; i <= playerCount; i++) {
        players.push({
          id: i as PlayerId,
          name: playerNames[i - 1] || `Player ${i}`,
          bossHealth: startingBossHealth,
          tokens: STARTING_LEVEL,
          isEliminated: false,
          color: PLAYER_COLORS[i as PlayerId],
        });
      }

      const initiativeId = startingPlayerId || 1;
      
      return {
        ...state,
        players,
        activePlayerId: initiativeId,
        initiativePlayerId: initiativeId,
        isSetupComplete: true,
        currentLevel: STARTING_LEVEL,
        gameId: generateGameId(),
      };
    }

    case 'ADJUST_HEALTH': {
      const { playerId, amount } = action.payload;
      return {
        ...state,
        players: state.players.map(player => {
          if (player.id !== playerId) return player;
          
          const newHealth = Math.max(0, player.bossHealth + amount);
          const wasEliminated = player.isEliminated;
          const isEliminated = newHealth === 0;
          
          // If player was eliminated and now has health > 0, restore them
          if (wasEliminated && newHealth > 0) {
            return { ...player, bossHealth: newHealth, isEliminated: false };
          }
          
          return { ...player, bossHealth: newHealth, isEliminated };
        }),
      };
    }

    case 'ADJUST_TOKENS': {
      const { playerId, amount } = action.payload;
      return {
        ...state,
        players: state.players.map(player =>
          player.id === playerId
            ? { ...player, tokens: Math.max(0, player.tokens + amount) }
            : player
        ),
      };
    }

    case 'ADVANCE_LEVEL': {
      const newLevel = state.currentLevel + 1;
      const newInitiativeId = getNextPlayerId(state.initiativePlayerId, state.players);
      
      return {
        ...state,
        currentLevel: newLevel,
        players: state.players.map(player => ({
          ...player,
          tokens: player.isEliminated ? 0 : newLevel,
        })),
        initiativePlayerId: newInitiativeId,
        activePlayerId: newInitiativeId,
      };
    }

    case 'PASS_PRIORITY': {
      const nextPlayerId = getNextPlayerId(state.activePlayerId, state.players);
      return {
        ...state,
        activePlayerId: nextPlayerId,
      };
    }

    case 'RESET_GAME': {
      return initialState;
    }

    default:
      return state;
  }
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState, (initial) => {
    // Load saved state from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initial;
      }
    }
    return initial;
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (state.isSetupComplete) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const setupGame = useCallback((setup: GameSetup) => {
    dispatch({ type: 'SETUP_GAME', payload: setup });
    // Save setup for quick restart
    localStorage.setItem(SETUP_KEY, JSON.stringify(setup));
  }, []);

  const adjustHealth = useCallback((playerId: PlayerId, amount: number) => {
    dispatch({ type: 'ADJUST_HEALTH', payload: { playerId, amount } });
  }, []);

  const adjustTokens = useCallback((playerId: PlayerId, amount: number) => {
    dispatch({ type: 'ADJUST_TOKENS', payload: { playerId, amount } });
  }, []);

  const advanceLevel = useCallback(() => {
    dispatch({ type: 'ADVANCE_LEVEL' });
  }, []);

  const passPriority = useCallback(() => {
    dispatch({ type: 'PASS_PRIORITY' });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value: GameContextType = {
    state,
    setupGame,
    adjustHealth,
    adjustTokens,
    advanceLevel,
    passPriority,
    resetGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export { GameContext };