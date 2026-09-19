# Quick Vercel Deployment Checklist

## Before You Start
- [ ] GitHub account with code pushed
- [ ] Vercel account (free)
- [ ] Render backend URL: `https://flowa-api.onrender.com`

## Deployment Steps (5 minutes)

### 1. Create & Login to Vercel
```
https://vercel.com → Sign Up → Continue with GitHub
```

### 2. Import Repository
```
Vercel Dashboard → Add New → Project → Select: Widadullahi/Flowa → Import
```

### 3. Configure (CRITICAL SETTINGS)
```
✓ Root Directory: packages/landing (click dropdown to select)
✓ Framework: Vite + React (auto-detected)
✓ Build Command: npm run build (default)
✓ Output Directory: dist (NOT public! must change this)
✓ Install Command: npm install (default)
```

### 4. Add Environment Variable
```
Environment Variables section:
  Name: VITE_API_BASE_URL
  Value: https://flowa-api.onrender.com
  Environments: All
  Click: Save
```

### 5. Deploy
```
Click: "Deploy" button (bottom right)
Wait: 2-5 minutes for build to complete
Success: See "Congratulations!" message
```

### 6. Get Your URL
```
Copy the live URL: https://flowa-xxxxx.vercel.app
Test it in browser
```

## Troubleshooting Quick Fixes

### Build Failed: "public directory not found"
→ Go to Settings → Build & Development → Output Directory → Change to: `dist` → Save

### Build Failed: "Cannot find module"
→ Go to Deployments → Redeploy (click 3-dot menu)

### Frontend can't reach API
→ Settings → Environment Variables → Check `VITE_API_BASE_URL` is correct → Redeploy

### Pages show 404 when navigating
→ Settings → Build & Development → Add Redirect:
  - Source: `/(.*)`
  - Destination: `/index.html`
  - Type: Rewrite

## Key URLs

| What | URL |
|------|-----|
| Your Frontend | `https://flowa-xxxxx.vercel.app` |
| Vercel Logs | Your project → Deployments tab → Click deployment |
| Vercel Settings | Your project → Settings |
| Environment Vars | Your project → Settings → Environment Variables |

## Important Notes

⚠️ **Root Directory must be `packages/landing`** - this is the #1 cause of failure
⚠️ **Output Directory must be `dist`** - Vite doesn't output to public
⚠️ **Backend URL must match** - update if Render URL changes
✅ **Auto-deploys on push** - every master branch push redeploys automatically

## Still Need Help?

1. Check RENDER_DEPLOYMENT.md for full details
2. Read logs: Deployments → Failed deployment → View Logs
3. See VERCEL_SETUP_GUIDE.md for comprehensive guide
