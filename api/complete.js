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

  // Mark transfer as completed in memory for GET requests
  try { global.__mmd_completed.add(transferId); } catch {}

    res.status(204).end();
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
