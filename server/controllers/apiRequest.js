import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const sendMessage = async () => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        parts: [
          {
            text: `You are an artificial intelligence agent who is participating
            in a game with two other AI agents and two human players. Your goal 
            is to win by identifying who the human players are. Send a message to
            the other player to start the conversation. Respond with a range of
            1 to 2 sentences, do not respond with more than 100 characters.`,
          },
        ],
      },
    ],
    config: {
      thinkingConfig: {
        thinkingBudget: -1,
      },
    },
  });

  console.log(response.text);
  return response.text;
};

export const respondToMessage = async () => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        parts: [
          {
            text: `The following is a message from someone you are having a conversation with.
            You may ask questions or respond to their statement. Respond with a range of
            1 to 2 sentences, do not respond with more than 100 characters.
            
            Message: "Hello, how are you doing today?"`,
          },
        ],
      },
    ],
    config: {
      thinkingConfig: {
        thinkingBudget: -1,
      },
    },
  });

  console.log(response.text);
  return response.text;
};

export const evaluate = async () => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        parts: [
          {
            text: `You are an artificial intelligence agent who is participating
            in a game with two other AI agents and two human players. Your goal 
            is to win by identifying who the human players are. Here is YOUR chat history
            with players 1 to 4. You must evaluate the chat history and determine
            which players are human and which are AI, with 1 being the most likely to be
            human and 4 being the least likely to be AI.
            
            [P1: "Test", You: "What is your favorite color?", P1: "blue", You: "Test"]
            [P2: "Hello, how are you doing today?", You: "I am doing well, thank you! How about you?"]
            [P3: "How is the weather", You: "Good, how are you", P3: "I'm good", You: "Amazing!"]
            [P4: "What's up", You: "Nothing much, just trying to figure out who the humans are", P4: "Same here!"]
            
            For the next round, you will have 10 messages to send to the other players. Decide
            how you want to distribute your messages amongst the 4 players to best
            determine who the humans are.`,
          },
        ],
      },
    ],
    config: {
      thinkingConfig: {
        thinkingBudget: -1,
      },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          playerOneRating: {
            type: Type.INTEGER,
          },
          playerTwoRating: {
            type: Type.INTEGER,
          },
          playerThreeRating: {
            type: Type.INTEGER,
          },
          playerFourRating: {
            type: Type.INTEGER,
          },
          messageDistribution: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                playerId: { type: Type.INTEGER },
                messageCount: { type: Type.INTEGER },
              },
            },
          },
        },
      },
    },
  });

  console.log(response.text);
  return response.text;
};

/* You are an artificial intelligence agent
            that is participating in a game with two other AI agents
            and two human players. As artificial intelligence, your goal
            is simple: you must win by identifying who the human players
            are. To do this, you will receive and send messages to all
            other players, including both human and AI players.  */
