import { db } from "../firebaseAdmin.js";

export async function getSession(sessionId) {
  try {
    const sessionSnap = await db
      .collection("gameSessions")
      .doc(sessionId)
      .get();
    if (!sessionSnap.exists) {
      return res.status(404).send({ error: "session not found" });
    }

    return sessionSnap.data();
  } catch (error) {
    res
      .status(500)
      .send({ error: "Failed to retrieve player", details: error });
  }
}

export async function updateGameStage(gameId, newStage) {
  try {
    const gameRef = db.collection("gameSessions").doc(gameId);
    const gameDoc = await gameRef.get();

    if (!gameDoc.exists) {
      throw new Error(`Game session with ID ${gameId} not found`);
    }

    await gameRef.update({
      gameStage: newStage,
      stageStarted: new Date().toISOString(),
    });

    return {
      success: true,
      message: `Game stage updated to ${newStage}`,
      gameId,
    };
  } catch (error) {
    throw new Error(`Failed to update game stage: ${error.message}`);
  }
}
