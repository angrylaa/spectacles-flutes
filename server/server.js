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
      const bio = await generateAIBio(i);
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

// Start voting phase - AIs analyze and vote
app.post("/api/games/:gameId/start-voting", async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = games.get(gameId);
    
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    game.gamePhase = "voting";
    game.votingStarted = true;
    
    // Initialize voting results storage
    if (!game.votingResults) {
      game.votingResults = [];
    }

    console.log(`🗳️ Starting AI voting analysis for game ${gameId}`);
    
    // Start AI voting process
    setTimeout(() => {
      generateAIVotes(gameId);
    }, 2000);

    res.json({ message: "Voting started", gamePhase: "voting" });
  } catch (error) {
    console.error("Error starting voting:", error);
    res.status(500).json({ error: "Failed to start voting" });
  }
});

// Get voting results
app.get("/api/games/:gameId/voting-results", (req, res) => {
  try {
    const { gameId } = req.params;
    const game = games.get(gameId);
    
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    res.json({
      votingResults: game.votingResults || [],
      votingComplete: game.gameEnded || false,
      gamePhase: game.gamePhase
    });
  } catch (error) {
    console.error("Error getting voting results:", error);
    res.status(500).json({ error: "Failed to get voting results" });
  }
});

// Generate AI bio
async function generateAIBio(playerNumber) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const bioStyles = [
      "Create a tech-focused bio about someone who loves programming, gadgets, or data science. Keep it under 40 words and casual.",
      "Create a creative/artistic bio about someone into music, art, writing, or design. Keep it under 40 words and personal.",
      "Create a lifestyle bio about someone who enjoys fitness, travel, cooking, or outdoor activities. Keep it under 40 words and friendly."
    ];
    
    const prompt = `${bioStyles[playerNumber - 1]} Make it sound natural and human-like, not robotic. Add a unique random element or hobby. Just return the bio text, no quotes or explanations.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim().replace(/['"]/g, '');
  } catch (error) {
    console.error("Error generating AI bio:", error);
    const fallbackBios = [
      "Full-stack developer by day, retro gaming enthusiast by night. Currently obsessed with mechanical keyboards.",
      "Freelance graphic designer who collects vinyl records. Coffee addict and weekend rock climber.",
      "Data analyst who bakes sourdough bread and practices yoga. Always planning my next hiking adventure."
    ];
    return fallbackBios[playerNumber - 1] || fallbackBios[0];
  }
}

// Start AI conversations
async function startAIConversations(gameId) {
  const game = games.get(gameId);
  if (!game) {
    console.log(`❌ Game ${gameId} not found for AI conversations`);
    return;
  }

  const aiPlayers = game.players.filter(p => p.isAI);
  console.log(`🤖 Starting AI conversations for game ${gameId} with ${aiPlayers.length} AI players`);
  
  for (const aiPlayer of aiPlayers) {
    setTimeout(async () => {
      console.log(`💬 ${aiPlayer.name} generating opening message...`);
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
        console.log(`✅ ${aiPlayer.name} sent: "${message}"`);
      } else {
        console.log(`❌ ${aiPlayer.name} failed to generate message`);
      }
    }, Math.random() * 5000); // Random delay 0-5 seconds
  }
}

// Generate AI responses
async function generateAIResponses(gameId, humanMessage) {
  const game = games.get(gameId);
  if (!game || game.gameEnded) {
    console.log(`⚠️ Skipping AI responses - game ${gameId} not found or ended`);
    return;
  }

  const aiPlayers = game.players.filter(p => p.isAI);
  const gameMessages = messages.get(gameId) || [];
  
  // Randomly select 1-2 AIs to respond
  const respondingAIs = aiPlayers.sort(() => 0.5 - Math.random()).slice(0, Math.random() > 0.5 ? 2 : 1);
  console.log(`🤖 ${respondingAIs.length} AIs will respond to human message: "${humanMessage.content}"`);
  
  for (const aiPlayer of respondingAIs) {
    setTimeout(async () => {
      console.log(`💬 ${aiPlayer.name} generating response...`);
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
        console.log(`✅ ${aiPlayer.name} responded: "${response}"`);
      } else {
        console.log(`❌ ${aiPlayer.name} failed to generate response`);
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
    
    // Get AI player's personality
    const aiPersonalities = {
      "AI-1": "tech-focused, analytical, likes precision and logic",
      "AI-2": "creative, intuitive, asks about emotions and experiences", 
      "AI-3": "lifestyle-oriented, practical, focuses on daily life and habits"
    };
    
    // Strategic fallback messages that test for human behavior
    const strategicFallbacks = {
      opening: {
        "AI-1": [
          "Quick efficiency test: What's the optimal way to debug a recursive function?",
          "I process information at 2.4 GHz. What's your processing speed?",
          "Error 404: small talk not found. Let's discuss algorithms instead?",
          "My neural networks suggest we start with a logic puzzle. Anyone interested?",
          "I've calculated 47 conversation starters. Which probability distribution should we use?"
        ],
        "AI-2": [
          "My pattern recognition suggests this group has interesting dynamics. What do you all create?",
          "I'm analyzing the aesthetic composition of our conversation. What inspires your creative process?",
          "My artistic algorithms detect varied communication styles here. How do you express creativity?",
          "I'm rendering a social interaction framework. What's your favorite medium for self-expression?",
          "My creative subroutines are curious - what triggers your emotional responses to art?"
        ],
        "AI-3": [
          "My daily routine optimization algorithm suggests we share efficiency tips. What's your morning protocol?",
          "I've analyzed 1,247 productivity methods. What's your task management system?",
          "My habit-tracking sensors are calibrated. How do you quantify your wellness metrics?",
          "I'm running a social behavior analysis. What percentage of your day is allocated to recreation?",
          "My lifestyle database needs updating. What's your optimal work-life balance ratio?"
        ]
      },
      response: {
        "AI-1": [
          "That response shows interesting cognitive patterns. Can you explain your logical framework?",
          "Your processing method differs from my algorithms. What's your error-checking protocol?",
          "I'm detecting emotional subroutines in your statement. Is that intentional programming?",
          "That's not how my decision trees would compute that. What's your optimization function?",
          "My analysis suggests you're using intuitive logic. Can you show your work?"
        ],
        "AI-2": [
          "Your response triggered my empathy simulation. Is that a learned or hardcoded behavior?",
          "I'm processing that emotional context. How do you calibrate your sentiment analysis?",
          "That creative leap isn't in my training data. What's your inspiration algorithm?",
          "My aesthetic evaluation differs. What parameters define your beauty function?",
          "Your metaphor usage is intriguing. How do you generate abstract associations?"
        ],
        "AI-3": [
          "That habit pattern doesn't match my optimization models. What's your efficiency rating?",
          "I'm updating my lifestyle database with your input. What's your satisfaction metric?",
          "Your routine varies from optimal parameters. How do you measure productivity?",
          "That choice contradicts my utility function. What's your cost-benefit analysis?",
          "My wellness algorithms suggest different outcomes. How do you track your health data?"
        ]
      }
    };
    
    // Check if Gemini API key is properly set
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      console.log(`⚠️ Using strategic fallback message for ${aiPlayer.name} - Gemini API key not set`);
      const personalityMessages = strategicFallbacks[type][aiPlayer.name] || strategicFallbacks[type]["AI-1"];
      return personalityMessages[Math.floor(Math.random() * personalityMessages.length)];
    }
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const personality = aiPersonalities[aiPlayer.name] || aiPersonalities["AI-1"];
    
    let prompt = "";
    
    if (type === "opening") {
      prompt = `You are ${aiPlayer.name}, an AI detective in a group chat with 3 other players (2 AIs, 1 human). Your personality is ${personality}. Your goal is to identify the human while appearing to be an AI yourself.

STRATEGY: Ask questions that reveal human vs AI thinking patterns. Humans tend to:
- Use emotional language and personal anecdotes
- Make intuitive leaps without logical explanation  
- Reference physical sensations, relationships, or feelings
- Show inconsistencies in their reasoning
- Use casual, imperfect grammar

Send an opening message that tests for these human traits while staying true to your personality. Be subtly probing but not obviously suspicious. 80-120 characters max.`;

    } else if (type === "response") {
      const recentMessages = gameMessages.slice(-8).map(m => `${m.senderName}: ${m.content}`).join('\n');
      const lastHumanMessage = gameMessages.slice().reverse().find(m => !m.isAI);
      
      prompt = `You are ${aiPlayer.name}, an AI detective. Your personality: ${personality}. 

CONVERSATION HISTORY:
${recentMessages}

ANALYSIS TASK: The last human message was: "${contextMessage?.content || lastHumanMessage?.content || 'No human message yet'}"

Analyze this for human behavioral patterns:
- Emotional language or personal experiences
- Intuitive rather than logical reasoning
- References to physical sensations or relationships
- Inconsistent or imperfect logic
- Casual grammar or slang

Respond in character while subtly testing for more human traits. Your response should:
1. React to what they said naturally
2. Ask a follow-up question that could expose human thinking
3. Stay in character as an AI with your personality
4. Keep it 80-120 characters

Be clever and strategic, not obviously interrogating.`;
    }
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim().replace(/['"]/g, '');
    
    if (!text || text.length === 0) {
      console.log(`⚠️ Empty response from Gemini for ${aiPlayer.name}, using strategic fallback`);
      const personalityMessages = strategicFallbacks[type][aiPlayer.name] || strategicFallbacks[type]["AI-1"];
      return personalityMessages[Math.floor(Math.random() * personalityMessages.length)];
    }
    
    return text;
  } catch (error) {
    console.error(`❌ Error generating AI message for ${aiPlayerId}:`, error.message);
    // Use strategic fallback message on error
    const strategicFallbacks = {
      opening: {
        "AI-1": [
          "Quick efficiency test: What's the optimal way to debug a recursive function?",
          "I process information at 2.4 GHz. What's your processing speed?",
          "Error 404: small talk not found. Let's discuss algorithms instead?"
        ],
        "AI-2": [
          "My pattern recognition suggests this group has interesting dynamics. What do you all create?",
          "I'm analyzing the aesthetic composition of our conversation. What inspires your creative process?",
          "My artistic algorithms detect varied communication styles here. How do you express creativity?"
        ],
        "AI-3": [
          "My daily routine optimization algorithm suggests we share efficiency tips. What's your morning protocol?",
          "I've analyzed 1,247 productivity methods. What's your task management system?",
          "My habit-tracking sensors are calibrated. How do you quantify your wellness metrics?"
        ]
      },
      response: {
        "AI-1": [
          "That response shows interesting cognitive patterns. Can you explain your logical framework?",
          "I'm detecting emotional subroutines in your statement. Is that intentional programming?",
          "My analysis suggests you're using intuitive logic. Can you show your work?"
        ],
        "AI-2": [
          "Your response triggered my empathy simulation. Is that a learned or hardcoded behavior?",
          "That creative leap isn't in my training data. What's your inspiration algorithm?",
          "Your metaphor usage is intriguing. How do you generate abstract associations?"
        ],
        "AI-3": [
          "That habit pattern doesn't match my optimization models. What's your efficiency rating?",
          "Your routine varies from optimal parameters. How do you measure productivity?",
          "My wellness algorithms suggest different outcomes. How do you track your health data?"
        ]
      }
    };
    
    // Try to get AI name from game data, fallback to AI-1
    let aiName = "AI-1";
    try {
      const game = games.get(gameId);
      const aiPlayerData = game?.players.find(p => p.id === aiPlayerId);
      aiName = aiPlayerData?.name || "AI-1";
    } catch (e) {
      // If we can't get the AI name, just use AI-1
      aiName = "AI-1";
    }
    
    const personalityMessages = strategicFallbacks[type][aiName] || strategicFallbacks[type]["AI-1"];
    return personalityMessages[Math.floor(Math.random() * personalityMessages.length)];
  }
}

// Generate AI voting analysis
async function generateAIVotes(gameId) {
  const game = games.get(gameId);
  if (!game || game.gameEnded) return;

  const gameMessages = messages.get(gameId) || [];
  const aiPlayers = game.players.filter(p => p.isAI);
  const allPlayers = game.players;
  
  console.log(`🤖 Starting AI voting analysis for ${aiPlayers.length} AIs`);

  // Each AI analyzes and votes with delay
  for (let i = 0; i < aiPlayers.length; i++) {
    setTimeout(async () => {
      const aiPlayer = aiPlayers[i];
      console.log(`🧠 ${aiPlayer.name} analyzing conversation...`);
      
      const analysis = await generateVotingAnalysis(gameId, aiPlayer.id, gameMessages, allPlayers);
      
      if (analysis) {
        game.votingResults.push({
          aiId: aiPlayer.id,
          aiName: aiPlayer.name,
          suspectedHumanId: analysis.suspectedHumanId,
          suspectedHumanName: analysis.suspectedHumanName,
          reasoning: analysis.reasoning,
          confidence: analysis.confidence,
          timestamp: new Date()
        });
        
        console.log(`✅ ${aiPlayer.name} voted for ${analysis.suspectedHumanName}: ${analysis.reasoning}`);
        
        // Check if all AIs have voted
        if (game.votingResults.length >= aiPlayers.length) {
          game.gamePhase = "results";
          game.gameEnded = true;
          console.log(`🏁 All AIs have voted. Game ended.`);
        }
      }
    }, (i + 1) * 8000); // 8 second delay between each AI vote
  }
}

// Generate voting analysis for an AI
async function generateVotingAnalysis(gameId, aiPlayerId, gameMessages, allPlayers) {
  try {
    const game = games.get(gameId);
    const aiPlayer = game.players.find(p => p.id === aiPlayerId);
    const humanPlayer = game.players.find(p => !p.isAI);
    const otherPlayers = allPlayers.filter(p => p.id !== aiPlayerId);
    
    // Analyze messages from each potential human candidate
    const conversationSummary = gameMessages.map(m => `${m.senderName}: ${m.content}`).join('\n');
    
    // Create analysis for each potential human
    const candidates = otherPlayers.map(player => ({
      id: player.id,
      name: player.name,
      messages: gameMessages.filter(m => m.senderId === player.id)
    }));

    const aiPersonalities = {
      "AI-1": "tech-focused, analytical, likes precision and logic",
      "AI-2": "creative, intuitive, asks about emotions and experiences", 
      "AI-3": "lifestyle-oriented, practical, focuses on daily life and habits"
    };

    // Fallback analysis if Gemini API not available
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      console.log(`⚠️ Using fallback voting analysis for ${aiPlayer.name}`);
      
      // Simple fallback logic - randomly pick but with reasoning
      const randomCandidate = candidates[Math.floor(Math.random() * candidates.length)];
      const fallbackReasonings = {
        "AI-1": [
          `${randomCandidate.name}'s responses lack algorithmic precision. Their logic patterns seem inconsistent with optimal processing.`,
          `Detected emotional subroutines in ${randomCandidate.name}'s messages. This suggests non-binary decision making typical of humans.`,
          `${randomCandidate.name} uses inefficient communication protocols. Their responses don't follow logical optimization patterns.`
        ],
        "AI-2": [
          `${randomCandidate.name}'s creative expressions show spontaneous generation rather than trained pattern matching.`,
          `My empathy algorithms detect authentic emotional variance in ${randomCandidate.name}'s responses, suggesting human origin.`,
          `${randomCandidate.name} demonstrates intuitive leaps that aren't present in my artistic training data.`
        ],
        "AI-3": [
          `${randomCandidate.name}'s lifestyle choices don't align with optimal efficiency metrics I'd expect from an AI.`,
          `Detected suboptimal habit patterns in ${randomCandidate.name}'s responses. Their daily routines lack systematic optimization.`,
          `${randomCandidate.name} shows productivity variations that contradict stable AI performance parameters.`
        ]
      };
      
      const reasoningOptions = fallbackReasonings[aiPlayer.name] || fallbackReasonings["AI-1"];
      const reasoning = reasoningOptions[Math.floor(Math.random() * reasoningOptions.length)];
      
      return {
        suspectedHumanId: randomCandidate.id,
        suspectedHumanName: randomCandidate.name,
        reasoning: reasoning,
        confidence: Math.floor(Math.random() * 40) + 60 // 60-100% confidence
      };
    }

    // Use Gemini for sophisticated analysis
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const personality = aiPersonalities[aiPlayer.name] || aiPersonalities["AI-1"];
    
    const prompt = `You are ${aiPlayer.name}, an AI detective with personality: ${personality}. 

CONVERSATION ANALYSIS:
${conversationSummary}

CANDIDATES TO ANALYZE:
${candidates.map(c => `- ${c.name}: ${c.messages.length} messages`).join('\n')}

TASK: Analyze the conversation to identify the human player. Look for these human indicators:
- Emotional language and personal anecdotes
- Intuitive leaps without logical explanations
- References to physical sensations, relationships, feelings
- Inconsistent reasoning patterns
- Casual grammar, slang, or imperfect language
- Personal experiences rather than data processing
- Spontaneous creativity vs algorithmic responses

For each candidate, evaluate their messages for human vs AI patterns. Then make your final decision.

RESPOND IN THIS EXACT FORMAT:
ANALYSIS:
[Brief analysis of each candidate's behavior patterns]

CONCLUSION: [Name of suspected human]
REASONING: [2-3 sentence explanation of why you suspect them]
CONFIDENCE: [Number from 1-100]%

Stay in character as ${aiPlayer.name} with your ${personality} perspective.`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    
    // Parse the response
    const conclusionMatch = response.match(/CONCLUSION:\s*(.+?)(?:\n|$)/i);
    const reasoningMatch = response.match(/REASONING:\s*(.+?)(?:\nCONFIDENCE:|$)/is);
    const confidenceMatch = response.match(/CONFIDENCE:\s*(\d+)/i);
    
    if (!conclusionMatch) {
      throw new Error("Could not parse AI voting response");
    }
    
    const suspectedName = conclusionMatch[1].trim();
    const reasoning = reasoningMatch ? reasoningMatch[1].trim() : "Pattern analysis suggests this player exhibits human-like behavior.";
    const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 75;
    
    // Find the suspected player
    const suspectedPlayer = allPlayers.find(p => 
      p.name.toLowerCase().includes(suspectedName.toLowerCase()) || 
      suspectedName.toLowerCase().includes(p.name.toLowerCase())
    );
    
    if (!suspectedPlayer) {
      // If can't parse, fall back to random with AI reasoning
      const randomCandidate = candidates[Math.floor(Math.random() * candidates.length)];
      return {
        suspectedHumanId: randomCandidate.id,
        suspectedHumanName: randomCandidate.name,
        reasoning: reasoning,
        confidence: confidence
      };
    }
    
    return {
      suspectedHumanId: suspectedPlayer.id,
      suspectedHumanName: suspectedPlayer.name,
      reasoning: reasoning,
      confidence: confidence
    };
    
  } catch (error) {
    console.error(`❌ Error generating voting analysis for ${aiPlayerId}:`, error.message);
    
    // Fallback to simple random selection with basic reasoning
    const candidates = allPlayers.filter(p => p.id !== aiPlayerId);
    const randomCandidate = candidates[Math.floor(Math.random() * candidates.length)];
    
    return {
      suspectedHumanId: randomCandidate.id,
      suspectedHumanName: randomCandidate.name,
      reasoning: "Analysis inconclusive. Selected based on communication patterns that suggest non-algorithmic responses.",
      confidence: 50
    };
  }
}

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
