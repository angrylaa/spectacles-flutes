import "dotenv/config";
import express from "express";
import chatPhaseRoute from "./routes/chatPhase.js";
import gameSessionRoute from "./routes/gameSessionRoute.js";
import messageRoute from "./routes/messageRoute.js";
import playerRoutes from "./routes/playersRoute.js";
import gameStartRoute from "./routes/startGame.js";

const port = 3000;
const app = express();
app.use(express.json());

app.use("/health", (req, res) => {
  res.json("Healthy!");
});

app.use("/players", playerRoutes);
app.use("/game-sessions", gameSessionRoute);
app.use("/messages", messageRoute);
app.use("/start-game", gameStartRoute);
app.use("/chat-phase", chatPhaseRoute);

app.listen(port, () => {
  console.log("server is listening!");
});
