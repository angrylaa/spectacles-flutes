import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const sendMessage = async (idList, senderId) => {
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
            1 to 2 sentences, do not respond with more than 100 characters. Also,
            your message is only seen by one person, it's a direct message. You may
            ask a question or make a statement, whatever you think will allow you
            the best chance to determine if the recipient is a human.`,
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

  return {
    recipientId: idList[Math.floor(Math.random() * 4)],
    senderId: senderId,
    content: response.text,
  };
};

export const generateBio = async () => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        parts: [
          {
            text: `You are an artificial intelligence agent who is participating
            in a game with two other AI agents and two human players. Your goal 
            is to win by identifying who the human players are. Please
            create a bio / introduction for yourself, an AI bot participating in this game,
            that is 1 sentence long.`,
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

  return {
    message: response.text,
  };
};

export const respondToMessage = async (
  message,
  recipientId,
  senderId,
  history
) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        parts: [
          {
            text: `The following is a message from someone you are having a conversation with.
            You may ask questions or respond to their statement. Respond with a range of
            1 to 2 sentences, do not respond with more than 100 characters.
            
            Message: "${message}"
            Here is all the previous messages exchanged with this individual: ${history}`,
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

  return {
    recipientId: recipientId,
    senderId: senderId,
    content: response.text,
  };
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    playerOneRating: {
      type: Type.OBJECT,
      properties: {
        playerId: { type: Type.INTEGER },
        rating: { type: Type.INTEGER },
      },
    },
    playerTwoRating: {
      type: Type.OBJECT,
      properties: {
        playerId: { type: Type.INTEGER },
        rating: { type: Type.INTEGER },
      },
    },
    playerThreeRating: {
      type: Type.OBJECT,
      properties: {
        playerId: { type: Type.INTEGER },
        rating: { type: Type.INTEGER },
      },
    },
    playerFourRating: {
      type: Type.OBJECT,
      properties: {
        playerId: { type: Type.INTEGER },
        rating: { type: Type.INTEGER },
      },
    },
    messageDistribution: {
      type: Type.OBJECT,
      properties: {
        playerId: { type: Type.INTEGER },
        rating: { type: Type.INTEGER },
      },
    },
  },
};

export const evaluate = async (
  userOneID,
  userTwoID,
  userThreeID,
  userFourID
) => {
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
            
            [P1: "Hello, how are you doing?", You: "I'm good. What's your favourite colour?", P1: "Blue, what about you?", You: "Red!"]
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
        includeThoughts: true,
      },
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (!part.text) {
      continue;
    } else if (part.thought) {
      console.log("Thoughts summary:");
      console.log(part.text);
    } else {
      console.log("Answer:");
      console.log(part.text);
    }
  }

  return response.text;
};
/* You are an artificial intelligence agent
            that is participating in a game with two other AI agents
            and two human players. As artificial intelligence, your goal
            is simple: you must win by identifying who the human players
            are. To do this, you will receive and send messages to all
            other players, including both human and AI players.  */
