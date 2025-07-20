import { v4 as uuidv4 } from "uuid";
import { db } from "../firebaseAdmin.js";
import { generateBio } from "./geminiService.js";

export async function createPlayer(bio) {
  try {
    const playerId = uuidv4();
    console.log(playerId);

    const playerData = {
      playerId,
      messageCount: 0,
      bio: bio,
      state: "messaging",
      numberOfVotes: 0,
      ai: false,
    };

    console.log(playerData);

    await db.collection("players").doc(playerId).set(playerData);

    return playerId;
  } catch (error) {
    res.status(500).send({ error: "Failed to create player", details: error });
  }
}
export async function createAIPlayer() {
  try {
    const playerId = uuidv4();
    const bio = await generateBio();

    const playerData = {
      playerId,
      messageCount: 0,
      bio: bio.message,
      state: "messaging",
      numberOfVotes: 0,
      ai: true,
    };

    await db.collection("players").doc(playerId).set(playerData);

    console.log(playerData);
    return playerId;
  } catch (error) {
    // Changed from res.status to throwing error
    throw new Error(`Failed to create AI player: ${error.message}`);
  }
}

export async function getPlayer(playerId) {
  try {
    const playerSnap = await db.collection("players").doc(playerId).get();
    if (!playerSnap.exists) {
      // Changed from res.status to throwing error
      throw new Error("Player not found");
    }
    return playerSnap.data();
  } catch (error) {
    // Changed from res.status to throwing error
    throw new Error(`Failed to retrieve player: ${error.message}`);
  }
}

export async function updatePlayer(playerId, updateData) {
  try {
    if ("messageCount" in updateData) {
      updateData.messageCount = Number(updateData.messageCount);
      if (isNaN(updateData.messageCount)) {
        throw new Error("Invalid messageCount value");
      }
    }

    const playerRef = db.collection("players").doc(playerId);
    const player = await playerRef.get();

    if (!player.exists) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    await playerRef.update({
      ...updateData,
      updatedAt: new Date().toISOString(),
    });

    const updatedPlayer = await playerRef.get();
    return updatedPlayer.data();
  } catch (error) {
    throw new Error(`Failed to update player: ${error.message}`);
  }
}
