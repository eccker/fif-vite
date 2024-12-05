import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { generateGameState } from './utils/gameState.js';
import { handleMatchCards } from './utils/matchHandler.js';
import { GameManager } from './utils/GameManager.js';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "https://finditfirst.xyz",
    methods: ["GET", "POST"]
  }
});

const gameManager = new GameManager();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join the game room
  socket.join('game-room');

  // Send current game state if exists
  const currentGame = gameManager.getCurrentGame();
  if (currentGame) {
    socket.emit('gameState', currentGame);
  }

  socket.on('startGame', () => {
    const newGameState = gameManager.startNewGame();
    io.to('game-room').emit('gameState', newGameState);
  });

  socket.on('matchCards', ({ topCardId, bottomCardId }) => {
    console.log(`socket on matchCards: ${topCardId}, ${bottomCardId}`)
    const updatedState = gameManager.handleCardMatch(topCardId, bottomCardId);
    if (updatedState) {
      io.to('game-room').emit('gameState', updatedState);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});