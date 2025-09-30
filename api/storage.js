import fs from 'fs';
import path from 'path';

const STORAGE_FILE = '/tmp/transfers.json';

// Global in-memory fallback for serverless environments
if (!global.__mmd_transfers_memory) {
  global.__mmd_transfers_memory = {};
}

// Helper functions for persistent storage with fallback
function loadTransfers() {
  try {
    // Try to load from file first
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf8');
      const fileData = JSON.parse(data);
      console.log('Loaded transfers from file:', Object.keys(fileData));
      
      // Also update in-memory fallback
      global.__mmd_transfers_memory = fileData;
      return fileData;
    }
  } catch (error) {
    console.error('Error loading transfers from file:', error);
  }
  
  // Fallback to in-memory storage
  console.log('Using in-memory fallback storage:', Object.keys(global.__mmd_transfers_memory));
  return global.__mmd_transfers_memory;
}

function saveTransfers(transfers) {
  try {
    // Save to file
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(transfers, null, 2));
    console.log('Transfers saved to file');
    
    // Also update in-memory fallback
    global.__mmd_transfers_memory = transfers;
    console.log('Transfers also saved to memory fallback');
  } catch (error) {
    console.error('Error saving transfers to file:', error);
    
    // Fallback to in-memory storage only
    global.__mmd_transfers_memory = transfers;
    console.log('Transfers saved to memory fallback only');
  }
}

export { loadTransfers, saveTransfers };
