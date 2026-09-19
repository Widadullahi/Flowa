# FLOWA Monorepo - Project Structure Guide

## New Monorepo Layout

```
flowa/
├── packages/
│   └── api/                          # Flask Backend
│       ├── app.py                    # Main Flask app with WhatsApp integration
│       ├── requirements.txt          # Python dependencies
│       ├── .env.example              # Environment variables template
│       ├── .venv/                    # Python virtual environment
│       ├── templates/
│       │   └── index.html           # Admin dashboard
│       ├── static/
│       │   ├── app.js               # Frontend JS for dashboard
│       │   └── styles.css           # Dashboard styles
│       └── WHATSAPP_SETUP.md         # WhatsApp integration guide
│
│   └── landing/                      # React/TanStack Frontend
│       ├── src/
│       │   ├── routes/
│       │   │   ├── __root.tsx        # Root layout
│       │   │   └── index.tsx         # Landing page
│       │   ├── components/
│       │   │   └── landing/          # Landing components
│       │   ├── styles.css
│       │   ├── router.tsx
│       │   └── server.ts
│       ├── public/                   # Static assets
│       ├── package.json              # Node dependencies
│       ├── vite.config.ts            # Vite build config
│       ├── tsconfig.json
│       └── bunfig.toml
│
├── package.json                      # Root workspace config
├── README.md                         # Main documentation
├── .gitignore                        # Git ignore rules
└── setup.sh                          # Setup script

```

## File Locations After Migration

### Backend Files (Moved to `packages/api/`)
- ✅ `app.py` - Main Flask application
- ✅ `requirements.txt` - Python dependencies
- ✅ `.env.example` - WhatsApp config template
- ✅ `WHATSAPP_SETUP.md` - Integration guide
- ✅ `templates/index.html` - Dashboard template
- ✅ `static/app.js` - Dashboard JavaScript
- ✅ `static/styles.css` - Dashboard styles
- ✅ `.venv/` - Python virtual environment

### Frontend Files (Moved to `packages/landing/`)
- ✅ `src/` - React source code
- ✅ `public/` - Static assets
- ✅ `package.json` - Dependencies
- ✅ `vite.config.ts` - Build config
- ✅ All config files (tsconfig, eslint, prettier, etc.)

### Cleaned Up / Removed
- ✅ `FLOWA-master/` - Extracted and moved to landing
- ✅ Old `README.md` - Replaced with monorepo README
- ✅ Image files - Moved to appropriate packages

## Monorepo Benefits

✅ **Unified version control** - Single git repo  
✅ **Shared tooling** - Root package.json for workspaces  
✅ **Easy deployment** - Deploy both packages together  
✅ **Simplified documentation** - Single README  
✅ **Atomic commits** - Frontend and backend updates together  
✅ **Cross-package references** - Easy to link packages  

## Running the Monorepo

### Option 1: Automatic (Recommended)
```bash
cd /home/biltronix/FLOWA
chmod +x setup.sh
./setup.sh
bun run dev:concurrent
```

### Option 2: Manual Setup
```bash
# Backend
cd packages/api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py

# Frontend (in another terminal)
cd packages/landing
bun install
bun run dev
```

## Access Points

| Component | URL | Port |
|-----------|-----|------|
| Landing Page | http://localhost:5173 | 5173 |
| API/Dashboard | http://localhost:5000 | 5000 |
| WebSocket | ws://localhost:5000 | 5000 |

## Root Package.json Scripts

```bash
bun run dev:concurrent     # Run both backend and landing simultaneously
bun run landing            # Just landing page
bun run api                # Just Flask API
bun run build              # Build landing for production
bun run format             # Format all code
```

## Development Workflow

1. **Frontend changes** → Edit in `packages/landing/src/`
2. **Backend changes** → Edit in `packages/api/app.py`
3. **API changes** → Test with test endpoint
4. **Styling** → Dashboard: `packages/api/static/styles.css`
5. **Landing** → All in `packages/landing/src/`

## Next Steps

1. ✅ Review the new monorepo structure
2. ✅ Read [README.md](README.md) for full documentation
3. ✅ Run `setup.sh` to install everything
4. ✅ Start with `bun run dev:concurrent`
5. ✅ Visit landing page at http://localhost:5173
6. ✅ Visit dashboard at http://localhost:5000

## Questions?

- Backend/API questions → Check `packages/api/app.py`
- Frontend/Landing questions → Check `packages/landing/src/`
- WhatsApp integration → Check `packages/api/WHATSAPP_SETUP.md`
- General questions → Check [README.md](README.md)
