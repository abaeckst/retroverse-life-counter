import type { Player, PlayerId, HealthStatus } from '../types/game';

export function getHealthStatus(current: number, max: number): HealthStatus {
  const percentage = (current / max) * 100;
  
  if (percentage >= 75) return 'healthy';
  if (percentage >= 50) return 'warning';
  if (percentage >= 25) return 'danger';
  return 'critical';
}

export function getHealthColor(status: HealthStatus): string {
  switch (status) {
    case 'healthy': return '#00FF00';
    case 'warning': return '#FFFF00';
    case 'danger': return '#FFA500';
    case 'critical': return '#FF0000';
  }
}

export function getNextPlayerId(
  currentId: PlayerId, 
  players: Player[]
): PlayerId {
  const activePlayers = players.filter(p => !p.isEliminated);
  if (activePlayers.length === 0) return currentId;
  
  const currentIndex = activePlayers.findIndex(p => p.id === currentId);
  const nextIndex = (currentIndex + 1) % activePlayers.length;
  return activePlayers[nextIndex].id;
}

export function isGameOver(players: Player[]): boolean {
  const activePlayers = players.filter(p => !p.isEliminated);
  return activePlayers.length <= 1;
}

export function getWinner(players: Player[]): Player | null {
  const activePlayers = players.filter(p => !p.isEliminated);
  return activePlayers.length === 1 ? activePlayers[0] : null;
}

export function generateGameId(): string {
  return `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function validatePlayerName(name: string): boolean {
  return name.length > 0 && name.length <= 10;
}