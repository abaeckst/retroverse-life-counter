import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { GameProvider } from './GameContext';
import { useGame } from '../hooks/useGame';
import type { GameSetup } from '../types/game';

describe('GameContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <GameProvider>{children}</GameProvider>
  );

  it('should start with initial state', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    
    expect(result.current.state.isSetupComplete).toBe(false);
    expect(result.current.state.players).toHaveLength(0);
    expect(result.current.state.currentLevel).toBe(1);
  });

  it('should setup game correctly', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    
    const setup: GameSetup = {
      playerCount: 2,
      playerNames: ['Alice', 'Bob'],
      startingBossHealth: 20,
      randomizeInitiative: false,
    };

    act(() => {
      result.current.setupGame(setup);
    });

    expect(result.current.state.isSetupComplete).toBe(true);
    expect(result.current.state.players).toHaveLength(2);
    expect(result.current.state.players[0].name).toBe('Alice');
    expect(result.current.state.players[1].name).toBe('Bob');
    expect(result.current.state.players[0].bossHealth).toBe(20);
    expect(result.current.state.players[0].tokens).toBe(1);
  });

  it('should adjust health correctly', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    
    // Setup game first
    act(() => {
      result.current.setupGame({
        playerCount: 2,
        playerNames: ['Alice', 'Bob'],
        startingBossHealth: 20,
        randomizeInitiative: false,
      });
    });

    // Decrease health
    act(() => {
      result.current.adjustHealth(1, -5);
    });

    expect(result.current.state.players[0].bossHealth).toBe(15);
    expect(result.current.state.players[0].isEliminated).toBe(false);

    // Reduce to 0
    act(() => {
      result.current.adjustHealth(1, -15);
    });

    expect(result.current.state.players[0].bossHealth).toBe(0);
    expect(result.current.state.players[0].isEliminated).toBe(true);

    // Restore player
    act(() => {
      result.current.adjustHealth(1, 5);
    });

    expect(result.current.state.players[0].bossHealth).toBe(5);
    expect(result.current.state.players[0].isEliminated).toBe(false);
  });

  it('should adjust tokens correctly', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    
    act(() => {
      result.current.setupGame({
        playerCount: 2,
        playerNames: ['Alice', 'Bob'],
        startingBossHealth: 20,
        randomizeInitiative: false,
      });
    });

    act(() => {
      result.current.adjustTokens(1, 3);
    });

    expect(result.current.state.players[0].tokens).toBe(4);

    // Cannot go below 0
    act(() => {
      result.current.adjustTokens(1, -10);
    });

    expect(result.current.state.players[0].tokens).toBe(0);
  });

  it('should advance level and reset tokens', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    
    act(() => {
      result.current.setupGame({
        playerCount: 2,
        playerNames: ['Alice', 'Bob'],
        startingBossHealth: 20,
        randomizeInitiative: false,
      });
    });

    act(() => {
      result.current.advanceLevel();
    });

    expect(result.current.state.currentLevel).toBe(2);
    expect(result.current.state.players[0].tokens).toBe(2);
    expect(result.current.state.players[1].tokens).toBe(2);
  });

  it('should pass priority to next active player', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    
    act(() => {
      result.current.setupGame({
        playerCount: 3,
        playerNames: ['Alice', 'Bob', 'Charlie'],
        startingBossHealth: 20,
        randomizeInitiative: false,
      });
    });

    expect(result.current.state.activePlayerId).toBe(1);

    act(() => {
      result.current.passPriority();
    });

    expect(result.current.state.activePlayerId).toBe(2);

    // Eliminate player 3
    act(() => {
      result.current.adjustHealth(3, -20);
    });

    // Priority should skip eliminated player
    act(() => {
      result.current.passPriority();
    });

    expect(result.current.state.activePlayerId).toBe(1);
  });

  it('should reset game correctly', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    
    act(() => {
      result.current.setupGame({
        playerCount: 2,
        playerNames: ['Alice', 'Bob'],
        startingBossHealth: 20,
        randomizeInitiative: false,
      });
    });

    act(() => {
      result.current.resetGame();
    });

    expect(result.current.state.isSetupComplete).toBe(false);
    expect(result.current.state.players).toHaveLength(0);
  });
});