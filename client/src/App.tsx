import React, { useState, useEffect } from 'react';
import './App.css';
import StartScreen from './components/StartScreen';
import GameLobby from './components/GameLobby';
import ChatRoom from './components/ChatRoom';
import VotingScreen from './components/VotingScreen';
import ResultsScreen from './components/ResultsScreen';

export interface Player {
  id: string;
  name: string;
  bio: string;
  isAI: boolean;
}

export interface GameState {
  id: string;
  players: Player[];
  humanPlayerId: string;
  gamePhase: 'chat' | 'voting' | 'results';
  chatStarted: boolean;
  gameEnded: boolean;
  votes?: Map<string, string>;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isAI: boolean;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'start' | 'lobby' | 'chat' | 'voting' | 'results'>('start');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create new game
  const createGame = async (humanBio: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ humanBio }),
      });

      if (!response.ok) {
        throw new Error('Failed to create game');
      }

      const data = await response.json();
      setGameState({
        id: data.gameId,
        players: data.players,
        humanPlayerId: data.humanPlayerId,
        gamePhase: 'chat',
        chatStarted: false,
        gameEnded: false
      });
      setCurrentScreen('lobby');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Start chat
  const startChat = async () => {
    if (!gameState) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/games/${gameState.id}/start-chat`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to start chat');
      }

      setGameState(prev => prev ? { ...prev, chatStarted: true } : null);
      setCurrentScreen('chat');
      
      // Start polling for messages
      startMessagePolling();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start chat');
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async (content: string) => {
    if (!gameState) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/games/${gameState.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: gameState.humanPlayerId,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Message will be added via polling
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  // Start voting phase
  const startVoting = () => {
    if (!gameState) return;
    setGameState(prev => prev ? { ...prev, gamePhase: 'voting' } : null);
    setCurrentScreen('voting');
  };

  // Poll for messages
  const startMessagePolling = () => {
    const pollInterval = setInterval(async () => {
      if (!gameState) {
        clearInterval(pollInterval);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/games/${gameState.id}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
          
          // Check if game ended
          if (data.gameEnded && currentScreen !== 'results') {
            setGameState(data);
            setCurrentScreen('results');
            clearInterval(pollInterval);
          }
        }
      } catch (err) {
        console.error('Error polling messages:', err);
      }
    }, 1000); // Poll every second

    // Clean up interval after 10 minutes
    setTimeout(() => clearInterval(pollInterval), 600000);
  };

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="App">
      {error && (
        <div className="error-toast">
          {error}
        </div>
      )}

      {currentScreen === 'start' && (
        <StartScreen 
          onCreateGame={createGame} 
          loading={loading} 
        />
      )}

      {currentScreen === 'lobby' && gameState && (
        <GameLobby 
          gameState={gameState}
          onStartChat={startChat}
          loading={loading}
        />
      )}

      {currentScreen === 'chat' && gameState && (
        <ChatRoom 
          gameState={gameState}
          messages={messages}
          onSendMessage={sendMessage}
          onStartVoting={startVoting}
        />
      )}

      {currentScreen === 'voting' && gameState && (
        <VotingScreen 
          gameState={gameState}
          onVoteComplete={() => setCurrentScreen('results')}
        />
      )}

      {currentScreen === 'results' && gameState && (
        <ResultsScreen 
          gameState={gameState}
          onPlayAgain={() => {
            setGameState(null);
            setMessages([]);
            setCurrentScreen('start');
          }}
        />
      )}
    </div>
  );
}

export default App;
