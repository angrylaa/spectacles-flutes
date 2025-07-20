import React, { useMemo } from 'react';
import { GameState, VotingResult } from '../App';

interface ResultsScreenProps {
  gameState: GameState;
  votingResults: VotingResult[];
  onPlayAgain: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ gameState, votingResults, onPlayAgain }) => {
  const humanPlayer = gameState.players.find(p => !p.isAI);
  
  // Calculate game results based on actual AI votes
  const gameResult = useMemo(() => {
    if (!votingResults.length) return { won: false, correctVotes: 0, totalVotes: 0 };
    
    const correctVotes = votingResults.filter(vote => 
      vote.suspectedHumanId === gameState.humanPlayerId
    ).length;
    
    const totalVotes = votingResults.length;
    
    // Human wins if majority of AIs voted for someone else
    const humanWon = correctVotes < (totalVotes / 2);
    
    return { 
      won: humanWon, 
      correctVotes, 
      totalVotes,
      detectionRate: Math.round((correctVotes / totalVotes) * 100)
    };
  }, [votingResults, gameState.humanPlayerId]);
  
  const { won: humanWon, correctVotes, totalVotes, detectionRate } = gameResult;

  const getResultMessage = () => {
    if (humanWon) {
      return {
        title: "🎉 Victory!",
        message: `Congratulations! Only ${correctVotes} out of ${totalVotes} AIs correctly identified you as human (${detectionRate}% detection rate). You successfully blended in!`,
        className: "won"
      };
    } else {
      return {
        title: "😅 Detected!",
        message: `${correctVotes} out of ${totalVotes} AIs correctly identified you as human (${detectionRate}% detection rate). The algorithms saw through your disguise!`,
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
          <h3>AI Analysis Breakdown</h3>
          <div className="voting-analysis" style={{ margin: '1rem 0' }}>
            {votingResults.map((vote, index) => (
              <div key={vote.aiId} style={{
                background: vote.suspectedHumanId === gameState.humanPlayerId 
                  ? 'rgba(231, 76, 60, 0.1)' 
                  : 'rgba(46, 204, 113, 0.1)',
                border: `1px solid ${vote.suspectedHumanId === gameState.humanPlayerId ? '#e74c3c' : '#2ecc71'}`,
                borderRadius: '10px',
                padding: '1rem',
                marginBottom: '1rem',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ color: '#667eea' }}>{vote.aiName}</h4>
                  <span style={{ 
                    color: vote.suspectedHumanId === gameState.humanPlayerId ? '#e74c3c' : '#2ecc71',
                    fontWeight: 'bold'
                  }}>
                    {vote.suspectedHumanId === gameState.humanPlayerId ? '🎯 CORRECT' : '❌ INCORRECT'}
                  </span>
                </div>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Suspected:</strong> {vote.suspectedHumanName} ({vote.confidence}% confidence)
                </p>
                <p style={{ fontStyle: 'italic', color: '#b0b3c7' }}>
                  "{vote.reasoning}"
                </p>
              </div>
            ))}
          </div>
          
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            padding: '1rem', 
            borderRadius: '10px',
            textAlign: 'left'
          }}>
            <h4>Performance Summary:</h4>
            <ul style={{ marginTop: '0.5rem' }}>
              {humanWon ? (
                <>
                  <li>✅ Your deception was successful - most AIs were fooled</li>
                  <li>✅ You maintained an AI-like communication pattern</li>
                  <li>✅ Your responses didn't trigger enough human detection algorithms</li>
                </>
              ) : (
                <>
                  <li>❌ The majority of AIs saw through your human disguise</li>
                  <li>❌ Your responses showed detectable human behavioral patterns</li>
                  <li>💡 Try being more systematic and less emotionally expressive next time</li>
                </>
              )}
            </ul>
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