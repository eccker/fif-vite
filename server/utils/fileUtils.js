import { promises as fs } from 'fs';
import { join } from 'path';

export async function ensureDirectory(dir) {
  try {
    console.log(`[fileUtils.js:ensureDirectory] Creating directory if not exists: ${dir}`);
    await fs.mkdir(dir, { recursive: true });
    console.log(`[fileUtils.js:ensureDirectory] Directory ready: ${dir}`);
  } catch (error) {
    console.error(`[fileUtils.js:ensureDirectory] Error creating directory ${dir}:`, error);
    throw error;
  }
}

export async function writeJsonFile(filePath, data) {
  try {
    console.log(`[fileUtils.js:writeJsonFile] Writing file: ${filePath}`);
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, jsonString, 'utf8');
    
    // Verify the file was written
    const stats = await fs.stat(filePath);
    console.log(`[fileUtils.js:writeJsonFile] File written successfully: ${filePath} (${stats.size} bytes)`);
    
    // Read back the file to verify content
    const content = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(content);
    console.log(`[fileUtils.js:writeJsonFile] File content verified: ${filePath}`);
    return parsed;
  } catch (error) {
    console.error(`[fileUtils.js:writeJsonFile] Error writing file ${filePath}:`, error);
    throw error;
  }
}

export async function readJsonFile(filePath) {
  try {
    console.log(`[fileUtils.js:readJsonFile] Reading file: ${filePath}`);
    const data = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(data);
    console.log(`[fileUtils.js:readJsonFile] File read successfully: ${filePath}`);
    return parsed;
  } catch (error) {
    console.error(`[fileUtils.js:readJsonFile] Error reading file ${filePath}:`, error);
    throw error;
  }
}

export async function readDirectory(dir) {
  try {
    console.log(`[fileUtils.js:readDirectory] Reading directory: ${dir}`);
    const files = await fs.readdir(dir);
    console.log(`[fileUtils.js:readDirectory] Directory read successfully: ${dir}, found ${files.length} files`);
    return files;
  } catch (error) {
    console.error(`[fileUtils.js:readDirectory] Error reading directory ${dir}:`, error);
    throw error;
  }
}