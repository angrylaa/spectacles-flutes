import express from 'express';
import cors from 'cors';
import { createPlayer, getPlayer, postMessage } from './controllers/firebaseAPI.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/player', createPlayer);
app.get('/player/:playerId', getPlayer);
app.post('/message', postMessage);

app.listen(3000, () => {
    console.log('Server running on http://localhost:5713');
});
