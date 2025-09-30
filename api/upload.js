// Vercel API route for file uploads
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

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
    // Handle mobile upload page
    const { transferId } = req.query;
    
    // For now, accept any transfer ID to allow testing
    // In production, you'd want to validate against a database
    if (!transferId) {
      return res.status(400).type("html").send(`<!doctype html>
      <html><head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta charset="utf-8" /><title>Invalid Request</title>
        <style>
          body{font-family:system-ui;padding:16px;text-align:center}
          .card{border:1px solid #e5e7eb;border-radius:16px;padding:16px;max-width:400px;margin:2rem auto}
          .error{color:#dc2626}
        </style></head><body>
        <div class="card">
          <h2 class="error">Invalid Request</h2>
          <p>No transfer ID provided. Please scan the QR code again from your desktop.</p>
        </div>
      </body></html>`);
    }
    
    res.type("html").send(`<!doctype html>
    <html><head>
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta charset="utf-8" /><title>Share to MMDConnect</title>
      <style>
        body{font-family:system-ui;padding:16px;background:#f9fafb;min-height:100vh}
        .card{border:1px solid #e5e7eb;border-radius:16px;padding:24px;background:white;max-width:400px;margin:2rem auto}
        .header{text-align:center;margin-bottom:24px}
        .logo{width:40px;height:40px;margin-bottom:12px;filter:brightness(0) saturate(100%) invert(8%) sepia(8%) saturate(2000%) hue-rotate(200deg) brightness(0.9) contrast(1.1)}
        h1{font-size:24px;font-weight:600;color:#1f2937;margin:0}
        .subtitle{color:#6b7280;font-size:14px;margin-top:8px}
        button{padding:12px 24px;border-radius:12px;border:none;background:#1d4ed8;color:white;font-weight:500;cursor:pointer;width:100%;margin-top:16px}
        button:disabled{background:#9ca3af;cursor:not-allowed}
        input[type=file]{display:block;margin:16px 0;padding:12px;border:2px dashed #d1d5db;border-radius:8px;width:100%;box-sizing:border-box}
        .hint{color:#6b7280;font-size:14px;text-align:center;margin-bottom:16px}
        .status{text-align:center;margin-top:16px;font-weight:500}
        .success{color:#059669}
        .error{color:#dc2626}
        .progress{color:#1d4ed8}
      </style></head><body>
      <div class="card">
        <div class="header">
          <img src="/Assets/mmdconnect.png" alt="MMDConnect" class="logo">
          <h1>Share health documents</h1>
          <p class="subtitle">Upload your health files to MMDConnect</p>
        </div>
        <p class="hint">Select PDF or Excel (XLSX) files. Maximum 100 MB each.</p>
        <input id="f" type="file" multiple accept=".pdf,application/pdf,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
        <button id="send">Upload Files</button>
        <div id="msg" class="status"></div>
      </div>
      <script>
        const transferId = ${JSON.stringify(transferId)};
        const f = document.getElementById('f');
        const btn = document.getElementById('send');
        const msg = document.getElementById('msg');

        async function uploadOne(file) {
          const fd = new FormData();
          fd.append('file', file, file.name);
          const resp = await fetch('/api/upload?transferId=' + transferId, { method:'POST', body: fd });
          if (!resp.ok) throw new Error(await resp.text());
        }
        
        btn.onclick = async () => {
          const files = Array.from(f.files || []);
          if (!files.length) { 
            msg.textContent = "Please choose at least one file."; 
            msg.className = "status error";
            return; 
          }
          
          btn.disabled = true; 
          msg.textContent = "Uploading " + files.length + " file(s)...";
          msg.className = "status progress";
          
          try {
            for (const file of files) {
              await uploadOne(file);
            }
            await fetch('/api/complete?transferId=' + transferId, { method:'POST' });
            msg.textContent = "Upload completed! You can close this page.";
            msg.className = "status success";
          } catch (e) {
            msg.textContent = "Upload failed: " + e.message;
            msg.className = "status error";
          } finally {
            btn.disabled = false;
          }
        };
      </script>
    </body></html>`);
  }

  if (req.method === 'POST') {
    // Handle file upload
    const { transferId } = req.query;
    
    console.log('=== UPLOAD POST REQUEST ===');
    console.log('Transfer ID:', transferId);
    console.log('Request headers:', req.headers);
    
    // For now, accept any transfer ID to allow testing
    // In production, you'd want to validate against a database
    if (!transferId) {
      console.log('No transfer ID provided');
      return res.status(400).json({ error: 'No transfer ID provided' });
    }

    try {
      console.log('Parsing form data...');
      const form = formidable({
        maxFileSize: 100 * 1024 * 1024, // 100MB
        filter: ({ mimetype }) => {
          console.log('File mimetype:', mimetype);
          const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
          const isAllowed = allowed.includes(mimetype);
          console.log('File allowed:', isAllowed);
          return isAllowed;
        }
      });

      const [fields, files] = await form.parse(req);
      console.log('Parsed fields:', fields);
      console.log('Parsed files:', files);
      
      const file = files.file?.[0];
      console.log('Selected file:', file);

      if (!file) {
        console.log('No file found in request');
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Initialize global state if needed
      if (!global.__mmd_transfers) {
        global.__mmd_transfers = new Map();
      }

      // Get or create transfer
      let transfer = global.__mmd_transfers.get(transferId);
      if (!transfer) {
        console.log('Transfer not found during upload, creating new transfer for ID:', transferId);
        transfer = { status: 'open', files: [], createdAt: Date.now() };
        global.__mmd_transfers.set(transferId, transfer);
        console.log('Created new transfer during upload for ID:', transferId);
      }

      // Store file metadata
      const meta = {
        name: file.originalFilename,
        size: file.size,
        mimetype: file.mimetype,
        uploadedAt: new Date().toISOString(),
        transferId: transferId
      };
      
      // Add file to transfer
      transfer.files.push(meta);
      global.__mmd_transfers.set(transferId, transfer);
      
      // Log the upload for debugging
      console.log('File uploaded successfully:', meta);
      console.log('Transfer now has', transfer.files.length, 'files');
      console.log('Updated transfer object:', transfer);
      console.log('Global state after upload:', Array.from(global.__mmd_transfers.keys()));

      // Push SSE event to any subscribers on desktop
      try {
        const set = global.__mmd_sse_clients && global.__mmd_sse_clients.get(transferId);
        if (set) {
          console.log('Sending SSE event to', set.size, 'clients');
          for (const r of set) {
            try {
              r.write(`data: ${JSON.stringify({ type: 'file', file: meta })}\n\n`);
            } catch (e) {
              console.log('SSE client error:', e.message);
            }
          }
        } else {
          console.log('No SSE clients found for transfer ID:', transferId);
        }
      } catch (e) {
        console.log('SSE error:', e.message);
      }

      console.log('Upload completed successfully, sending 204 response');
      res.status(204).end();
    } catch (error) {
      console.error('Upload error:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ error: 'Upload failed' });
    }
  }
}
