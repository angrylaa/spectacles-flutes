import "dotenv/config";
import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// In-memory storage for simplicity (use a database in production)
const games = new Map();
const messages = new Map();

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

// Create a new game
app.post("/api/games", async (req, res) => {
  try {
    const { humanBio } = req.body;
    
    if (!humanBio || humanBio.trim().length === 0) {
      return res.status(400).json({ error: "Human bio is required" });
    }

    const gameId = uuidv4();
    
    // Generate AI player bios
    const aiPlayers = [];
    for (let i = 1; i <= 3; i++) {
      const aiPlayerId = uuidv4();
      const bio = await generateAIBio();
      aiPlayers.push({
        id: aiPlayerId,
        name: `AI-${i}`,
        bio,
        isAI: true
      });
    }

    // Create human player
    const humanPlayerId = uuidv4();
    const humanPlayer = {
      id: humanPlayerId,
      name: "You",
      bio: humanBio,
      isAI: false
    };

    const game = {
      id: gameId,
      players: [humanPlayer, ...aiPlayers],
      humanPlayerId,
      gamePhase: "chat", // chat, voting, results
      createdAt: new Date(),
      chatStarted: false,
      votes: new Map(),
      gameEnded: false
    };

    games.set(gameId, game);
    messages.set(gameId, []);

    res.json({
      gameId,
      humanPlayerId,
      players: game.players
    });
  } catch (error) {
    console.error("Error creating game:", error);
    res.status(500).json({ error: "Failed to create game" });
  }
});

// Get game state
app.get("/api/games/:gameId", (req, res) => {
  const { gameId } = req.params;
  const game = games.get(gameId);
  
  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }

  const gameMessages = messages.get(gameId) || [];
  
  res.json({
    ...game,
    messages: gameMessages
  });
});

// Start chat phase
app.post("/api/games/:gameId/start-chat", async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = games.get(gameId);
    
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    if (game.chatStarted) {
      return res.json({ message: "Chat already started" });
    }

    game.chatStarted = true;
    
    // Start AI conversations after a short delay
    setTimeout(() => {
      startAIConversations(gameId);
    }, 2000);

    res.json({ message: "Chat started" });
  } catch (error) {
    console.error("Error starting chat:", error);
    res.status(500).json({ error: "Failed to start chat" });
  }
});

// Send message
app.post("/api/games/:gameId/messages", async (req, res) => {
  try {
    const { gameId } = req.params;
    const { senderId, content } = req.body;
    
    const game = games.get(gameId);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    const sender = game.players.find(p => p.id === senderId);
    if (!sender) {
      return res.status(404).json({ error: "Player not found" });
    }

    const message = {
      id: uuidv4(),
      senderId,
      senderName: sender.name,
      content,
      timestamp: new Date(),
      isAI: sender.isAI
    };

    const gameMessages = messages.get(gameId) || [];
    gameMessages.push(message);
    messages.set(gameId, gameMessages);

    // If this was a human message, trigger AI responses
    if (!sender.isAI) {
      setTimeout(() => {
        generateAIResponses(gameId, message);
      }, 1000 + Math.random() * 3000); // Random delay 1-4 seconds
    }

    res.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Vote for human
app.post("/api/games/:gameId/vote", (req, res) => {
  try {
    const { gameId } = req.params;
    const { voterId, suspectedHumanId } = req.body;
    
    const game = games.get(gameId);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    game.votes.set(voterId, suspectedHumanId);
    
    // Check if all AI players have voted
    const aiPlayers = game.players.filter(p => p.isAI);
    const votedPlayers = Array.from(game.votes.keys());
    const allAIVoted = aiPlayers.every(ai => votedPlayers.includes(ai.id));
    
    if (allAIVoted) {
      game.gamePhase = "results";
      game.gameEnded = true;
    }

    res.json({ voted: true, gameEnded: game.gameEnded });
  } catch (error) {
    console.error("Error voting:", error);
    res.status(500).json({ error: "Failed to vote" });
  }
});

// Generate AI bio
async function generateAIBio() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are an AI participating in a game where you need to detect who the human is among 4 players (you + 2 other AIs + 1 human). Create a brief, natural-sounding bio that could believably be from either an AI or human. Keep it under 50 words and make it conversational. Examples: "Love hiking and coding in my spare time", "Obsessed with vintage vinyl and my cat Mr. Whiskers", "Data scientist by day, amateur chef by night".`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim().replace(/['"]/g, '');
  } catch (error) {
    console.error("Error generating AI bio:", error);
    return `I enjoy learning new things and having interesting conversations!`;
  }
}

// Start AI conversations
async function startAIConversations(gameId) {
  const game = games.get(gameId);
  if (!game) return;

  const aiPlayers = game.players.filter(p => p.isAI);
  
  for (const aiPlayer of aiPlayers) {
    setTimeout(async () => {
      const message = await generateAIMessage(gameId, aiPlayer.id, "opening");
      if (message) {
        const gameMessages = messages.get(gameId) || [];
        gameMessages.push({
          id: uuidv4(),
          senderId: aiPlayer.id,
          senderName: aiPlayer.name,
          content: message,
          timestamp: new Date(),
          isAI: true
        });
        messages.set(gameId, gameMessages);
      }
    }, Math.random() * 5000); // Random delay 0-5 seconds
  }
}

// Generate AI responses
async function generateAIResponses(gameId, humanMessage) {
  const game = games.get(gameId);
  if (!game || game.gameEnded) return;

  const aiPlayers = game.players.filter(p => p.isAI);
  const gameMessages = messages.get(gameId) || [];
  
  // Randomly select 1-2 AIs to respond
  const respondingAIs = aiPlayers.sort(() => 0.5 - Math.random()).slice(0, Math.random() > 0.5 ? 2 : 1);
  
  for (const aiPlayer of respondingAIs) {
    setTimeout(async () => {
      const response = await generateAIMessage(gameId, aiPlayer.id, "response", humanMessage);
      if (response) {
        const aiMessage = {
          id: uuidv4(),
          senderId: aiPlayer.id,
          senderName: aiPlayer.name,
          content: response,
          timestamp: new Date(),
          isAI: true
        };
        
        const currentMessages = messages.get(gameId) || [];
        currentMessages.push(aiMessage);
        messages.set(gameId, currentMessages);
      }
    }, 2000 + Math.random() * 4000); // Random delay 2-6 seconds
  }
}

// Generate AI message
async function generateAIMessage(gameId, aiPlayerId, type, contextMessage = null) {
  try {
    const game = games.get(gameId);
    const gameMessages = messages.get(gameId) || [];
    const aiPlayer = game.players.find(p => p.id === aiPlayerId);
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    let prompt = "";
    
    if (type === "opening") {
      prompt = `You are an AI in a group chat with 3 other players (2 AIs, 1 human). Your goal is to identify the human while blending in. Send a casual opening message that could help you detect humans. Be natural, ask engaging questions, or make observations. Keep it under 100 characters. Don't reveal you're an AI.`;
    } else if (type === "response") {
      const recentMessages = gameMessages.slice(-5).map(m => `${m.senderName}: ${m.content}`).join('\n');
      prompt = `You are an AI in a group chat trying to identify the human player. Recent messages:\n${recentMessages}\n\nRespond naturally to the conversation while subtly probing to detect human behavior. Look for things like emotional responses, personal experiences, or human-like reasoning patterns. Keep response under 100 characters. Don't reveal you're an AI.`;
    }
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim().replace(/['"]/g, '');
  } catch (error) {
    console.error("Error generating AI message:", error);
    return null;
  }
}

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
