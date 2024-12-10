import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { GameStateManager } from './gameStateManager.js';
import { ensureDirectory } from './utils/fileUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function startServer() {
  try {
    // Ensure data directories exist
    const srcDataDir = join(__dirname, '..', 'src', 'data');
    const distDataDir = join(__dirname, '..', 'dist', 'data');
    
    await Promise.all([
      ensureDirectory(srcDataDir),
      ensureDirectory(distDataDir)
    ]);

    const app = express();
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
      cors: {
        origin: "https://finditfirst.xyz",
        methods: ["GET", "POST"]
      }
    });

    // Serve static files from the dist directory
    app.use(express.static(join(__dirname, '../dist')));

    const gameStateManager = new GameStateManager();
    
    // Initialize game state before setting up socket handlers
    await gameStateManager.initialize();

    io.on('connection', (socket) => {
      console.log('[server/index.js:io.connection] Client connected');

      socket.on('requestNewGame', async () => {
        try {
          const gameData = await gameStateManager.createNewGame();
          socket.emit('gameData', gameData);
        } catch (error) {
          console.error('[server/index.js:requestNewGame] Error handling requestNewGame:', error);
          socket.emit('error', { message: 'Failed to create new game' });
        }
      });

      socket.on('requestNextLevel', async (currentLevel) => {
        try {
          const nextLevelData = await gameStateManager.getNextLevel(currentLevel);
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