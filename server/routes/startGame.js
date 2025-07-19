import express from "express";
import AIAgent from "../class/aiAgent.js";
import { createAIPlayerHelper } from "../controllers/firebaseHelpers.js";

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

		await runAIConcurrently(agents, gameId);
	} catch (error) {
		console.error("Error sending message:", error);
		res.status(500).json({ error: "Failed to send message" });
	}
});

// Function to send out an initial message to the other players concurrently
async function runAIConcurrently(agents, gameId) {
	try {

		// TODO: create player for ai ✅
		// TODO: create message entry
		// TODO: update message count
		// const AIPlayers = [];
		const playerInfos = await Promise.all(
			agents.map(() => createAIPlayerHelper(gameId))
		);

		const gameRef = db.collection('gameSessions').doc(gameId);
		const gameSnap = await gameRef.get();
		if (!gameSnap.exists) throw new Error('Game session not found');


		const gameData = gameSnap.data();
		const allPlayerIds = gameData.playersList;


		const promises = agents.map(async (agent, idx) => {
			const sender = playerInfos[idx];
			try {

				const sender = playerInfos[idx];
				const senderId = sender.playerId;

				const eligibleRecipients = allPlayerIds.filter(id => id !== senderId);

				if (eligibleRecipients.length === 0) {
					throw new Error(`No valid recipients available for sender ${senderId}`);
				}

				const recipientId = eligibleRecipients[Math.floor(Math.random() * eligibleRecipients.length)];

				// Assuming agent.sendMessage() returns a promise that resolves with the response
				const response = await agent.sendMessage();
				await createAIMessageAndIncrementCount(sender.playerId, recipientId, response);

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
