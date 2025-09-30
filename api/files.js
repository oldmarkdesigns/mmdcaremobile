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
    
    if (!transferId) {
      return res.status(400).json({ error: 'No transfer ID provided' });
    }

    // Initialize global state if needed
    if (!global.__mmd_transfers) {
      global.__mmd_transfers = new Map();
    }

    const transfer = global.__mmd_transfers.get(transferId);
    
    if (!transfer) {
      return res.status(404).json({ error: 'Transfer not found' });
    }

    res.status(200).json({
      transferId,
      status: transfer.status,
      files: transfer.files || []
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
