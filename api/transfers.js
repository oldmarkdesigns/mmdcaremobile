// Vercel API route for creating transfer sessions
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
    // Initialize global state if needed
    if (!global.__mmd_transfers) {
      global.__mmd_transfers = new Map();
    }

    // Generate a unique transfer ID
    const transferId = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);
    
    // Create transfer record
    global.__mmd_transfers.set(transferId, {
      status: 'open',
      files: [],
      createdAt: Date.now()
    });
    
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
