import "dotenv/config";
import express from "express";
import cors from "cors";  
// import chatPhaseRoute from "./routes/chatPhase.js";
import gameSessionRoute from "./routes/gameSessionRoute.js";
// import messageRoute from "./routes/messageRoute.js";
// import playerRoutes from "./routes/playersRoute.js";
import { checkAndProcessResponses } from "./services/polling.js";

// Start polling when server starts
checkAndProcessResponses();

const port = 3000;
const app = express();
app.use(express.json());
app.use(cors()); 

app.use("/health", (req, res) => {
  console.log("Health check received");
  res.json("Healthy!");
});

// app.use("/players", playerRoutes);
app.use("/game-sessions", gameSessionRoute);
// app.use("/messages", messageRoute);
// app.use("/start-game", gameStartRoute);

app.listen(port, () => {
  console.log("server is listening!");
});
