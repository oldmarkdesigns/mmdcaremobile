# MMDConnect Mobile Upload

A mobile-optimized file upload interface for healthcare document sharing via MMDConnect.

## 🚀 Features

- **Mobile-First Design**: Optimized for mobile devices and touch interfaces
- **QR Code Integration**: Accessible via QR code scanning from desktop applications
- **Secure File Upload**: Support for PDF and Excel (XLSX) files up to 100MB
- **Real-time Feedback**: Upload progress and status updates
- **Healthcare Focus**: Designed specifically for medical document sharing

## 📱 How It Works

1. **Desktop Application**: Generates a QR code with a unique transfer ID
2. **Mobile User**: Scans QR code to access this upload page
3. **File Selection**: User selects health documents from their device
4. **Upload**: Files are securely uploaded to the transfer session
5. **Confirmation**: User receives confirmation when upload is complete

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Vercel Serverless Functions
- **File Handling**: Formidable for multipart uploads
- **Deployment**: Vercel (serverless)

## 🚀 Deployment

### Deploy to Vercel

1. **Fork this repository** to your GitHub account
2. **Sign up** at [vercel.com](https://vercel.com)
3. **Import project** from GitHub
4. **Deploy** - Vercel will automatically detect the configuration

The mobile upload interface will be available at: `https://your-project-name.vercel.app`

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/mmdcaremobile.git
   cd mmdcaremobile
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Mobile upload page: `http://localhost:3000`

## 📁 Project Structure

```
mmdcaremobile/
├── api/                    # Vercel serverless functions
│   ├── transfers.js       # Create transfer sessions
│   ├── upload.js          # Handle file uploads
│   ├── complete.js        # Mark transfers complete
│   └── events.js          # Server-sent events
├── Assets/                # Static assets (images, icons)
├── index.html            # Mobile upload interface
├── package.json          # Dependencies and scripts
├── vercel.json          # Vercel deployment config
└── README.md            # This file
```

## 🔧 API Endpoints

- `POST /api/transfers` - Create a new transfer session
- `GET /api/upload?transferId=...` - Mobile upload page
- `POST /api/upload?transferId=...` - Upload files
- `POST /api/complete?transferId=...` - Mark transfer complete
- `GET /api/events?transferId=...` - Server-sent events

## 🔒 Security Features

- **File type validation**: Only PDF and XLSX files allowed
- **Size limits**: 100 MB maximum per file
- **Transfer sessions**: Time-limited transfer IDs
- **CORS enabled**: Proper cross-origin handling

## 📱 Mobile Compatibility

- **Responsive design**: Works on all mobile devices
- **Touch-friendly**: Large buttons and touch targets
- **File picker**: Native file selection on mobile devices
- **Progress feedback**: Real-time upload status

## 🔗 Integration with Desktop

To integrate with your desktop application:

1. **Generate QR Code**: Create a QR code with URL: `https://your-vercel-app.vercel.app?transferId=UNIQUE_ID`
2. **Create Transfer**: Call `POST /api/transfers` to create a transfer session
3. **Monitor Events**: Use `GET /api/events?transferId=...` for real-time updates

### Example QR Code URL:
```
https://mmdconnect-mobile.vercel.app?transferId=abc123def456
```

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**MMDConnect Mobile** - Secure healthcare document sharing on mobile devices.
