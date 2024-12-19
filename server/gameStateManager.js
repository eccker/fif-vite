import { readJsonFile } from './utils/fileUtils.js';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { GameSpaceGenerator } from './services/gameSpaceGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class GameStateManager {
  constructor() {
    this.gameSpaceGenerator = new GameSpaceGenerator();
  }

  async generateSequences(level = 6) {
    try {
      console.log(
        '[gameStateManager.js:generateSequences] Generating new sequences...'
      );
      const dataDir = join(__dirname, 'data');
      console.log(
        '[gameStateManager.js:generateSequences] Data directory:',
        dataDir
      );

      console.log(
        '[gameStateManager.js:generateSequences] Generating game space...'
      );
      const gameSpace = await this.gameSpaceGenerator.generateGameSpace(level);

      console.log(
        '[gameStateManager.js:generateSequences] Processing image files...'
      );
      const imageUrls = await this.gameSpaceGenerator.processImageFiles(
        dataDir
      );

      console.log(
        '[gameStateManager.js:generateSequences] Sequences generated successfully'
      );
      return { gameSpace, imageUrls };
    } catch (error) {
      console.error(
        '[gameStateManager.js:generateSequences] Error generating sequences:',
        error
      );
      throw error;
    }
  }

  async createNewGame(levels) {
    console.log('[gameStateManager.js:createNewGame] Creating new game...');
    const { gameSpace, imageUrls } = await this.generateSequences(levels);

    return {
      deckSamples: gameSpace,
      imageUrls: imageUrls,
      currentLevel: 0,
    };
  }

  async getNextLevel(currentLevel, levels) {
    console.log('***********[gameStateManager.js:getNextLevel] Getting next level...');
    const { gameSpace } = await this.generateSequences(levels);

    const nextLevel = currentLevel + 1;
    if (nextLevel >= gameSpace.length) {
      return null;
    }

    return {
      level: nextLevel,
      levelData: gameSpace[nextLevel],
    };
  }
}
