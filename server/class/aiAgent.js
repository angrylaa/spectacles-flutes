import { sendMessage } from "../controllers/apiRequest.js";

export default class AIAgent {
  constructor(agentId) {
    this.agentId = agentId;
  }

  async respondToMessage(message) {
    await delay(Math.random() * 2000);
    const response = await respondToMessage(message);
  }

  async sendMessage() {
    const response = await sendMessage();
    console.log(response);
    return response;
  }

  setBio(bio) {
    console.log(bio);
  }
}
