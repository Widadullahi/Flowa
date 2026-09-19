# FLOWA Architecture Guide

## Two Separate Interfaces

```
┌─────────────────────────────────────────────────┐
│         FLOWA WhatsApp Bot Architecture         │
└─────────────────────────────────────────────────┘

┌──────────────────────────────┐
│  PUBLIC (Production/Live)     │
│  Landing Page - Port 5173    │
│  React + TanStack Router     │
│  - Marketing site            │
│  - Features showcase         │
│  - Call to actions           │
│  - Responsive design         │
└──────────────────────────────┘
         ↓
    Deploy to: Vercel/Netlify


┌──────────────────────────────┐
│  BACKEND (Core Engine)        │
│  API Server - Port 5000      │
│  Flask + WhatsApp API        │
│  - Webhook receiver          │
│  - AI processing             │
│  - Order management          │
│  - Payment tracking          │
└──────────────────────────────┘


┌──────────────────────────────┐
│  INTERNAL (Testing/Admin)     │
│  Dashboard - Port 5000       │
│  (Same server as Backend)    │
│  - Admin interface           │
│  - Conversation viewer       │
│  - Business management       │
│  - CSV export                │
│  - DEV/TEST ONLY             │
└──────────────────────────────┘
```

---

## 🎯 What Goes to Production

### ✅ PRODUCTION (Public)
- **Landing Page** (`packages/landing/`)
  - React frontend
  - Beautiful UI/UX
  - Marketing content
  - **Deploy to: Vercel, Netlify, or your hosting**

- **Backend API** (`packages/api/`)
  - Flask server
  - WhatsApp webhook receiver
  - AI processing engine
  - **Deploy to: Heroku, Railway, or your server**

### ❌ NOT FOR PRODUCTION
- **Dashboard** (port 5000)
  - Admin/testing interface only
  - Used for development
  - Hidden from customers
  - Only access internally

---

## 🚀 Deployment Strategy

### Frontend (Landing Page)
```bash
# Deploy to Vercel/Netlify
cd packages/landing
npm run build
# Upload dist/ folder
```

### Backend (API)
```bash
# Deploy to Railway/Heroku
cd packages/api
# Set environment variables
# Deploy with requirements.txt
```

---

## 📊 Dashboard - Development Tool

The dashboard at `http://localhost:5000` is:
- ✅ For testing the WhatsApp bot
- ✅ For viewing customer conversations
- ✅ For managing orders
- ✅ For exporting reports
- ❌ NOT customer-facing
- ❌ NOT part of production UI

---

## 🎨 Landing Page - Production UI

The landing page at `http://localhost:5173` is:
- ✅ Beautiful, marketing-focused
- ✅ Shows features to potential customers
- ✅ Responsive and optimized
- ✅ Goes to production
- ✅ Customer-facing

---

## 💬 How WhatsApp Bot Works

```
WhatsApp Customer
      ↓
  Meta Webhook
      ↓
Flask API (port 5000)
 - Receives message
 - Processes with AI
 - Sends response
      ↓
Conversation logged in Dashboard
      ↓
Business can view in admin panel (localhost:5000)
```

**Customers never see the dashboard** - only the business owner uses it.

---

## 🏢 Production Setup Example

### Vercel (Frontend)
```
Landing Page
├─ packages/landing/
├─ Deploy to: vercel.com
└─ URL: https://flowa.xyz
```

### Railway/Heroku (Backend)
```
API Server
├─ packages/api/
├─ Deploy to: railway.app
└─ URL: https://api.flowa.xyz
```

### WhatsApp Webhook
```
Meta Console Configuration:
├─ Webhook URL: https://api.flowa.xyz/api/whatsapp/webhook
├─ Verify Token: (set in .env)
└─ Subscribe to: messages, message_status
```

---

## 🧪 Local Development

```
Terminal 1: Backend
cd packages/api
source .venv/bin/activate
python app.py
→ http://localhost:5000 (API + Dashboard)

Terminal 2: Frontend
cd packages/landing
npm run dev
→ http://localhost:5173 (Landing Page)
```

- Use landing page to preview marketing site
- Use dashboard to test bot functionality
- Bot is invisible to customer (runs in background)

---

## 📋 Checklist Before Production

- [ ] Landing page styled and ready
- [ ] Backend deployed and running
- [ ] WhatsApp credentials obtained
- [ ] Webhook URL configured
- [ ] Environment variables set
- [ ] Test bot with real WhatsApp number
- [ ] Dashboard works for order management
- [ ] CSV export works
- [ ] SSL/HTTPS enabled on backend

---

## 🔐 Security Notes

- Dashboard should have authentication before production
- API should validate webhook signatures
- Never expose `.env` file
- Use HTTPS for all connections
- Rate limit webhook endpoints

See: `packages/api/WHATSAPP_SETUP.md` for security best practices

---

**Summary:**
- 🎨 Landing Page = What customers see
- 📊 Dashboard = What you (business owner) see
- 🤖 WhatsApp Bot = What customers chat with
- 🔧 API = What powers everything
