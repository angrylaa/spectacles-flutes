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

// Function to send out an initial message to the other players concurrently
async function runAIConcurrently(agents) {
  try {
    const promises = agents.map(async (agent) => {
      try {
        // Assuming agent.sendMessage() returns a promise that resolves with the response
        const response = await agent.sendMessage();

        // Assuming agent.createMessageEntry() and agent.updateMessageCount() are asynchronous methods
        // await agent.createMessageEntry(response); // Create message entry
        // await agent.updateMessageCount(); // Update message count

        return response; // Return response or any relevant data
      } catch (error) {
        console.error(
          `Error sending message for agent ${agent.agentId}:`,
          error
        );
        throw error; // Rethrow the error to handle it outside
      }
    });

    // Await all promises concurrently
    const responses = await Promise.all(promises);

    return responses; // Return all responses once completed
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
