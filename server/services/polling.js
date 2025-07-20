import { respond } from "../controllers/firebaseAPI.js";
import { db } from "../firebaseAdmin.js";

async function checkAndProcessResponses() {
  try {
    const flagRef = db.collection("flag").doc("3jEjJlYrIwSeLjGVvdGz");

    // Get flag status
    const flagDoc = await flagRef.get();
    const flagData = flagDoc.data();

    console.log(flagData);

    if (!flagData.respond) {
      // Set flag to true before processing
      await flagRef.update({ respond: true });

      // Run respond function
      await respond();

      // Set flag back to false after completion
      await flagRef.update({ respond: false });
    }
  } catch (error) {
    console.error("Error in response polling:", error);
    // Make sure flag is reset even if there's an error
    const flagRef = db.collection("flag").doc("3jEjJlYrIwSeLjGVvdGz");
    await flagRef.update({ respond: false });
  }
}

export async function setPollingFlag(value) {
  try {
    const flagRef = db.collection("flag").doc("3jEjJlYrIwSeLjGVvdGz");
    await flagRef.update({ respond: value });
    console.log(`Polling flag set to: ${value}`);
  } catch (error) {
    console.error("Error setting polling flag:", error);
  }
}

export async function getPollingFlag() {
  try {
    const flagRef = db.collection("flag").doc("3jEjJlYrIwSeLjGVvdGz");
    const flagDoc = await flagRef.get();

    if (!flagDoc.exists) {
      console.error("Flag document does not exist");
      return null;
    }

    const flagData = flagDoc.data();
    return flagData.respond;
  } catch (error) {
    console.error("Error getting polling flag:", error);
    return null;
  }
}

// Start the polling
const pollInterval = 5000; // 5 seconds
setInterval(checkAndProcessResponses, pollInterval);

export { checkAndProcessResponses };
