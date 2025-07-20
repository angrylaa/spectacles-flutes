import React from 'react';
import { GameState } from '../App';

interface GameLobbyProps {
  gameState: GameState;
  onStartChat: () => void;
  loading: boolean;
}

const GameLobby: React.FC<GameLobbyProps> = ({ gameState, onStartChat, loading }) => {
  return (
    <div className="game-lobby">
      <div className="lobby-content">
        <h1>Game Ready!</h1>
        <p>Meet your fellow players. One of you is human, three are AI. Can you spot the human?</p>
        
        <div className="players-grid">
          {gameState.players.map((player) => (
            <div 
              key={player.id} 
              className={`player-card ${player.id === gameState.humanPlayerId ? 'human' : ''}`}
            >
              <h3>{player.name}</h3>
              <p>{player.bio}</p>
              {player.id === gameState.humanPlayerId && (
                <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#667eea' }}>
                  (This is you!)
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '2rem', color: '#b0b3c7' }}>
          <p><strong>Game Rules:</strong></p>
          <ul style={{ textAlign: 'left', maxWidth: '500px', margin: '1rem auto' }}>
            <li>Chat naturally with the other players</li>
            <li>Try to blend in as an AI if you're human</li>
            <li>AIs will try to identify the human player</li>
            <li>After chatting, there will be a voting phase</li>
            <li>If AIs can't identify you correctly, you win!</li>
          </ul>
        </div>

        <button 
          className="btn-primary"
          onClick={onStartChat}
          disabled={loading}
        >
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              Starting Chat...
            </div>
          ) : (
            'Start Chat'
          )}
        </button>
      </div>
    </div>
  );
};

export default GameLobby;