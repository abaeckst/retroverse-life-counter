import React from 'react';
import type { Player } from '../types/game';
import { useGame } from '../hooks/useGame';
import { getHealthStatus, getHealthColor } from '../utils/gameUtils';
import './PlayerCard.css';

interface PlayerCardProps {
  player: Player;
  isActive: boolean;
}

export function PlayerCard({ player, isActive }: PlayerCardProps) {
  const { adjustHealth, adjustTokens, passPriority, state } = useGame();
  const healthStatus = getHealthStatus(player.bossHealth, state.players[0]?.bossHealth || 20);
  const healthColor = getHealthColor(healthStatus);

  const handleHealthChange = (amount: number) => {
    adjustHealth(player.id, amount);
  };

  const handleTokenChange = (amount: number) => {
    adjustTokens(player.id, amount);
  };

  const handlePriorityPass = () => {
    if (isActive && !player.isEliminated) {
      passPriority();
    }
  };

  const cardClass = `player-card ${isActive ? 'active' : ''} ${player.isEliminated ? 'eliminated' : ''}`;

  return (
    <div className={cardClass} style={{ '--player-color': player.color } as React.CSSProperties}>
      <div className="player-header" onClick={handlePriorityPass}>
        <div className="player-name">{player.name}</div>
        {isActive && !player.isEliminated && (
          <div className="priority-indicator">ACTIVE</div>
        )}
      </div>

      <div className="player-stats">
        {/* Boss Health Section */}
        <div className="stat-section health-section">
          <div className="stat-label">BOSS HEALTH</div>
          <div className="stat-controls">
            <button 
              className="stat-button decrease"
              onClick={() => handleHealthChange(-1)}
              disabled={player.bossHealth <= 0}
            >
              -
            </button>
            <div 
              className="stat-value health-value"
              style={{ 
                '--health-color': healthColor,
                color: player.isEliminated ? '#666' : healthColor
              } as React.CSSProperties}
            >
              {player.bossHealth}
            </div>
            <button 
              className="stat-button increase"
              onClick={() => handleHealthChange(1)}
            >
              +
            </button>
          </div>
        </div>

        {/* Tokens Section */}
        <div className="stat-section tokens-section">
          <div className="stat-label">TOKENS</div>
          <div className="stat-controls">
            <button 
              className="stat-button decrease"
              onClick={() => handleTokenChange(-1)}
              disabled={player.tokens <= 0 || player.isEliminated}
            >
              -
            </button>
            <div 
              className={`stat-value tokens-value ${player.tokens === 0 ? 'zero' : ''}`}
            >
              {player.tokens}
            </div>
            <button 
              className="stat-button increase"
              onClick={() => handleTokenChange(1)}
              disabled={player.isEliminated}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {player.isEliminated && (
        <div className="elimination-overlay">
          <div className="elimination-text">ELIMINATED</div>
        </div>
      )}
    </div>
  );
}