// post message

import db from './firebaseAdmin.js';
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
	const { gameId, bio } = req.body;

	try {
		const playerId = uuidv4();
		const playerData = {
			playerId,
			numOfVotes: 0,
			gameId,
			bio
		};

		await db.collection('players').doc(playerId).set(playerData);

		res.send({ success: true, player: playerData });
	} catch (error) {
		res.status(500).send({ error: 'Failed to create player', details: error });
	}
}
/**
 * 
 * @param {Number} playerId 
 * @param {String} bioText 
 */
export async function postPlayerBio(playerId, bioText){

}
/**
 * 
 * @param {Number} playerId 
 */
export function getPlayer(playerId) {
  // Logic to get a player
  res.send('Player retrieved successfully');
}



/**
 * 
 * @param {Object} messageNode 
 * messageNode format:
 * {
 *   senderId: String,
 *   receiverId: String,
 *   content: String,
 *   timestamp: Date}
 */
export function postMessage(messageNode) {
  // Logic to post a message
  res.send('Message posted successfully');
}





// create game session
// get prompt
// get all player's sent and recieved messages
