import { describe, it, expect } from 'vitest';
import { 
  getHealthStatus, 
  getHealthColor, 
  getNextPlayerId, 
  isGameOver, 
  getWinner,
  validatePlayerName 
} from './gameUtils';
import type { Player } from '../types/game';

describe('gameUtils', () => {
  describe('getHealthStatus', () => {
    it('should return healthy for 75-100%', () => {
      expect(getHealthStatus(20, 20)).toBe('healthy');
      expect(getHealthStatus(15, 20)).toBe('healthy');
    });

    it('should return warning for 50-74%', () => {
      expect(getHealthStatus(14, 20)).toBe('warning');
      expect(getHealthStatus(10, 20)).toBe('warning');
    });

    it('should return danger for 25-49%', () => {
      expect(getHealthStatus(9, 20)).toBe('danger');
      expect(getHealthStatus(5, 20)).toBe('danger');
    });

    it('should return critical for 0-24%', () => {
      expect(getHealthStatus(4, 20)).toBe('critical');
      expect(getHealthStatus(0, 20)).toBe('critical');
    });
  });

  describe('getHealthColor', () => {
    it('should return correct colors for each status', () => {
      expect(getHealthColor('healthy')).toBe('#00FF00');
      expect(getHealthColor('warning')).toBe('#FFFF00');
      expect(getHealthColor('danger')).toBe('#FFA500');
      expect(getHealthColor('critical')).toBe('#FF0000');
    });
  });

  describe('getNextPlayerId', () => {
    const testPlayers: Player[] = [
      { id: 1, name: 'Player 1', bossHealth: 20, tokens: 1, isEliminated: false, color: '#00FFFF' },
      { id: 2, name: 'Player 2', bossHealth: 20, tokens: 1, isEliminated: false, color: '#FF00FF' },
      { id: 3, name: 'Player 3', bossHealth: 0, tokens: 0, isEliminated: true, color: '#00FF00' },
      { id: 4, name: 'Player 4', bossHealth: 20, tokens: 1, isEliminated: false, color: '#FFFF00' },
    ];

    it('should skip eliminated players', () => {
      expect(getNextPlayerId(2, testPlayers)).toBe(4);
      expect(getNextPlayerId(4, testPlayers)).toBe(1);
    });

    it('should wrap around to first player', () => {
      expect(getNextPlayerId(4, testPlayers)).toBe(1);
    });

    it('should return current id if all players eliminated', () => {
      const allEliminated = testPlayers.map(p => ({ ...p, isEliminated: true }));
      expect(getNextPlayerId(1, allEliminated)).toBe(1);
    });
  });

  describe('isGameOver', () => {
    it('should return true when only one player remains', () => {
      const players: Player[] = [
        { id: 1, name: 'Player 1', bossHealth: 20, tokens: 1, isEliminated: false, color: '#00FFFF' },
        { id: 2, name: 'Player 2', bossHealth: 0, tokens: 0, isEliminated: true, color: '#FF00FF' },
      ];
      expect(isGameOver(players)).toBe(true);
    });

    it('should return false when multiple players remain', () => {
      const players: Player[] = [
        { id: 1, name: 'Player 1', bossHealth: 20, tokens: 1, isEliminated: false, color: '#00FFFF' },
        { id: 2, name: 'Player 2', bossHealth: 10, tokens: 1, isEliminated: false, color: '#FF00FF' },
      ];
      expect(isGameOver(players)).toBe(false);
    });
  });

  describe('getWinner', () => {
    it('should return the last remaining player', () => {
      const players: Player[] = [
        { id: 1, name: 'Winner', bossHealth: 20, tokens: 1, isEliminated: false, color: '#00FFFF' },
        { id: 2, name: 'Loser', bossHealth: 0, tokens: 0, isEliminated: true, color: '#FF00FF' },
      ];
      const winner = getWinner(players);
      expect(winner?.name).toBe('Winner');
    });

    it('should return null if game not over', () => {
      const players: Player[] = [
        { id: 1, name: 'Player 1', bossHealth: 20, tokens: 1, isEliminated: false, color: '#00FFFF' },
        { id: 2, name: 'Player 2', bossHealth: 10, tokens: 1, isEliminated: false, color: '#FF00FF' },
      ];
      expect(getWinner(players)).toBe(null);
    });
  });

  describe('validatePlayerName', () => {
    it('should accept valid names', () => {
      expect(validatePlayerName('Player')).toBe(true);
      expect(validatePlayerName('P')).toBe(true);
      expect(validatePlayerName('Player1234')).toBe(true);
    });

    it('should reject empty names', () => {
      expect(validatePlayerName('')).toBe(false);
    });

    it('should reject names over 10 characters', () => {
      expect(validatePlayerName('Player12345')).toBe(false);
    });
  });
});