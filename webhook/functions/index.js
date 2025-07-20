/**
 * Modern Firebase Function for Firestore document changes
 * Triggers webhook when documents are created, updated, or deleted
 */

const {
  onDocumentWritten,
  onDocumentCreated,
  onDocumentUpdated,
} = require("firebase-functions/v2/firestore");
const { logger } = require("firebase-functions");

exports.conversationPhaseWebhook = onDocumentUpdated(
  "gameSessions/{gameId}",
  async (event) => {
    const { data, params } = event;
    const beforeData = data.before.data();
    const afterData = data.after.data();

    // Only trigger webhook when gameStage changes to 1
    if (beforeData.gameStage !== 1 && afterData.gameStage === 1) {
      const payload = {
        gameId: params.gameId,
      };

      try {
        const response = await fetch(
          "https://a288d8b56beb.ngrok-free.app/game-sessions/conversation-phase",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Webhook failed: ${response.status} ${response.statusText}`
          );
        }

        const responseData = await response.text();
        logger.info("Conversation phase webhook success", {
          gameId: params.gameId,
          response: responseData,
        });
      } catch (error) {
        logger.error("Conversation phase webhook error", {
          gameId: params.gameId,
          error: error.message,
        });
      }
    } else if (beforeData.gameStage !== 2 && afterData.gameStage === 2) {
      const payload = {
        gameId: params.gameId,
      };

      try {
        const response = await fetch(
          "https://a288d8b56beb.ngrok-free.app/game-sessions/voting-phase",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Webhook failed: ${response.status} ${response.statusText}`
          );
        }

        const responseData = await response.text();
        logger.info("Conversation phase webhook success", {
          gameId: params.gameId,
          response: responseData,
        });
      } catch (error) {
        logger.error("Conversation phase webhook error", {
          gameId: params.gameId,
          error: error.message,
        });
      }
    }
  }
);
