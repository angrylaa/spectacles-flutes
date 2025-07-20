import React, { useState, useEffect } from 'react';
import { GameState, VotingResult } from '../App';

interface VotingScreenProps {
  gameState: GameState;
  votingResults: VotingResult[];
  onVoteComplete: () => void;
}

const VotingScreen: React.FC<VotingScreenProps> = ({ gameState, votingResults, onVoteComplete }) => {
  const [currentlyAnalyzing, setCurrentlyAnalyzing] = useState<string | null>(null);
  const [showVotes, setShowVotes] = useState<VotingResult[]>([]);
  const [analysisPhase, setAnalysisPhase] = useState(true);

  const aiPlayers = gameState.players.filter(p => p.isAI);

  useEffect(() => {
    // Show AI analysis phase for each AI
    let analyzeIndex = 0;
    
    const analyzeNext = () => {
      if (analyzeIndex < aiPlayers.length) {
        setCurrentlyAnalyzing(aiPlayers[analyzeIndex].name);
        setTimeout(() => {
          analyzeIndex++;
          analyzeNext();
        }, 8000); // 8 seconds per AI analysis
      } else {
        setCurrentlyAnalyzing(null);
        setAnalysisPhase(false);
      }
    };

    // Start analysis after 2 seconds
    setTimeout(() => {
      analyzeNext();
    }, 2000);
  }, [aiPlayers.length]);

  useEffect(() => {
    // Reveal votes one by one as they come in
    if (votingResults.length > showVotes.length && !analysisPhase) {
      const timer = setTimeout(() => {
        setShowVotes(votingResults.slice(0, showVotes.length + 1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [votingResults.length, showVotes.length, analysisPhase]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#2ecc71'; // Green
    if (confidence >= 60) return '#f39c12'; // Orange
    return '#e74c3c'; // Red
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 80) return 'Very Confident';
    if (confidence >= 60) return 'Moderately Confident';
    return 'Low Confidence';
  };

  return (
    <div className="voting-screen">
      <div className="voting-content">
        <h1>🧠 AI Analysis Phase</h1>
        
        {analysisPhase ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#b0b3c7' }}>
              The AIs are now analyzing the conversation to identify the human player...
            </p>

            {currentlyAnalyzing ? (
              <div className="analysis-display">
                <div className="analyzing-ai">
                  <div className="ai-avatar" style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50%',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    fontSize: '2rem'
                  }}>
                    🤖
                  </div>
                  <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>{currentlyAnalyzing}</h2>
                  <div className="analysis-process">
                    <div className="loading">
                      <div className="spinner"></div>
                      <p style={{ marginLeft: '1rem', fontSize: '1.1rem' }}>
                        Analyzing conversation patterns, emotional indicators, and logic consistency...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="waiting-analysis">
                <p style={{ fontSize: '1.1rem', color: '#888' }}>
                  Preparing analysis algorithms...
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#b0b3c7', textAlign: 'center' }}>
              Analysis complete! Here are the AI verdicts:
            </p>

            <div className="voting-results">
              {showVotes.map((vote, index) => (
                <div key={vote.aiId} className="vote-reveal" style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  animation: 'slideInFromRight 0.5s ease-out'
                }}>
                  <div className="vote-header" style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <h3 style={{ color: '#667eea' }}>{vote.aiName}</h3>
                    <div style={{ 
                      color: getConfidenceColor(vote.confidence),
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      {vote.confidence}% - {getConfidenceText(vote.confidence)}
                    </div>
                  </div>
                  
                  <div className="vote-decision" style={{ marginBottom: '1rem' }}>
                    <p style={{ fontSize: '1.1rem' }}>
                      <strong>Suspects:</strong> <span style={{ color: '#f39c12' }}>{vote.suspectedHumanName}</span>
                    </p>
                  </div>
                  
                  <div className="vote-reasoning">
                    <p style={{ 
                      fontStyle: 'italic', 
                      lineHeight: '1.6',
                      color: '#d0d0d0'
                    }}>
                      "{vote.reasoning}"
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {showVotes.length < votingResults.length && (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div className="loading">
                  <div className="spinner"></div>
                  <p style={{ marginLeft: '1rem' }}>
                    Revealing next analysis...
                  </p>
                </div>
              </div>
            )}

            {showVotes.length === votingResults.length && votingResults.length === aiPlayers.length && (
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button 
                  className="btn-primary"
                  onClick={onVoteComplete}
                >
                  See Final Results
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VotingScreen;