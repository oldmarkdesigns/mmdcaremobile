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
    
    // Initialize global state if needed
    if (!global.__mmd_transfers) {
      global.__mmd_transfers = new Map();
      console.log('Initialized global transfers map in debug');
    }
    
    console.log('All transfer IDs:', Array.from(global.__mmd_transfers.keys()));
    console.log('Global state size:', global.__mmd_transfers.size);
    
    if (transferId) {
      const transfer = global.__mmd_transfers.get(transferId);
      console.log('Specific transfer:', transfer);
      
      res.status(200).json({
        transferId,
        transfer,
        allTransfers: Array.from(global.__mmd_transfers.entries()),
        globalStateSize: global.__mmd_transfers.size
      });
    } else {
      res.status(200).json({
        allTransfers: Array.from(global.__mmd_transfers.entries()),
        globalStateSize: global.__mmd_transfers.size
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
