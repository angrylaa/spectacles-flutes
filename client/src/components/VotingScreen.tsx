import React, { useState } from 'react';
import { GameState } from '../App';

interface VotingScreenProps {
  gameState: GameState;
  onVoteComplete: () => void;
}

const VotingScreen: React.FC<VotingScreenProps> = ({ gameState, onVoteComplete }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Get other players (exclude human)
  const otherPlayers = gameState.players.filter(p => p.id !== gameState.humanPlayerId);

  const handleVote = () => {
    if (selectedPlayer && !hasVoted) {
      setHasVoted(true);
      // Simulate AI voting process
      setTimeout(() => {
        onVoteComplete();
      }, 2000);
    }
  };

  return (
    <div className="voting-screen">
      <div className="voting-content">
        <h1>Voting Time!</h1>
        <p>
          The chat is over. Now it's time to vote! 
          {hasVoted ? ' The AIs are making their decisions...' : ' Who do you think is the most suspicious AI?'}
        </p>

        {!hasVoted ? (
          <>
            <div className="voting-players">
              {otherPlayers.map((player) => (
                <div
                  key={player.id}
                  className={`voting-player-card ${selectedPlayer === player.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPlayer(player.id)}
                >
                  <h3>{player.name}</h3>
                  <p>{player.bio}</p>
                </div>
              ))}
            </div>

            <button
              className="btn-primary"
              onClick={handleVote}
              disabled={!selectedPlayer}
              style={{ marginTop: '2rem' }}
            >
              Vote for Most Suspicious
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading">
              <div className="spinner"></div>
              <p style={{ marginLeft: '1rem' }}>
                AIs are analyzing the conversation and making their votes...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotingScreen;