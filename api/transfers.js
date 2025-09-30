// Vercel API route for creating transfer sessions
import { loadTransfers, saveTransfers } from './storage.js';

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    // Load existing transfers
    const transfers = loadTransfers();

    // Generate a unique transfer ID
    const transferId = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);
    
    // Create transfer record
    transfers[transferId] = {
      status: 'open',
      files: [],
      createdAt: Date.now()
    };
    
    // Save to persistent storage
    saveTransfers(transfers);
    
    // Log transfer creation for debugging
    console.log('Transfer created:', transferId);

    res.status(201).json({
      transferId: transferId,
      expiresInSec: 900
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
