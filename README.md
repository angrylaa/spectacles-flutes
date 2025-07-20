# AI vs Human - Group Chat Game

A web-based game where you (the human) try to fool AI players in a group chat. The AIs will try to identify you as the human player while you attempt to blend in and act like an AI.

## 🎮 How to Play

1. **Create Your Bio**: Write a brief description of yourself
2. **Join the Chat**: You'll be placed in a group chat with 3 AI players
3. **Blend In**: Chat naturally while trying to act like an AI
4. **Survive Detection**: If the AIs can't identify you as human, you win!

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ 
- Gemini AI API key from Google

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Add your Gemini API key to the `.env` file:
```
GEMINI_API_KEY=your_actual_api_key_here
```

5. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The client will run on `http://localhost:3001`

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your `.env` file

## 🏗️ Architecture

### Backend (`/server`)
- **Express.js** server with REST API
- **Gemini AI** integration for AI player behavior
- In-memory storage for game state (easily replaceable with database)
- Real-time message polling

### Frontend (`/client`)
- **React** with **TypeScript**
- Modern, responsive design with dark theme
- Real-time chat interface
- State management for game flow

## 🎯 Game Features

- **Dynamic AI Personalities**: Each AI player has a unique bio and conversation style
- **Real-time Chat**: Seamless messaging with AI responses
- **Smart AI Behavior**: AIs ask strategic questions to detect human patterns
- **Timer-based Rounds**: Chat phase has a time limit
- **Voting System**: Final phase where AIs vote for suspected human
- **Results Analysis**: Detailed feedback on game performance

## 🛠️ Development

### Server Development
```bash
cd server
npm run dev  # Starts with nodemon for auto-restart
```

### Client Development
```bash
cd client
npm start    # Starts React development server
```

### API Endpoints

- `POST /api/games` - Create a new game
- `GET /api/games/:gameId` - Get game state and messages
- `POST /api/games/:gameId/start-chat` - Start the chat phase
- `POST /api/games/:gameId/messages` - Send a message
- `POST /api/games/:gameId/vote` - Submit a vote

## 🎨 Customization

### Modifying AI Behavior
Edit the prompts in `server/server.js` in the `generateAIMessage` function to change how AIs behave and what questions they ask.

### Styling
All styles are in `client/src/App.css`. The design uses a modern dark theme with glassmorphism effects.

### Game Rules
Modify timing, player count, and game phases in the respective components and server logic.

## 🚨 Troubleshooting

### Common Issues

1. **"Failed to create game"**
   - Check that your Gemini API key is correct
   - Ensure the server is running on port 3000
   - Check server logs for detailed error messages

2. **Messages not appearing**
   - Verify the frontend is polling the correct server URL
   - Check browser console for network errors

3. **AI not responding**
   - Confirm Gemini API key has proper permissions
   - Check rate limits on your API key
   - Review server logs for API errors

### Logs
Check the server console for detailed error messages and API responses.

## 🔮 Future Enhancements

- **Database Integration**: Replace in-memory storage with persistent database
- **WebSocket Support**: Real-time messaging without polling
- **Multiple Game Rooms**: Support for multiple concurrent games
- **Advanced AI Strategies**: More sophisticated AI detection algorithms
- **Player Statistics**: Track win/loss records and improvement over time
- **Custom AI Personalities**: User-configurable AI behavior patterns

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues, feature requests, and pull requests to improve the game!