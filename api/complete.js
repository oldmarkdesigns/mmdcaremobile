// Vercel API route for completing transfers
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

// In-memory completion flags (best-effort within single instance)
if (!global.__mmd_completed) {
  global.__mmd_completed = new Set();
}

if (req.method === 'GET') {
  const { transferId } = req.query;
  if (!transferId) return res.status(400).json({ error: 'No transfer ID provided' });
  const closed = global.__mmd_completed.has(transferId);
  return res.status(200).json({ status: closed ? 'closed' : 'open' });
}

if (req.method === 'POST') {
    const { transferId } = req.query;
    
    if (!transferId) {
      return res.status(400).json({ error: 'No transfer ID provided' });
    }

    // Log completion for debugging
    console.log('Transfer completed:', transferId);

  // Mark as completed in-memory
  try { global.__mmd_completed.add(transferId); } catch {}

  // Update shared storage for cross-app communication
  try {
    const res = await fetch('https://api.jsonbin.io/v3/b/65c8a4b8dc74654018a8b8b4', {
      method: 'GET',
      headers: {
        'X-Master-Key': '$2a$10$8K1p/a0dL1pK1p/a0dL1pK1p/a0dL1pK1p/a0dL1pK1p/a0dL1pK1p/a0dL1pK'
      }
    });
    
    if (res.ok) {
      const data = await res.json();
      const transfers = data.record || {};
      transfers[transferId] = 'completed';
      
      await fetch('https://api.jsonbin.io/v3/b/65c8a4b8dc74654018a8b8b4', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': '$2a$10$8K1p/a0dL1pK1p/a0dL1pK1p/a0dL1pK1p/a0dL1pK1p/a0dL1pK1p/a0dL1pK'
        },
        body: JSON.stringify(transfers)
      });
    }
  } catch (e) {
    console.warn('Failed to update shared storage:', e);
  }

    res.status(204).end();
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
