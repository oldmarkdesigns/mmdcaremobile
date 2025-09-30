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

  if (req.method === 'POST') {
    const { transferId } = req.query;
    
    if (!transferId) {
      return res.status(400).json({ error: 'No transfer ID provided' });
    }

    // Log completion for debugging
    console.log('Transfer completed:', transferId);

    res.status(204).end();
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
