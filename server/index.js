import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { GameStateManager } from './gameStateManager.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function startServer() {
  try {

    const app = express();
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
      cors: {
        // origin: "http://localhost:3000",
        origin: "https://finditfirst.xyz",
        methods: ["GET", "POST"]
      }
    });

    // Serve static files from the dist directory
    app.use(express.static(join(__dirname, '../dist')));

    const gameStateManager = new GameStateManager();

    io.on('connection', (socket) => {
      console.log('[server/index.js:io.connection] Client connected');
      // socket.emit('gameData', { deckSamples: [], imageUrls: [], currentLevel: 0 });
      socket.on('requestNewGame', async (levels) => {
        console.log('[server/index.js:requestNewGame] New Game Requested');

        try {
          const gameData = await gameStateManager.createNewGame(levels);
          console.log(`type of gameData: ${typeof gameData}`);
          // console.log(`gameData: ${JSON.stringify(gameData)}`);
          console.log(`gameData: ${gameData.length}`);
          const stringifiedGameData = JSON.stringify(gameData);
          const gameDataByteSize = new TextEncoder().encode(stringifiedGameData).length;
          console.log(`gameData byte size: ${gameDataByteSize}`);
          socket.emit('gameData', gameData);
          // socket.emit('gameData', { deckSamples: [1,2,3,4], imageUrls: {"images":["https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE0NDJ8MHwxfHNlYXJjaHw2fHxzb2xpZHxlbnwwfDB8fHwxNjM5Mjc2Mjc5&ixlib=rb-1.2.1&q=80&w=200"]}, currentLevel: 0 });

        } catch (error) {
          console.error('[server/index.js:requestNewGame] Error handling requestNewGame:', error);
          socket.emit('error', { message: 'Failed to create new game' });
        }
      });

      socket.on('requestNextLevel', async (currentLevel, levels) => {
        try {
          const nextLevelData = await gameStateManager.getNextLevel(currentLevel, levels);
          socket.emit('nextLevelData', nextLevelData);
        } catch (error) {
          console.error('[server/index.js:requestNextLevel] Error handling requestNextLevel:', error);
          socket.emit('error', { message: 'Failed to get next level' });
        }
      });

      socket.on('disconnect', () => {
        console.log('[server/index.js:io.disconnect] Client disconnected');
      });
    });

    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
      console.log(`[server/index.js:startServer] Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('[server/index.js:startServer] Failed to start server:', error);
    process.exit(1);
  }
}

startServer();