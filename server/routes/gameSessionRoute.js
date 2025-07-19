import express from 'express';
import { startGame, updateNoOfPlayers, deleteGameSession } from '../controllers/firebaseAPI.js';

const router = express.Router();

// POST 
router.post('/', startGame);

// PATCH (uhh or POST??) update number of players in a game session 
router.patch('/update-players', updateNoOfPlayers);

// DELETE 
router.delete('/:gameId', deleteGameSession);

export default router;
