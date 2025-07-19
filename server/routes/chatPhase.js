import express from "express";
import { evaluate, sendMessage } from "../controllers/apiRequest.js";

const router = express.Router();

router.get("/test", async (req, res) => {
  try {
    const response = await sendMessage();
    res.json({ response });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

router.get("/evaluate", async (req, res) => {
  try {
    const response = await evaluate();
    res.json({ response });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
