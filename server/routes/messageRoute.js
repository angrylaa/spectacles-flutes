import express from 'express';
import { postCreateMessage, getMessagesFromPlayer } from '../controllers/firebaseAPI.js';

const router = express.Router();

// POST 
router.post('/', postCreateMessage);

// GET 
// get all messages targetPlayerId has recieved from senderPlayerId
router.get('/:targetPlayerId/from/:senderPlayerId', getMessagesFromPlayer);

export default router;
