import { v4 as uuidv4 } from "uuid";
import { db } from "../firebaseAdmin.js";

export async function postCreateMessage(data) {
  console.log("POST DATA");
  const { senderId, recipientId, content } = data;

  try {
    const messageId = uuidv4();
    const messageData = {
      messageId,
      senderId,
      recipientId,
      content,
      unread: true,
      timestamp: Date.now(),
    };

    await db.collection("messages").doc(messageId).set(messageData);

    return { success: true };
  } catch (error) {
    res.status(500).send({ error: "Failed save message", details: error });
  }
}

export async function fetchUnreadMessages() {
  try {
    const messages = await db.collection("messages").get();

    if (messages.empty) {
      return [];
    }

    const allMessages = messages.docs.map((doc) => ({
      ...doc.data(),
    }));

    return findUnread(allMessages);
  } catch (error) {
    throw new Error(`Failed to fetch messages: ${error.message}`);
  }
}

const findUnread = (allMessages) => {
  const relevantMessages = allMessages.filter(
    (msg) => msg.unread === true && msg.senderId !== ""
  );

  return relevantMessages;
};

export async function fetchChatHistory(senderId, recipientId) {
  try {
    const messages = await db.collection("messages").get();

    if (messages.empty) {
      return [];
    }

    const allMessages = messages.docs.map((doc) => ({
      ...doc.data(),
    }));

    console.log(allMessages);

    return helperFilter(allMessages, senderId, recipientId);
  } catch (error) {
    throw new Error(`Failed to fetch messages: ${error.message}`);
  }
}

const helperFilter = (allMessages, senderId, recipientId) => {
  const relevantMessages = allMessages.filter(
    (msg) =>
      (msg.senderId === senderId && msg.recipientId === recipientId) ||
      (msg.senderId === recipientId && msg.recipientId === senderId)
  );

  console.log(senderId, recipientId);

  return relevantMessages;
};

export async function updateMessageReadStatus(messageId) {
  try {
    const messageRef = db.collection("messages").doc(messageId);
    const message = await messageRef.get();

    if (!message.exists) {
      throw new Error(`Message with ID ${messageId} not found`);
    }

    await messageRef.update({
      unread: false,
    });

    return {
      success: true,
      message: `Message ${messageId} marked as read`,
    };
  } catch (error) {
    throw new Error(`Failed to update message: ${error.message}`);
  }
}

export async function deleteAllMessagesExceptOne() {
  try {
    // Delete messages
    const messages = await db
      .collection("messages")
      .orderBy("timestamp", "desc")
      .get();

    // Delete players
    const players = await db
      .collection("players")
      .orderBy("messageCount", "desc")
      .get();

    // Delete sessions
    const sessions = await db
      .collection("gameSessions")
      .orderBy("gameStage", "desc")
      .get();

    const batch = db.batch();
    const counts = {
      messages: 0,
      players: 0,
      sessions: 0,
    };

    // Process messages
    let isFirst = true;
    messages.docs.forEach((doc) => {
      if (isFirst) {
        isFirst = false;
        return;
      }
      batch.delete(doc.ref);
      counts.messages++;
    });

    // Process players
    isFirst = true;
    players.docs.forEach((doc) => {
      if (isFirst) {
        isFirst = false;
        return;
      }
      batch.delete(doc.ref);
      counts.players++;
    });

    // Process sessions
    isFirst = true;
    sessions.docs.forEach((doc) => {
      if (isFirst) {
        isFirst = false;
        return;
      }
      batch.delete(doc.ref);
      counts.sessions++;
    });

    // Commit all deletions in one batch
    await batch.commit();

    return {
      success: true,
      deletedCounts: counts,
      message: `Deleted ${counts.messages} messages, ${counts.players} players, ${counts.sessions} sessions. Kept 1 of each.`,
    };
  } catch (error) {
    throw new Error(`Failed to delete collections: ${error.message}`);
  }
}
