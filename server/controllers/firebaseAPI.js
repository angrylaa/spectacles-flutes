import { v4 as uuidv4 } from "uuid";
import { db } from "../firebaseAdmin.js";
import { getSession } from "../services/gameSessionService.js";
import { respondToMessage, sendMessage } from "../services/geminiService.js";
import { getDocs, collection } from 'firebase/firestore';
import { db } from './firebaseConfig.js';

import {
  fetchChatHistory,
  fetchUnreadMessages,
  postCreateMessage,
  updateMessageReadStatus,
} from "../services/messageService.js";
import {
  createAIPlayer,
  createPlayer,
  getPlayer,
  updatePlayer,
} from "../services/playerServices.js";
import { getPollingFlag, setPollingFlag } from "../services/polling.js";

export async function getChatHistory(req, res) {
  try {
    const history = await fetchChatHistory(
      req.body.recipientId,
      req.body.senderId
    );

    console.log(history);

    return history;
  } catch (err) {}
}

// POST
// first api called
// 1. player 1 gets is created & adds a bio, 3 ai bots are created
// 2. game session is created & players are added to it
// 3. return the game url

export async function startGame(req, res) {
  console.log('yolo');
  try {
    const playerIdList = [];

    // create first player
    console.log(req.body.bio);
    const playerId = await createPlayer(req.body.bio);
    console.log(playerId);

    playerIdList.push(playerId);

    // create 3 AI players
    for (let i = 0; i < 3; i++) {
      const AIPlayerId = await createAIPlayer();
      playerIdList.push(AIPlayerId);
    }

    // create the game session
    const gameId = uuidv4();
    const gameSessionData = {
      gameId,
      gameStage: 0,
      noOfPlayers: 4,
      playersList: playerIdList,
    };

    await db.collection("gameSessions").doc(gameId).set(gameSessionData);

    await db.collection("gameSessions").doc(gameId).update({
      gameStage: 1,
    });

    res.send({ success: true, gameSession: gameSessionData });
  } catch (error) {
    res
      .status(500)
      .send({ error: "Failed to create a game session", details: error });
  }
}

// third api called
// 1. game switches to first phase
// 2. ALL the AIs will start in a messaging phase
// --- when in message phase, they will not be responding to any messages, after the message is sent
// --- the DB is updated so that the AI player enters a listening stage
// 3. once AI state -> listening stage, THEN we check the messages DB to see if they have anything to respond to
// 4. if they do, they update their state to messaging & send a message
// 5. once the AI has run out of messages (aka iterates to 10) they enter a blocked state
// 6. once all AIs are blocked & player is blocked, the game switches to the next stage
export const conversationPhase = async (req, res) => {
  const { gameId } = req.body;
  try {
    const gameData = await getSession(gameId);
    console.log(gameData);

    // Process each player in parallel using Promise.all
    await Promise.all(
      gameData.playersList.map(async (playerId) => {
        const playerData = await getPlayer(playerId);
        if (playerData.ai) {
          // Filter out current AI's ID from the player list
          const otherPlayers = gameData.playersList.filter(
            (id) => id !== playerId
          );

          // Send initial AI message with list of other players
          const messageData = await sendMessage(otherPlayers, playerId);

          await postCreateMessage(messageData);
          await updatePlayer(playerId, {
            messageCount: playerData.messageCount + 1,
          });

          if (playerData.messageCount >= 20) {
            await updatePlayer(playerId, {
              state: "blocked",
            });

            await setPollingFlag(true);
          } else {
            if (await getPollingFlag()) {
              await setPollingFlag(false);
            }
          }
        }
      })
    );

    res.send({
      success: true,
      message: "Conversation phase initiated",
      gameData,
    });
  } catch (err) {
    res
      .status(500)
      .send({ error: "Failed to initiate conversation phase", details: err });
  }
};

export const respond = async () => {
  const unreadMessages = await fetchUnreadMessages();

  const pairs = unreadMessages.map((msg) => ({
    sender: msg.senderId,
    recipient: msg.recipientId,
  }));

  const chatHistories = await Promise.all(
    pairs.map(async (pair) => {
      const history = await fetchChatHistory(pair.sender, pair.recipient);
      const playerData = await getPlayer(pair.recipient);
      const playerId = playerData.playerId;
      console.log(playerData);

      if (playerData.state !== "blocked") {
        const latestUnread = history.find((msg) => msg.unread === true);
        await updateMessageReadStatus(latestUnread.messageId);

        const messageData = await respondToMessage(
          latestUnread.content,
          pair.sender,
          pair.recipient,
          history
        );

        wait(5000);
        await postCreateMessage(messageData);
        await updateMessageReadStatus(latestUnread.messageId);
        await updatePlayer(playerId, {
          messageCount: playerData.messageCount + pairs.length,
        });

        if (playerData.messageCount >= 20) {
          await updatePlayer(playerId, {
            state: "blocked",
          });
        }
      }

      return true;
    })
  );

  await setPollingFlag(true);
};

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const votingPhase = async () => {
  const unreadMessages = await fetchUnreadMessages();

  const pairs = unreadMessages.map((msg) => ({
    sender: msg.senderId,
    recipient: msg.recipientId,
  }));

  const chatHistories = await Promise.all(
    pairs.map(async (pair) => {
      const history = await fetchChatHistory(pair.sender, pair.recipient);
      const playerData = await getPlayer(pair.recipient);
      const playerId = playerData.playerId;
      console.log(playerData);

      if (playerData.state !== "blocked") {
        const latestUnread = history.find((msg) => msg.unread === true);
        const messageData = await respondToMessage(
          latestUnread.content,
          pair.sender,
          pair.recipient,
          history
        );

        wait(5000);
        await postCreateMessage(messageData);
        await updateMessageReadStatus(latestUnread.messageId);

        if (playerData.messageCount >= 15) {
          await updatePlayer(playerId, {
            state: "blocked",
          });
        }
      }

      return true;
    })
  );

  await setPollingFlag(true);
};



export const getAllPlayers = async () => {
  const snapshot = await getDocs(collection(db, 'players'));
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    playerId: doc.id,  // or use the field inside doc.data() if different
    updatedAt: doc.data().updatedAt || new Date().toISOString() // fallback if needed
  }));
};