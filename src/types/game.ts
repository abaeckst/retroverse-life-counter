export type PlayerId = 1 | 2 | 3 | 4;

export type PlayerColor = '#00FFFF' | '#FF00FF' | '#00FF00' | '#FFFF00';

export interface Player {
  id: PlayerId;
  name: string;
  bossHealth: number;
  tokens: number;
  isEliminated: boolean;
  color: PlayerColor;
}

export interface GameSetup {
  playerCount: 2 | 3 | 4;
  playerNames: string[];
  startingBossHealth: number;
  startingPlayerId?: PlayerId;
  randomizeInitiative: boolean;
}

export interface GameState {
  players: Player[];
  currentLevel: number;
  activePlayerId: PlayerId;
  initiativePlayerId: PlayerId;
  isSetupComplete: boolean;
  gameId: string;
}

export type HealthStatus = 'healthy' | 'warning' | 'danger' | 'critical';

export type GameAction = 
  | { type: 'ADJUST_HEALTH'; payload: { playerId: PlayerId; amount: number } }
  | { type: 'ADJUST_TOKENS'; payload: { playerId: PlayerId; amount: number } }
  | { type: 'ADVANCE_LEVEL' }
  | { type: 'PASS_PRIORITY' }
  | { type: 'SETUP_GAME'; payload: GameSetup }
  | { type: 'RESET_GAME' }
  | { type: 'SET_INITIATIVE'; payload: { playerId: PlayerId } }
  | { type: 'RESTORE_PLAYER'; payload: { playerId: PlayerId } };

export const PLAYER_COLORS: Record<PlayerId, PlayerColor> = {
  1: '#00FFFF', // Cyan
  2: '#FF00FF', // Magenta
  3: '#00FF00', // Green
  4: '#FFFF00', // Yellow
};

export const MIN_BOSS_HEALTH = 13;
export const MAX_BOSS_HEALTH = 20;
export const MIN_TOKENS = 0;
export const STARTING_LEVEL = 1;