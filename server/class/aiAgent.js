class AIAgent {
  constructor(agentId, personality) {
    this.agentId = agentId;
    this.personality = personality;
  }

  respondToMessage(message) {
    console.log(`Agent ${this.agentId} responds to message:`, message);
  }

  sendMessage(recipient, message) {
    console.log(
      `Agent ${this.agentId} is sending message to ${recipient}:`,
      message
    );
  }

  setBio(bio) {
    console.log(bio);
  }
}
