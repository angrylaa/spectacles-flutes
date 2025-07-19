import express from "express";
import { sendMessage } from "../controllers/apiRequest.js";

const router = express.Router();

router.get("/message-received", async (req, res) => {
  try {
    // when db gets updated,
    const response = await sendMessage();
    res.json({ response });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
