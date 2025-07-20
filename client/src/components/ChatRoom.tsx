import React, { useState, useEffect, useRef } from 'react';
import { GameState, Message } from '../App';

interface ChatRoomProps {
  gameState: GameState;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onStartVoting: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ 
  gameState, 
  messages, 
  onSendMessage, 
  onStartVoting 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [chatTimer, setChatTimer] = useState(120); // 2 minutes
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Chat timer
  useEffect(() => {
    const timer = setInterval(() => {
      setChatTimer((prev) => {
        if (prev <= 1) {
          onStartVoting();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onStartVoting]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatMessageTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-room">
      <div className="chat-header">
        <h1>Group Chat</h1>
        <div className="game-info">
          <p>Time remaining: <strong>{formatTime(chatTimer)}</strong></p>
          <p>Try to blend in! The AIs are watching...</p>
        </div>
        <button 
          className="btn-secondary"
          onClick={onStartVoting}
          style={{ marginTop: '10px' }}
        >
          End Chat & Vote
        </button>
      </div>

      <div className="chat-container">
        <div className="messages-container">
          {messages.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              color: '#666', 
              padding: '2rem',
              fontStyle: 'italic'
            }}>
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.isAI ? 'ai' : 'human'}`}
              >
                <div className="message-header">
                  <span className="message-sender">{message.senderName}</span>
                  <span className="message-time">
                    {formatMessageTime(message.timestamp)}
                  </span>
                </div>
                <div className="message-content">{message.content}</div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="message-input-container">
          <form className="message-input-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="message-input"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message... remember to act like an AI!"
              maxLength={500}
              disabled={chatTimer <= 0}
            />
            <button 
              type="submit" 
              className="send-button"
              disabled={!newMessage.trim() || chatTimer <= 0}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;