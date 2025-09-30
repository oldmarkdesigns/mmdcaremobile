import fs from 'fs';
import path from 'path';

const STORAGE_FILE = '/tmp/transfers.json';

// Helper functions for persistent storage
function loadTransfers() {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading transfers:', error);
  }
  return {};
}

function saveTransfers(transfers) {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(transfers, null, 2));
    console.log('Transfers saved to file');
  } catch (error) {
    console.error('Error saving transfers:', error);
  }
}

export { loadTransfers, saveTransfers };
