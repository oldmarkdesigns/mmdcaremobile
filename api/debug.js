import { loadTransfers } from './storage.js';

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
    
    console.log('=== DEBUG ENDPOINT ===');
    console.log('Requested transfer ID:', transferId);
    
    // Load transfers from persistent storage
    const transfers = loadTransfers();
    console.log('All transfer IDs:', Object.keys(transfers));
    console.log('Storage size:', Object.keys(transfers).length);
    
    if (transferId) {
      const transfer = transfers[transferId];
      console.log('Specific transfer:', transfer);
      
      res.status(200).json({
        transferId,
        transfer,
        allTransfers: Object.entries(transfers),
        globalStateSize: Object.keys(transfers).length
      });
    } else {
      res.status(200).json({
        allTransfers: Object.entries(transfers),
        globalStateSize: Object.keys(transfers).length
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
