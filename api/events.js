// Vercel API route for Server-Sent Events
// Simple in-memory SSE registry (best-effort within a single serverless instance)
if (!global.__mmd_sse_clients) {
  global.__mmd_sse_clients = new Map(); // transferId -> Set(res)
}

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const { transferId } = req.query;
    
    // Set up Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    // Register client
    const set = global.__mmd_sse_clients.get(transferId) || new Set();
    set.add(res);
    global.__mmd_sse_clients.set(transferId, set);

    // Send initial status
    res.write(`data: ${JSON.stringify({ type: "status", status: "open" })}\n\n`);

    // Keep connection alive with periodic pings
    const interval = setInterval(() => {
      try {
        res.write(`data: ${JSON.stringify({ type: "ping", timestamp: Date.now() })}\n\n`);
      } catch (error) {
        clearInterval(interval);
      }
    }, 30000); // Ping every 30 seconds

    // Clean up on disconnect
    req.on('close', () => {
      clearInterval(interval);
      const s = global.__mmd_sse_clients.get(transferId);
      if (s) {
        s.delete(res);
        if (s.size === 0) global.__mmd_sse_clients.delete(transferId);
      }
    });

    // Note: In a real implementation, you'd want to use a more sophisticated
    // event system like Redis or WebSockets for real-time updates
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
