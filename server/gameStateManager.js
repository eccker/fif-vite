import { readJsonFile } from './utils/fileUtils.js';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { GameSpaceGenerator } from './services/gameSpaceGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class GameStateManager {
  constructor() {
    this.deckSamples = null;
    this.imageUrls = null;
    this.gameSpaceGenerator = new GameSpaceGenerator();
  }

  async generateSequences(level = 100) {
    try {
      console.log('[gameStateManager.js:generateSequences] Generating new sequences...');
      const dataDir = join(__dirname, '..', 'data');
      console.log('[gameStateManager.js:generateSequences] Data directory:', dataDir);
      
      console.log('[gameStateManager.js:generateSequences] Generating game space...');
      await this.gameSpaceGenerator.generateGameSpace(level);
      
      console.log('[gameStateManager.js:generateSequences] Processing image files...');
      await this.gameSpaceGenerator.processImageFiles(dataDir);
      
      console.log('[gameStateManager.js:generateSequences] Sequences generated successfully');
    } catch (error) {
      console.error('[gameStateManager.js:generateSequences] Error generating sequences:', error);
      throw error;
    }
  }

  async initialize() {
    try {
      console.log('[gameStateManager.js:initialize] Initializing game state...');
      
      // Generate new sequences first
      await this.generateSequences();

      // Read the newly generated files from dist/data
      const distDataDir = join(__dirname, '..', 'dist', 'data');
      console.log('[gameStateManager.js:initialize] Reading game files from:', distDataDir);
      
      const [deckSamplesData, imageUrlsData] = await Promise.all([
        readJsonFile(join(distDataDir, 'deckSamples.json')),
        readJsonFile(join(distDataDir, 'imageUrls.json'))
      ]);

      this.deckSamples = deckSamplesData;
      this.imageUrls = imageUrlsData;

      console.log('[gameStateManager.js:initialize] Game state initialized successfully');
      console.log(`[gameStateManager.js:initialize] Loaded ${this.deckSamples.length} levels`);
      console.log(`[gameStateManager.js:initialize] Loaded ${this.imageUrls.images.length} images`);
    } catch (error) {
      console.error('[gameStateManager.js:initialize] Error initializing game state:', error);
      throw error;
    }
  }

  async createNewGame() {
    if (!this.deckSamples || !this.imageUrls) {
      await this.initialize();
    }
    
    return {
      deckSamples: this.deckSamples,
      imageUrls: this.imageUrls,
      currentLevel: 0
    };
  }

  async getNextLevel(currentLevel) {
    if (!this.deckSamples || !this.imageUrls) {
      await this.initialize();
    }

    const nextLevel = currentLevel + 1;
    if (nextLevel >= this.deckSamples.length) {
      return null;
    }

    return {
      level: nextLevel,
      levelData: this.deckSamples[nextLevel]
    };
  }
}