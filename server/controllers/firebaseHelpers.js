import { FieldValue } from "firebase-admin/firestore";
import { db } from "../firebaseAdmin.js";

import { v4 as uuidv4 } from "uuid";

export async function createAIPlayerHelper(gameId) {
  const playerId = uuidv4();
  const playerData = {
    playerId,
    numOfVotes: 0,
    bio: "",
    noMessagesSent: 0,
  };

  await db.collection("players").doc(playerId).set(playerData);

  await gameRef.update({
    noOfPlayers: (gameData.noOfPlayers || 0) + 1,
    playersList: FieldValue.arrayUnion(playerId),
  });

  return playerData;
}

export async function createAIMessageAndIncrementCount(
  senderId,
  recipientId,
  content
) {
  const playerRef = db.collection("players").doc(senderId);

  const playerSnap = await playerRef.get();
  if (!playerSnap.exists) {
    throw new Error(`Player with ID ${senderId} not found`);
  }

  const playerData = playerSnap.data();

  if (playerData.noMessagesSent >= 20) {
    throw new Error(`Player ${senderId} has reached the message limit of 20.`);
  }

  const messageId = uuidv4();
  const created_at = new Date();

  const messageData = {
    messageId,
    senderId,
    recipientId,
    content,
    created_at,
  };

  await db.collection("messages").doc(messageId).set(messageData);

  await playerRef.update({
    noMessagesSent: playerData.noMessagesSent + 1,
  });

  return messageData;
}
