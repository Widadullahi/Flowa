# Frontend Setup & Configuration

This guide explains how to set up and configure the FLOWA frontend (React + Vite).

## Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn installed
- Backend API running (locally or on Render)

### Installation

```bash
# Navigate to frontend directory
cd packages/landing

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the next available port).

## Environment Configuration

### Local Development

Create or update `.env.local` in `packages/landing/`:

```env
# For local backend
VITE_API_BASE_URL=http://localhost:5000
```

Then start the Flask backend:
```bash
cd packages/api
python app.py
```

### Production (Vercel)

Set environment variables in Vercel dashboard:
- `VITE_API_BASE_URL`: `https://flowa-api.onrender.com`

Or create `.env.production` in `packages/landing/`:

```env
VITE_API_BASE_URL=https://flowa-api.onrender.com
```

## API Integration

The frontend communicates with the backend at the URL specified in `VITE_API_BASE_URL`.

### Available API Endpoints

All endpoints are prefixed with `/api`:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Check backend health |
| GET | `/businesses` | List all businesses |
| POST | `/businesses` | Create a new business |
| GET | `/leads` | List all leads |
| POST | `/leads` | Create a new lead |
| POST | `/chat` | Send message to AI |
| POST | `/whatsapp/test` | Test WhatsApp webhook locally |
| GET | `/reports` | Get summary reports |
| GET | `/reports/export` | Export leads as CSV |

### Example API Call

```typescript
const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/businesses`);
const data = await response.json();
```

## Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

## Deploy to Vercel

1. **Sign in to Vercel**: https://vercel.com
2. **Import Project** → Select `Widadullahi/Flowa` repository
3. **Configure**:
   - Root Directory: `packages/landing`
   - Framework: Auto-detect (Vite)
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables**:
   - Add `VITE_API_BASE_URL=https://flowa-api.onrender.com`
5. **Deploy**

## Troubleshooting

### "Cannot reach the backend"
- Ensure `VITE_API_BASE_URL` is correctly set
- Check that the backend is running and accessible
- Verify CORS is enabled on the backend (see `RENDER_DEPLOYMENT.md`)

### "Port 5173 is already in use"
```bash
npm run dev -- --port 3000
```

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

## Project Structure

```
packages/landing/
├── src/
│   ├── routes/          # Route components
│   ├── components/      # Reusable components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   └── index.tsx        # Entry point
├── public/              # Static assets
├── .env.example         # Environment template
├── .env.local           # Local dev config (git-ignored)
├── vite.config.ts       # Vite configuration
└── package.json         # Dependencies
```

## Performance Tips

- Use React Query for data fetching and caching
- Lazy load routes with `React.lazy()` and `Suspense`
- Optimize images before uploading
- Use Vercel's analytics to monitor performance

## Support

For issues with the frontend, check:
1. Browser console for errors (`F12` → Console)
2. Network tab to see API requests
3. Vercel deployment logs
4. Backend logs on Render

See `RENDER_DEPLOYMENT.md` for full deployment guide.
