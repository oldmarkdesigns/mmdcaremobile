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
  
  console.log('=== COMPLETION GET REQUEST ===');
  console.log('Transfer ID:', transferId);
  
  if (!transferId) {
    console.log('No transfer ID provided for GET');
    return res.status(400).json({ error: 'No transfer ID provided' });
  }
  
  try {
    // Load transfers from persistent storage
    const transfers = loadTransfers();
    console.log('Loaded transfers for GET:', Object.keys(transfers));
    
    const transfer = transfers[transferId];
    console.log('Found transfer for GET:', transfer);
    
    const closed = transfer && transfer.status === 'closed';
    const status = closed ? 'closed' : 'open';
    
    console.log('Returning status:', status);
    return res.status(200).json({ status });
  } catch (error) {
    console.error('GET completion error:', error);
    return res.status(500).json({ error: 'GET failed', message: error.message });
  }
}

if (req.method === 'POST') {
    const { transferId } = req.query;
    
    console.log('=== COMPLETION POST REQUEST ===');
    console.log('Transfer ID:', transferId);
    console.log('Request headers:', req.headers);
    
    if (!transferId) {
      console.log('No transfer ID provided for completion');
      return res.status(400).json({ error: 'No transfer ID provided' });
    }

    // Log completion for debugging
    console.log('Transfer completed:', transferId);

    try {
      // Load transfers from persistent storage
      const transfers = loadTransfers();
      console.log('Loaded transfers for completion:', Object.keys(transfers));
      
      const transfer = transfers[transferId];
      console.log('Found transfer for completion:', transfer);
      
      if (transfer) {
        transfer.status = 'closed';
        transfers[transferId] = transfer;
        saveTransfers(transfers);
        console.log('Updated transfer status to closed for:', transferId);
        console.log('Final transfer object:', transfer);
      } else {
        console.log('Transfer not found for completion:', transferId);
        console.log('Available transfers:', Object.keys(transfers));
      }

      console.log('Sending 204 response for completion');
      res.status(204).end();
    } catch (error) {
      console.error('Completion error:', error);
      res.status(500).json({ error: 'Completion failed', message: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
