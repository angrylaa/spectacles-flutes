import { v4 as uuidv4 } from "uuid";
import { db } from "../firebaseAdmin.js";
import { getSession } from "../services/gameSessionService.js";
import { respondToMessage, sendMessage } from "../services/geminiService.js";
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

    res.send({ success: true, gameSession: gameSessionData });
  } catch (error) {
    res
      .status(500)
      .send({ error: "Failed to create a game session", details: error });
  }
}

// second api called
// 1. player joins & adds bio - create a player
// 2. update number of players in game session
// THEN trigger a webhook to notify the frontend & backend, to call the third api
// router.post("/new-player-joins");
export async function initiateGame(req, res) {
  try {
    const { gameId, bio } = req.body;

    if (!gameId || !bio) {
      return res.status(400).send({ error: "Game ID and bio are required" });
    }

    const playerId = await createPlayer(bio);

    const gameRef = db.collection("gameSessions").doc(gameId);
    const gameSnap = await gameRef.get();

    if (!gameSnap.exists) {
      return res.status(404).send({ error: "Game session not found" });
    }

    await gameRef.update({
      noOfPlayers: (gameSnap.data().noOfPlayers || 0) + 1,
      playersList: [...gameSnap.data().playersList, playerId],
      gameStage: 1,
    });

    res.send({ success: true, playerId });
  } catch (error) {
    res
      .status(500)
      .send({ error: "Failed to create a 2nd player", details: error });
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

          if (playerData.messageCount >= 10) {
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
        const messageData = await respondToMessage(
          latestUnread.content,
          pair.sender,
          pair.recipient,
          history
        );

        wait(5000);
        await postCreateMessage(messageData);
        await updateMessageReadStatus(latestUnread.messageId);

        if (playerData.messageCount >= 10) {
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
