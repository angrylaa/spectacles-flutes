import "dotenv/config";
import express from "express";
import sendMessageRoute from "./routes/chatPhase.js";

const port = 3000;
const app = express();

app.use(express.json());

app.use("/health", (req, res) => {
  res.json("Healthy!");
});

app.use("/send-message", sendMessageRoute);

app.listen(port, () => {
  console.log("server is listening!");
});
