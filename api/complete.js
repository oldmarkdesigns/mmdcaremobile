// Vercel API route for completing transfers
import { loadTransfers, saveTransfers } from './storage.js';

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

if (req.method === 'GET') {
  const { transferId } = req.query;
  if (!transferId) return res.status(400).json({ error: 'No transfer ID provided' });
  
  // Load transfers from persistent storage
  const transfers = loadTransfers();
  const transfer = transfers[transferId];
  const closed = transfer && transfer.status === 'closed';
  
  return res.status(200).json({ status: closed ? 'closed' : 'open' });
}

if (req.method === 'POST') {
    const { transferId } = req.query;
    
    if (!transferId) {
      return res.status(400).json({ error: 'No transfer ID provided' });
    }

    // Log completion for debugging
    console.log('Transfer completed:', transferId);

    // Load transfers from persistent storage
    const transfers = loadTransfers();
    const transfer = transfers[transferId];
    
    if (transfer) {
      transfer.status = 'closed';
      transfers[transferId] = transfer;
      saveTransfers(transfers);
      console.log('Updated transfer status to closed for:', transferId);
    } else {
      console.log('Transfer not found for completion:', transferId);
    }

    res.status(204).end();
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
