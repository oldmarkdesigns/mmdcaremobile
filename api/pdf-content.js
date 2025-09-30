import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';

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
    const { transferId, filename } = req.query;
    
    if (!transferId || !filename) {
      return res.status(400).json({ error: 'Transfer ID and filename required' });
    }

    try {
      // Initialize global state if needed
      if (!global.__mmd_transfers) {
        global.__mmd_transfers = new Map();
      }

      const transfer = global.__mmd_transfers.get(transferId);
      
      if (!transfer) {
        return res.status(404).json({ error: 'Transfer not found' });
      }

      // Find the file in the transfer
      const file = transfer.files.find(f => f.name === filename);
      
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }

      // For now, return basic file info since we can't access the actual file in serverless
      // In a real implementation, you'd need to store files in a persistent storage like S3
      const parsedContent = {
        title: "Importerad Journalanteckning",
        doctor: "Dr. Okänd Läkare", 
        date: new Date(file.uploadedAt).toLocaleDateString('sv-SE'),
        summary: `Importerad fil: ${filename}`,
        content: {
          anamnes: "Innehållet kunde inte läsas från serverless miljön.",
          status: "Filen är tillgänglig men innehållet kräver persistent lagring.",
          undersokningar: "För fullständig PDF-parsing, implementera fil-lagring.",
          bedomning: "Filen har laddats upp framgångsrikt.",
          rekommendationer: "Kontakta systemadministratören för fullständig funktionalitet."
        }
      };

      res.status(200).json(parsedContent);
    } catch (error) {
      console.error('Error reading PDF:', error);
      res.status(500).json({ error: "Failed to read PDF content" });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
