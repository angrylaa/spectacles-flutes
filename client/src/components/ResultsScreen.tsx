import React from 'react';
import { GameState } from '../App';

interface ResultsScreenProps {
  gameState: GameState;
  onPlayAgain: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ gameState, onPlayAgain }) => {
  // Simulate game results (in a real implementation, this would come from the backend)
  // const aiVotes = gameState.votes || new Map();
  // const humanPlayer = gameState.players.find(p => p.id === gameState.humanPlayerId);
  // const aiPlayers = gameState.players.filter(p => p.isAI);
  
  // Simulate AI voting results - randomly determine if human was detected
  const humanDetected = Math.random() < 0.6; // 60% chance AIs detect human
  const humanWon = !humanDetected;

  const getResultMessage = () => {
    if (humanWon) {
      return {
        title: "🎉 Victory!",
        message: "Congratulations! You successfully fooled the AIs and won the game!",
        className: "won"
      };
    } else {
      return {
        title: "😅 Detected!",
        message: "The AIs identified you as the human. Better luck next time!",
        className: "lost"
      };
    }
  };

  const result = getResultMessage();

  return (
    <div className="results-screen">
      <div className="results-content">
        <div className={`game-result ${result.className}`}>
          {result.title}
        </div>
        
        <div className="results-explanation">
          {result.message}
        </div>

        <div className="player-reveal">
          {gameState.players.map((player) => (
            <div 
              key={player.id}
              className={`reveal-card ${player.isAI ? 'ai' : 'human'}`}
            >
              <h3>{player.name}</h3>
              <p><strong>{player.isAI ? '🤖 AI Player' : '👤 Human Player'}</strong></p>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {player.bio}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3>Game Analysis</h3>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            padding: '1rem', 
            borderRadius: '10px',
            margin: '1rem 0',
            textAlign: 'left'
          }}>
            {humanWon ? (
              <ul>
                <li>✅ Your responses seemed AI-like enough to fool the algorithms</li>
                <li>✅ You successfully blended in with the conversation flow</li>
                <li>✅ The AIs couldn't detect human-specific patterns in your messages</li>
              </ul>
            ) : (
              <ul>
                <li>❌ The AIs detected human-like patterns in your responses</li>
                <li>❌ Your conversation style may have seemed too emotional or personal</li>
                <li>❌ Try to be more systematic and less spontaneous next time</li>
              </ul>
            )}
          </div>
        </div>

        <button 
          className="btn-primary"
          onClick={onPlayAgain}
          style={{ marginTop: '2rem' }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;