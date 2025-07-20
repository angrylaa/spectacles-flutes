import React, { useState } from 'react';

interface StartScreenProps {
  onCreateGame: (bio: string) => void;
  loading: boolean;
}

const StartScreen: React.FC<StartScreenProps> = ({ onCreateGame, loading }) => {
  const [bio, setBio] = useState('');
  const maxLength = 200;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bio.trim() && bio.length <= maxLength && !loading) {
      onCreateGame(bio.trim());
    }
  };

  return (
    <div className="start-screen">
      <h1>AI vs Human</h1>
      <p>
        Welcome to the ultimate deception game! You'll be placed in a group chat with 3 AI players. 
        Your mission: blend in and convince the AIs that you're one of them. 
        The AIs will try to identify you as the human. Can you fool them?
      </p>

      <form className="bio-form" onSubmit={handleSubmit}>
        <h2>Create Your Profile</h2>
        <textarea
          className="bio-input"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Write a brief bio about yourself... be creative! This will be shown to other players."
          maxLength={maxLength}
          disabled={loading}
        />
        <div className="char-count">
          {bio.length}/{maxLength} characters
        </div>
        
        <button 
          type="submit" 
          className="btn-primary"
          disabled={!bio.trim() || bio.length > maxLength || loading}
        >
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              Creating Game...
            </div>
          ) : (
            'Start Game'
          )}
        </button>
      </form>
    </div>
  );
};

export default StartScreen;