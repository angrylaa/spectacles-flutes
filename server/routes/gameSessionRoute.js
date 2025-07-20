import express from "express";
import {
  conversationPhase,
  getChatHistory,
  respond,
  startGame,
  votingPhase,
} from "../controllers/firebaseAPI.js";
import { deleteAllMessagesExceptOne } from "../services/messageService.js";

const router = express.Router();

const gameStageOne = {
  gameId: "id",
  gameStage: 0,
  noOfPlayers: 1,
  playersList: ["player1", "AI1", "AI2", "AI3"],
  stageStarted: "",
};

router.post("/chat-history", getChatHistory);

// first api called
// 1. player 1 gets is created & adds a bio, 3 ai bots are created
// 2. game session is created & players are added to it
// 3. return the game url
router.post("/", startGame);
// body: bio (string)

const gameStageTwo = {
  gameId: "id",
  gameStage: 0,
  noOfPlayers: 2,
  playersList: ["player1", "player2", "AI1", "AI2", "AI3"],
  stageStarted: "",
};

// second api called
// 1. player joins & adds bio - create a player
// 2. update number of players in game session
// THEN trigger a webhook to notify the frontend & backend, to call the third api
// router.post("/new-player-joins");
// body: bio (string), gameId (string)

// CONVO STAGE
const gameStageThree = {
  gameId: "id",
  gameStage: 1,
  noOfPlayers: 2,
  playersList: ["player1", "player2", "AI1", "AI2", "AI3"],
  stageStarted: "",
};
// webhook 1 -> once ai is listening

// third api called
// 1. game switches to first phase
// 2. ALL the AIs will start in a messaging phase
// --- when in message phase, they will not be responding to any messages, after the message is sent
// --- the DB is updated so that the AI player enters a listening stage
// 3. once AI state -> listening stage, THEN we check the messages DB to see if they have anything to respond to
// 4. if they do, they update their state to messaging & send a message
// 5. once the AI has run out of messages (aka iterates to 10) they enter a blocked state
// 6. once all AIs are blocked & player is blocked, the game switches to the next stage
router.post("/conversation-phase", conversationPhase);
// body: gameId (string)

// third api response loop TODO: jasmine
router.get("/respond-to-message", respond);
router.post("/voting-phase", votingPhase);

// VOTING STAGE
const gameStageFour = {
  gameId: "id",
  gameStage: 2,
  noOfPlayers: 2,
  playersList: ["player1", "player2", "AI1", "AI2", "AI3"],
  stageStarted: "",
};

// start voting phase
// 1. game switches to voting phase
// 2. all players will vote for the player they think is human
// 3. after a player / AI casts their vote, they enter the blocked state
// 4. once all players are blocked, the game switches to the next stage

// start prompt phase
// 1. game gives everyone a prompt to respond to from the database

// REPEAT FROM CONVO STAGE

// at the end, tally who the most voted players are & allow players to vote for who they think is their companion

// PATCH (uhh or POST??) update number of players in a game session
// router.patch("/update-players", updateNoOfPlayers);

// // DELETE
// router.delete("/:gameId", deleteGameSession);

router.delete("/messages/clear", async (req, res) => {
  try {
    const result = await deleteAllMessagesExceptOne();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "Failed to clear messages",
      details: error.message,
    });
  }
});

export default router;
