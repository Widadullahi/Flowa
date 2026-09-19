# Complete Vercel Setup Guide for FLOWA Frontend

This guide walks you step-by-step through deploying your FLOWA frontend to Vercel.

## Prerequisites

- GitHub account with FLOWA repository pushed
- Vercel account (free to create)
- Backend deployed on Render (URL should be `https://flowa-api.onrender.com`)

---

## Step 1: Create a Vercel Account

1. Go to https://vercel.com
2. Click **"Sign Up"** (top right)
3. Choose authentication method:
   - **Recommended**: "Continue with GitHub" (easiest for automatic CI/CD)
   - Alternatively: Email, GitLab, or Bitbucket
4. **If using GitHub**:
   - Click "Continue with GitHub"
   - Authorize Vercel to access your GitHub account
   - Click "Authorize vercel"

5. Complete your profile:
   - Enter your name
   - Choose "For myself" (hobby project)
   - Click "Create Team"

---

## Step 2: Import Your GitHub Repository

1. You should now be in the Vercel dashboard
2. Click **"Add New"** (top left) → **"Project"**
3. Click **"Continue with GitHub"**
4. **Search for your repository**:
   - Search box will appear
   - Type: `Flowa` or `Widadullahi/Flowa`
   - Click the repository when it appears

5. Click **"Import"** (next to the repository)

---

## Step 3: Configure Project Settings

After clicking Import, you'll see the configuration screen:

### A. Project Name
- **Default**: "flowa"
- Keep as is or change to preferred name
- This will be used in your Vercel URL subdomain

### B. Root Directory (CRITICAL)
- Click dropdown next to "Root Directory"
- Select: **`packages/landing`** (NOT the root!)
- ⚠️ This is very important - the build will fail if this is wrong

### C. Framework Preset
- Should auto-detect: **"Vite"** + **"React"**
- If not detected, select manually

### D. Build Command
- Should auto-detect: `npm run build`
- ✅ Keep as is (don't change)

### E. Output Directory
- Critical setting!
- **Must be**: `dist` (Vite's output directory)
- Click "Output Directory" field and change from default to: `dist`
- Do NOT leave as "public"

### F. Install Command
- Should be: `npm install`
- ✅ Keep as is

---

## Step 4: Add Environment Variables

1. You should still be on the configuration page
2. Scroll down to **"Environment Variables"**
3. Click **"Add"** button

### Variable 1: API Base URL
- **Name**: `VITE_API_BASE_URL`
- **Value**: `https://flowa-api.onrender.com` (your Render backend URL)
- **Environments**: Select all (Development, Preview, Production)
- Click **"Save"**

4. You can add more variables later if needed
5. For now, this is the only required variable

---

## Step 5: Review Configuration

Before deploying, verify all settings:

**Checklist:**
- [ ] Root Directory = `packages/landing`
- [ ] Framework = Vite + React
- [ ] Build Command = `npm run build`
- [ ] Output Directory = `dist` (NOT public)
- [ ] Install Command = `npm install`
- [ ] VITE_API_BASE_URL = `https://flowa-api.onrender.com`

If everything looks correct, click **"Deploy"** button (bottom right)

---

## Step 6: Wait for Deployment

1. Vercel will now build and deploy your project
2. You'll see a status screen showing:
   - Installing dependencies
   - Building the project
   - Deploying to Vercel's CDN

3. This usually takes **2-5 minutes**

### Expected Output
```
✓ Deployed to production
```

If you see **"Build Failed"**, check the error logs (see Troubleshooting below)

---

## Step 7: Get Your Live URL

After successful deployment:

1. You'll see a "Congratulations!" message
2. Your public URL will be displayed (e.g., `https://flowa-xxxxx.vercel.app`)
3. **Copy this URL** - you'll need it later

### Test the Deployment
1. Click the URL or copy-paste into browser
2. You should see your FLOWA landing page
3. Try the features:
   - Dark mode toggle (top-right corner)
   - Form submissions
   - Chat with AI

---

## Step 8: Post-Deployment Configuration (Optional)

### A. Custom Domain
If you have a custom domain (e.g., `flowa.com`):

1. Go to your Vercel project → **Settings** → **Domains**
2. Enter your custom domain
3. Add DNS records (instructions provided by Vercel)

### B. Environment Variables (Update Later)
If you need to change the backend URL or add more variables:

1. Go to project → **Settings** → **Environment Variables**
2. Add/edit variables as needed
3. Each change triggers a new deployment

### C. Git Integration (Automatic)
Vercel now auto-deploys when you:
- Push to `master` branch on GitHub
- Create pull requests (preview deployments)

---

## Troubleshooting

### Build Failed: "No Output Directory named public found"

**Cause**: Output Directory not set correctly

**Fix**:
1. Go to project → **Settings** → **Build & Development**
2. Find **Output Directory** field
3. Change from anything to: `dist`
4. Click **Save**
5. Go to **Deployments** → **Redeploy** (top-right)

### Build Failed: Cannot find module

**Cause**: Dependencies not installed or wrong Node version

**Fix**:
1. Go to **Settings** → **General**
2. Check **Node.js Version** (should be 18.x or higher)
3. Try redeploying

To redeploy:
1. Go to **Deployments** tab
2. Click the 3-dot menu on latest failed deployment
3. Click **Redeploy**

### Site shows 404 errors when navigating

**Cause**: Client-side routing not configured

**Fix**:
1. Go to **Settings** → **Build & Development**
2. Find **Redirects** section
3. Add a wildcard redirect:
   - Source: `/(.*)`
   - Destination: `/index.html`
   - Type: Rewrite
4. Click **Save**

### Frontend can't reach backend API

**Cause**: Environment variable not set or wrong URL

**Fix**:
1. Go to **Settings** → **Environment Variables**
2. Verify `VITE_API_BASE_URL` = `https://flowa-api.onrender.com`
3. If missing, add it
4. Redeploy the project
5. Check browser console (F12) for actual API URL being used

### Takes too long to build or build times out

**Cause**: Dependencies too large or slow network

**Fix**:
1. Vercel free tier has 45-second build limit
2. Upgrade to Pro ($20/month) for longer builds
3. Or optimize dependencies in `package.json`

---

## Quick Reference: URLs After Deployment

| Service | URL | Status |
|---------|-----|--------|
| Frontend | `https://flowa-xxxxx.vercel.app` | ✅ Public |
| Dashboard | `https://flowa-api.onrender.com/` | ✅ Public |
| API | `https://flowa-api.onrender.com/api/*` | ✅ Public |

---

## What's Next?

After successful deployment:

1. ✅ Share your frontend URL
2. ✅ Test WhatsApp webhook (if credentials configured on Render)
3. ✅ Monitor deployments in Vercel dashboard
4. ✅ Set up Slack/email notifications for failed deployments (Settings → Integrations)
5. ✅ Configure custom domain (if you have one)
6. ✅ Enable analytics (Speed Insights, Web Analytics) in Settings

---

## Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Deploy Logs**: Your project → Deployments tab
- **Environment Variables**: Your project → Settings → Environment Variables
- **Vercel Docs**: https://vercel.com/docs

---

## Support

If deployment fails:
1. Check **Deployments** tab → click failed deployment → **View Logs**
2. Search logs for "Error" or "Failed"
3. Common fixes in Troubleshooting section above
4. Email Vercel support if still stuck

