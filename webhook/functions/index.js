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

// Option 1: Trigger on any document write (create, update, delete) in gameSessions collection
exports.gameSessionWebhook = onDocumentWritten(
  "gameSessions/{gameId}",
  async (event) => {
    const { data, params } = event;

    // data.before contains the document data before the change (undefined for creates)
    // data.after contains the document data after the change (undefined for deletes)

    let eventType;
    let documentData;

    if (!data.before.exists && data.after.exists) {
      // Document was created
      eventType = "created";
      documentData = data.after.data();
    } else if (data.before.exists && !data.after.exists) {
      // Document was deleted
      eventType = "deleted";
      documentData = data.before.data();
    } else {
      // Document was updated
      eventType = "updated";
      documentData = {
        before: data.before.data(),
        after: data.after.data(),
      };
    }

    const payload = {
      eventType,
      gameId: params.gameId,
      timestamp: new Date().toISOString(),
      data: documentData,
    };

    try {
      const response = await fetch(
        "https://a288d8b56beb.ngrok-free.app/health",
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
      logger.info("Webhook success", {
        gameId: params.gameId,
        eventType,
        response: responseData,
      });
    } catch (error) {
      logger.error("Webhook error", {
        gameId: params.gameId,
        eventType,
        error: error.message,
      });
    }
  }
);
