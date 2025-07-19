import express from "express";
import AIAgent from "../class/aiAgent.js";
const router = express.Router();

router.get("/ai-creation", async (req, res) => {
  try {
    // create 4 AI agents

    console.log("Starting AI agents...");

    const agents = [];
    for (let i = 1; i <= 3; i++) {
      const agent = new AIAgent(i);
      agents.push(agent);
    }

    await runAIConcurrently(agents);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

async function runAIConcurrently(agents) {
  try {
    const promises = agents.map((agent) => agent.sendMessage());

    // Await all responsses concurrently
    const responses = await Promise.all(promises);

    return responses;
  } catch (error) {
    console.error("Error processing AI responses:", error);
    throw error;
  }
}

router.get("/gameStartHuman", async (req, res) => {
  try {
    // create a human player
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
