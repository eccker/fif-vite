import { join } from 'path';
import { MatrixGenerator } from './matrixGenerator.js';
import { ensureDirectory, writeJsonFile, readDirectory, readJsonFile } from '../utils/fileUtils.js';
import { getRandomInt } from '../utils/randomUtils.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let makeSecret = (length) => {
  let result = ``
  let characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`
  let charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export class GameSpaceGenerator {
  constructor() {
    this.matrixGenerator = new MatrixGenerator(makeSecret(64));
  }

  async generateGameSpace(levels) {
    try {
      console.log('[gameSpaceGenerator.js:generateGameSpace] Starting game space generation...');
      const { matrix: generatedMatrix, times } = this.matrixGenerator.generate(levels);
      console.log(`[gameSpaceGenerator.js:generateGameSpace] Generated matrix with ${generatedMatrix.length} levels`);

      const gameSpace = generatedMatrix.slice(0, levels + 1).map((row, index) => {
        const samples = row.map(deck => ({
          topDeck: deck.slice(0, 6),
          bottomDeck: deck.slice(6, 12)
        }));

        return {
          timeLimit: times[index],
          samples
        };
      });

      console.log('[gameSpaceGenerator.js:generateGameSpace] Game space transformation completed');

      // // Ensure metadata directory exists
      // const metadataDir = join(__dirname, '..', 'metadata');
      
      // console.log('[gameSpaceGenerator.js:generateGameSpace] Creating metadata directory...');
      // await ensureDirectory(metadataDir);

      // // Write to metadata directory
      // console.log('[gameSpaceGenerator.js:generateGameSpace] Writing game space file...');
      // await writeJsonFile(join(metadataDir, 'deckSamples.json'), gameSpace);

      // console.log('[gameSpaceGenerator.js:generateGameSpace] Game space file written successfully');
      
      return gameSpace;
    } catch (error) {
      console.error('[gameSpaceGenerator.js:generateGameSpace] Error in generateGameSpace:', error);
      throw error;
    }
  }

  async processImageFiles(dataDir) {
    try {
      console.log(`[gameSpaceGenerator.js:processImageFiles] Starting image processing from directory: ${join(process.cwd(), 'server', 'data')}`);
      const images = [];
      const files = await readDirectory(join(process.cwd(), 'server', 'data'));
      console.log(`[gameSpaceGenerator.js:processImageFiles] Found ${files.length} files to process`);
      
      for (let index = 0; index < 256; index++) {
        const fileToOpen = files[getRandomInt(files.length)];
        // console.log(`[gameSpaceGenerator.js:processImageFiles] Processing file ${index + 1}/256: ${fileToOpen}`);
        const data = await readJsonFile(join(process.cwd(), 'server', 'data', fileToOpen));
        const objFromFile = data[getRandomInt(data.length)];
        images.push(objFromFile.urls.thumb);
      }

      const imageUrls = { images };
      console.log(`[gameSpaceGenerator.js:processImageFiles] Collected ${images.length} image URLs`);
      
      // // Ensure metadata directory exists
      // const metadataDir = join(__dirname, '..', 'metadata');
      
      // console.log('[gameSpaceGenerator.js:processImageFiles] Creating metadata directory...');
      // await ensureDirectory(metadataDir);

      // // Write to metadata directory
      // console.log('[gameSpaceGenerator.js:processImageFiles] Writing image URLs file...');
      // await writeJsonFile(join(metadataDir, 'imageUrls.json'), imageUrls);

      // console.log('[gameSpaceGenerator.js:processImageFiles] Image URLs file written successfully');
      
      return imageUrls;
    } catch (error) {
      console.error('[gameSpaceGenerator.js:processImageFiles] Error in processImageFiles:', error);
      throw error;
    }
  }
}