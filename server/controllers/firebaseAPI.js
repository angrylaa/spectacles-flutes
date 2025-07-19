import { db } from '../firebaseAdmin.js'
import { v4 as uuidv4 } from 'uuid';

// create player
/**
 * return {Object} playerNode
 * playerNode format:
 * {
 *   playerId: String,  
 *   numOfVotes: Number,
 *   gameId: Number,
 */
export async function createPlayer(req, res) {
	const { gameId } = req.body;
	const gameRef = db.collection('gameSessions').doc(gameId);
	const gamesesh = await gameRef.get();

	if (!gamesesh.exists) {
		return res.status(404).send({ error: `Game session with ID ${gameId} not found` });
	}

	const gameData = gamesesh.data();

	if (gameData.noOfPlayers >= 2) {
		return res.status(400).send({ error: 'Game is full. Maximum 2 players allowed. Consider starting a new game!' });
	}
	
	try {
		const playerId = uuidv4();
		const playerData = {
			playerId,
			numOfVotes: 0,
			gameId,
			bio: "",
			noMessagesSent: 0
		};

		await db.collection('players').doc(playerId).set(playerData);

		await gameRef.update({
			noOfPlayers: gameData.noOfPlayers + 1
		});

		res.send({ success: true, player: playerData });
		
	} catch (error) {
		res.status(500).send({ error: 'Failed to create player', details: error });
	}
}
// /**
//  * 
//  * @param {Number} playerId 
//  * @param {String} bioText 
//  */
// export async function postPlayerBio(playerId, bioText){

// }
export async function getPlayer(req, res) {
	const { playerId } = req.params;

	try {
		const playerSnap = await db.collection('players').doc(playerId).get();
		if (!playerSnap.exists) {
		return res.status(404).send({ error: 'Player not found' });
		}

		res.send({ success: true, player: playerSnap.data() });
	} catch (error) {
		res.status(500).send({ error: 'Failed to retrieve player', details: error });
	}
}

export async function deletePlayer(req, res){
	const playerId = req.params.playerId;
	try {
		const player = await db.collection('players').doc(playerId).delete();
		res.send({ success: true, message: `Player ${playerId} successfully deleted.` });
	} catch (error) {
		res.status(500).send({ error: 'Failed to delete player', details: error });
	}

}

export async function postEditPlayer(req, res){
	const { playerId, field, val } = req.body;
	if(!playerId || !field || typeof val === 'undefined' ){
		return res.status(400).send({ error: 'One of missing playerId, field, or val in request. Please correct' });
	}

	try{
		const playerRef = db.collection('players').doc(playerId);

		const playerItem = await playerRef.get();
		if (!playerItem.exists) {
			return res.status(404).send({ error: 'Player not found' });
		}

		await playerRef.update({
			[field]: val
		});

		res.send({ success: true, message: `Player ${playerId} updated`, updatedField: field, newValue: val });

	} catch (error){
		res.status(500).send({ error: 'Failed to update player', details: error.message });
	}

}


// message methods

export async function postCreateMessage(req, res) {
	const { senderId, recipientId, content } = req.body;
	const created_at = new Date();
	try {
		const messageId = uuidv4();
		const messageData = {
			messageId,
			senderId,
			recipientId,
			content,
			created_at
		};

		await db.collection('messages').doc(messageId).set(messageData);

		res.send({ success: true, message: messageData });
	} catch (error) {
		res.status(500).send({ error: 'Failed save message', details: error });
	}
}

export async function getMessagesFromPlayer(req, res) {
	const { targetPlayerId, senderPlayerId } = req.params;

	if (!targetPlayerId || !senderPlayerId) {
		return res.status(400).send({ error: 'Missing targetPlayerId or senderPlayerId in request. Please try again with valid params' });
	}

	try {
		const messagesRef = db.collection('messages');
		
		const snapshot = await messagesRef.where('recipientId', '==', targetPlayerId)
			.where('senderId', '==', senderPlayerId)
			.get();

		const messages = [];
			snapshot.forEach(doc => {
			messages.push(doc.data());
		});

		res.send({ success: true, messages });
	} catch (error) {
		res.status(500).send({ error: 'Failed to retrieve all messages', details: error.message });
	}
}

// game methods

// POST
// start a game before anything
export async function startGame(req, res){
	try {
		const gameId = uuidv4();
		const gameSessionData = {
			gameId,
			gameStage: 0,
			noOfPlayers: 0,
		};

		await db.collection('gameSessions').doc(gameId).set(gameSessionData);

		res.send({ success: true, gameSession: gameSessionData });
	} catch (error) {
		res.status(500).send({ error: 'Failed to create a game session', details: error });
	}
}

export async function updateNoOfPlayers(req, res){
	const { gameId, updatednoofplayer } = req.body;
	if(!updatednoofplayer && updatednoofplayer !== 0){
		return res.status(400).send({ error: " 'updatednoofplayer' is missing. Please correct request with valid params" });
	}
	try{
		const gameRef = db.collection('gameSessions').doc(gameId);
		const gameItem = await gameRef.get();
		if (!gameItem.exists) {
			return res.status(404).send({ error: `Game session with ID ${gameId} was not found.`});
		}

		await gameRef.update({ noOfPlayers: updatednoofplayer });

		res.send({ success: true, message: `Number of players in game ${gameId} has been updated. `, newNoofPlayers: updatednoofplayer});

	} catch (error){
		res.status(500).send({ error: 'Failed to update number of player', details: error.message });
	}
}

export async function deleteGameSession(req, res){
	const gameId = req.params.gameId;
	try {
		const gameSesh = await db.collection('gameSessions').doc(gameId).delete();
		res.send({ success: true, message: `Game session ID ${gameId} successfully deleted.` });
	} catch (error) {
		res.status(500).send({ error: 'Failed to delete game session', details: error });
	}
}

// prompt method

export async function getPrompt(req, res) {
	try {
		const prompts = await db.collection('prompts').limit(1).get();
		if (prompts.empty) {
			return res.status(404).send({ error: 'Uh no prompts found ' });
		}

		const promptDoc = prompts.docs[0];
		const promptData = promptDoc.data();

		res.send({ success: true, prompt: promptData.content });
	} catch (error) {
		res.status(500).send({ error: 'Failed to get prompt', details: error.message });
	}
}
