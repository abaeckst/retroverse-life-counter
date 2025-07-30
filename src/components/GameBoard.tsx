import { useGame } from '../hooks/useGame';
import { PlayerCard } from './PlayerCard';
import './GameBoard.css';

export function GameBoard() {
  const { state, advanceLevel, resetGame } = useGame();
  const { players, currentLevel, activePlayerId } = state;

  const handleLevelAdvance = () => {
    if (window.confirm(`Advance to Level ${currentLevel + 1}? This will reset all tokens.`)) {
      advanceLevel();
    }
  };

  const handleNewGame = () => {
    if (window.confirm('Start a new game? Current progress will be lost.')) {
      resetGame();
    }
  };

  const getGridClass = () => {
    switch (players.length) {
      case 2: return 'two-players';
      case 3: return 'three-players';
      case 4: return 'four-players';
      default: return 'two-players';
    }
  };

  return (
    <div className="game-board">
      <div className="game-header">
        <div className="level-display">
          <span className="level-label">LEVEL</span>
          <span className="level-number">{currentLevel}</span>
        </div>
        <div className="game-controls">
          <button className="level-button" onClick={handleLevelAdvance}>
            ADVANCE LEVEL
          </button>
          <button className="new-game-button" onClick={handleNewGame}>
            NEW GAME
          </button>
        </div>
      </div>

      <div className={`players-grid ${getGridClass()}`}>
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            isActive={player.id === activePlayerId}
          />
        ))}
      </div>
    </div>
  );
}