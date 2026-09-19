# FLOWA Render Deployment Guide

This guide walks you through deploying FLOWA to Render: backend API on Render, frontend landing page on Vercel/Netlify, and WhatsApp webhook integration.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Internet                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼────┐    ┌────▼────┐   ┌────▼────┐
   │ Dashboard│    │ Landing │   │WhatsApp  │
   │(http://  │    │  Page   │   │ Webhook  │
   │localhost:│    │(Vercel/ │   │(Render)  │
   │5000)     │    │Netlify) │   │          │
   └────┬─────┘    └────┬────┘   └────┬─────┘
        │               │             │
        └───────────────┼─────────────┘
                        │
                    ┌───▼────────────┐
                    │ Render Backend  │
                    │ (packages/api)  │
                    │ - Flask app     │
                    │ - WhatsApp API  │
                    │ - Leads/CRM DB  │
                    └─────────────────┘
```

---

## Part 1: Backend Deployment on Render

### 1.1 Prerequisites

- Render account (https://render.com)
- GitHub account with FLOWA repo pushed
- WhatsApp credentials (Phone ID, API Token, Webhook Token)

### 1.2 Create Render Web Service

1. **Sign in to Render**: https://dashboard.render.com
2. **Click "New +"** → **"Web Service"**
3. **Connect GitHub repository**:
   - Click "Connect account" and authorize GitHub
   - Select `Widadullahi/Flowa` repo
   - Allow access

4. **Configure Web Service**:
   - **Name**: `flowa-api` (or custom)
   - **Environment**: Select `Python 3`
   - **Region**: Choose closest to your users (e.g., Frankfurt, Singapore)
   - **Branch**: `master`
   - **Root Directory**: `packages/api` (Render will look for `requirements.txt` here)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`
   - **Plan**: Free tier fine for testing; upgrade to Starter ($7/month) for production

5. **Click "Create Web Service"**

### 1.3 Install Production Dependencies

Update `packages/api/requirements.txt` to include production server:

```
Flask==3.0.3
requests==2.31.0
cryptography==41.0.4
gunicorn==21.2.0
python-dotenv==1.0.0
```

Add `.env` to `packages/api/.gitignore` (if not already there) to avoid committing secrets:

```bash
echo ".env" >> packages/api/.gitignore
git add packages/api/.gitignore packages/api/requirements.txt
git commit -m "Add gunicorn and python-dotenv for production deployment"
git push origin master
```

### 1.4 Set Environment Variables on Render

1. In Render dashboard for `flowa-api` service, go to **Environment**
2. Add the following (get values from Meta Business Account):
   - `WHATSAPP_PHONE_ID`: Your phone business ID (e.g., `108234012345678`)
   - `WHATSAPP_API_TOKEN`: Your access token (starts with `EAA...`)
   - `WHATSAPP_WEBHOOK_TOKEN`: Your custom webhook verify token (e.g., `flowa_webhook_secret_123`)
   - `MASTER_KEY`: Base64 Fernet key for per-business credential encryption (generate below)
   - `FLASK_ENV`: `production`
   - `DEBUG`: `False`

3. **Generate a Fernet Master Key** (run locally):
   ```bash
   python3 << 'EOF'
   from cryptography.fernet import Fernet
   key = Fernet.generate_key()
   print(key.decode())
   EOF
   ```
   Copy the output and paste as `MASTER_KEY` value on Render.

4. **Save** environment variables

### 1.5 Configure WhatsApp Webhook on Meta

1. **Get your Render URL**:
   - Deployment complete → Copy the URL (e.g., `https://flowa-api.onrender.com`)

2. **In Meta Business Account** → **WhatsApp** → **Configuration**:
   - **Webhook URL**: `https://flowa-api.onrender.com/api/whatsapp/webhook`
   - **Verify Token**: Same as `WHATSAPP_WEBHOOK_TOKEN` env var (e.g., `flowa_webhook_secret_123`)
   - **Subscribe to messages**: Enable

3. **Test webhook**:
   ```bash
   curl -X GET "https://flowa-api.onrender.com/api/whatsapp/webhook?hub.mode=subscribe&hub.challenge=test_challenge_string&hub.verify_token=flowa_webhook_secret_123"
   ```
   Should return: `test_challenge_string`

---

## Part 2: Frontend Deployment (Landing Page)

### 2.1 Deploy to Vercel (Recommended)

1. **Sign up**: https://vercel.com
2. **Import Git project**:
   - Click "Import Project"
   - Select your GitHub repo `Widadullahi/Flowa`
3. **Configure**:
   - **Root Directory**: `packages/landing`
   - **Framework Preset**: Auto-detect (should recognize Vite + React)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables** (if needed):
   - `VITE_API_BASE_URL`: `https://flowa-api.onrender.com` (backend URL)
5. **Deploy**: Click "Deploy"

### 2.2 Alternative: Deploy to Netlify

1. **Sign up**: https://netlify.com
2. **New site from Git**:
   - Connect GitHub
   - Select `Widadullahi/Flowa`
   - Choose `master` branch
3. **Build settings**:
   - **Base directory**: `packages/landing`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. **Deploy**

---

## Part 3: Dashboard Deployment (Optional)

The dashboard is embedded in the backend at `/`. To access it after deployment:

1. **URL**: `https://flowa-api.onrender.com/`
2. **Access**: No authentication required by default (add if needed for production)

---

## Part 4: Testing Post-Deployment

### 4.1 Health Check

```bash
curl https://flowa-api.onrender.com/api/health
```

Expected: `{"status": "ok", "timestamp": "2026-09-19T..."}`

### 4.2 Test WhatsApp Webhook

```bash
curl -X POST https://flowa-api.onrender.com/api/whatsapp/test \
  -H "Content-Type: application/json" \
  -d '{
    "business_id": "biz_1001",
    "customer_phone": "+2348012345678",
    "message": "Hi, I want a 10-inch chocolate cake"
  }'
```

### 4.3 Test Leads API

```bash
curl https://flowa-api.onrender.com/api/leads
```

### 4.4 Test Businesses API

```bash
curl https://flowa-api.onrender.com/api/businesses
```

---

## Part 5: Production Hardening Checklist

- [ ] **Database**: Switch from in-memory store to PostgreSQL (Render provides free tier)
  - Update `FlowaStore` to use SQLAlchemy + PostgreSQL
  - Add `DATABASE_URL` env var
  
- [ ] **Authentication**: Add login/API keys for dashboard
  - Protect `/` and admin endpoints with middleware
  
- [ ] **CORS**: Restrict to frontend domain
  ```python
  from flask_cors import CORS
  CORS(app, origins=['https://your-landing-domain.vercel.app'])
  ```

- [ ] **Rate Limiting**: Protect endpoints from abuse
  ```python
  from flask_limiter import Limiter
  limiter = Limiter(app, key_func=...)
  @app.route('/api/whatsapp/test')
  @limiter.limit("10 per minute")
  def ...
  ```

- [ ] **Logging**: Send logs to external service (Render provides built-in logging)
  - Enable "Log Drain" in Render dashboard

- [ ] **Monitoring**: Add uptime checks
  - Render has built-in notifications for crashes

- [ ] **Secrets rotation**: Regularly rotate master key and WhatsApp token
  - Update in Render environment variables

- [ ] **SSL/TLS**: Render auto-enables HTTPS (no action needed)

---

## Part 6: Troubleshooting

### Webhook not receiving messages

1. **Check Render logs**:
   - Dashboard → Service → Logs
   - Look for errors in `/api/whatsapp/webhook`

2. **Verify webhook configuration**:
   - Meta Business Account → WhatsApp → Configuration
   - Ensure URL is correct: `https://flowa-api.onrender.com/api/whatsapp/webhook`
   - Verify token matches `WHATSAPP_WEBHOOK_TOKEN`

3. **Test webhook verification**:
   ```bash
   curl -v "https://flowa-api.onrender.com/api/whatsapp/webhook?hub.mode=subscribe&hub.challenge=test&hub.verify_token=YOUR_TOKEN"
   ```

### Backend crashes on startup

1. **Check logs**:
   - Render dashboard → Logs
   - Common issues:
     - Missing `WHATSAPP_API_TOKEN` (check env vars)
     - Missing `gunicorn` in requirements.txt

2. **Rebuild**:
   - Manual redeploy: Dashboard → Service → Manual deploy

### Frontend can't reach backend

1. **Check CORS**:
   - Backend should allow requests from frontend domain
   - Add to `packages/api/app.py`:
     ```python
     from flask_cors import CORS
     CORS(app)
     ```

2. **Check API URL**:
   - Frontend `.env` should have `VITE_API_BASE_URL=https://flowa-api.onrender.com`

---

## Part 7: Cost Estimate (Monthly)

| Component | Tier | Cost |
|-----------|------|------|
| Render Backend (Flask) | Starter | $7 |
| Vercel Frontend | Hobby (free tier) | Free |
| PostgreSQL (if added) | Free tier | Free |
| **Total** | | ~$7/month |

---

## Next Steps

1. Push code to GitHub
2. Create Render service for backend
3. Set environment variables
4. Configure WhatsApp webhook
5. Deploy frontend to Vercel
6. Test end-to-end flow
7. Set up monitoring and alerts

For questions or issues, check the [official Render docs](https://render.com/docs).
