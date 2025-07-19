import "dotenv/config";
import express from "express";
import sendMessageRoute from "./routes/chatPhase.js";
import playerRoutes from './routes/playersRoute.js';
import gameSessionRoute from './routes/gameSessionRoute.js';
import messageRoute from './routes/messageRoute.js'; 

const port = 3000;
const app = express();
app.use(express.json());

app.use("/health", (req, res) => {
  res.json("Healthy!");
});

app.use("/send-message", sendMessageRoute);

app.use("/players", playerRoutes);
app.use("/game-sessions", gameSessionRoute);
app.use("/messages", messageRoute);

app.listen(port, () => {
  console.log("server is listening!");
});
