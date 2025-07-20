import { sendMessage } from "../controllers/apiRequest.js";

export default class AIAgent {
  constructor(agentId) {
    this.agentId = agentId;
  }

  // loop allowing the AI to continuously poll for messages
  async pollMessages() {
    while (true) {}
  }

  // function that allows for a delay before responding
  async respondToMessage(message) {
    await delay(Math.random() * 2000);
    const response = await respondToMessage(message);
  }

  // send message is called whenever the AI initiates a conversation
  async sendMessage() {
    const response = await sendMessage();
    console.log(response);
    return response;
  }

  setBio(bio) {
    console.log(bio);
  }
}
