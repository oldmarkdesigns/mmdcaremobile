export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const { transferId } = req.query;
    
    console.log('Files API called with transferId:', transferId);
    
    if (!transferId) {
      return res.status(400).json({ error: 'No transfer ID provided' });
    }

    // Initialize global state if needed
    if (!global.__mmd_transfers) {
      global.__mmd_transfers = new Map();
      console.log('Initialized global transfers map');
    }

    let transfer = global.__mmd_transfers.get(transferId);
    console.log('Found transfer:', transfer);
    console.log('All transfers:', Array.from(global.__mmd_transfers.keys()));
    
    if (!transfer) {
      console.log('Transfer not found for ID:', transferId, '- creating new transfer record');
      // Create a new transfer record if it doesn't exist (for serverless compatibility)
      transfer = {
        status: 'open',
        files: [],
        createdAt: Date.now()
      };
      global.__mmd_transfers.set(transferId, transfer);
      console.log('Created new transfer record for ID:', transferId);
    }

    const response = {
      transferId,
      status: transfer.status,
      files: transfer.files || []
    };
    
    console.log('Returning files response:', response);
    res.status(200).json(response);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
