# Render.com Free Deployment Guide 🚀

## Why Render?
- ✅ **100% Free tier** (no credit card required)
- ✅ **750 hours/month** free (enough for 24/7 operation)
- ✅ **Auto-deploy** from GitHub
- ✅ **Free SSL** certificates
- ✅ **Easy setup** (5 minutes)

## Quick Deploy (5 Minutes)

### Step 1: MongoDB Atlas (2 minutes)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account → Create free cluster
3. Database Access → Add user (save password!)
4. Network Access → Add IP: `0.0.0.0/0` (allow all)
5. Click "Connect" → "Connect your application"
6. Copy connection string, replace `<password>` with your password

**Example:**
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/inazuma-battle?retryWrites=true&w=majority
```

### Step 2: Push to GitHub (1 minute)
```bash
cd backend
git init
git add .
git commit -m "Ready for Render deployment"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 3: Deploy on Render (2 minutes)

#### Option A: Using render.yaml (Recommended)
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Blueprint"
4. Connect your repository
5. Select branch (main)
6. Render detects `render.yaml` automatically
7. Click "Apply"

#### Option B: Manual Setup
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your repository
5. Configure:
   - **Name**: inazuma-battle-backend
   - **Region**: Oregon (US West)
   - **Branch**: main
   - **Root Directory**: backend (if monorepo)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 4: Set Environment Variables
In Render dashboard → Environment tab:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/inazuma-battle
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Deploy & Verify
1. Click "Create Web Service"
2. Wait for deployment (2-3 minutes)
3. Check logs for:
   - ✅ "Server running on port 5000"
   - ✅ "MongoDB Connected"
   - ✅ "Tournament scheduler started"

4. Test your API:
   ```bash
   curl https://your-app.onrender.com/api/health
   ```

## Done! 🎉

Your backend is live at: `https://your-app.onrender.com`

## Important: Free Tier Limitations

### ⚠️ Sleep After Inactivity
- **Free services sleep after 15 minutes of inactivity**
- **Wake-up time: ~30 seconds** on first request
- **Solution**: Use a keep-alive service (see below)

### Keep Your Service Awake (Optional)

#### Option 1: UptimeRobot (Recommended)
1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Create free account
3. Add monitor:
   - **Type**: HTTP(s)
   - **URL**: `https://your-app.onrender.com/api/health`
   - **Interval**: 5 minutes
4. Your service stays awake 24/7!

#### Option 2: Cron-job.org
1. Go to [cron-job.org](https://cron-job.org)
2. Create free account
3. Create job to ping your health endpoint every 5 minutes

#### Option 3: Self-Ping (Add to your code)
Not recommended as it uses your free hours.

### Free Tier Specs
- **Hours**: 750 hours/month (enough for 24/7 with one service)
- **RAM**: 512 MB
- **CPU**: Shared
- **Bandwidth**: 100 GB/month
- **Build Time**: 15 minutes max
- **Sleep**: After 15 minutes inactivity
- **Custom Domain**: ❌ (paid plans only)

## Configuration Files

### render.yaml (Already Created)
```yaml
services:
  - type: web
    name: inazuma-battle-backend
    env: node
    region: oregon
    plan: free
    buildCommand: npm install
    startCommand: npm start
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: FRONTEND_URL
        sync: false
```

### package.json (Already Configured)
```json
{
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## Environment Variables Explained

### Required Variables

**NODE_ENV**
```
NODE_ENV=production
```
Tells your app it's in production mode.

**MONGODB_URI**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/inazuma-battle
```
Your MongoDB Atlas connection string.

**JWT_SECRET**
```
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
```
Secret key for JWT tokens. Generate with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**FRONTEND_URL**
```
FRONTEND_URL=https://your-frontend.vercel.app
```
Your frontend URL for CORS.

## Post-Deployment Checklist

### 1. Verify Deployment
- [ ] Check Render logs for successful start
- [ ] See "Server running on port"
- [ ] See "MongoDB Connected"
- [ ] See "Tournament scheduler started"
- [ ] No error messages

### 2. Test API
```bash
# Health check
curl https://your-app.onrender.com/api/health

# Should return:
{
  "status": "OK",
  "message": "Inazuma Battle API is running",
  "timestamp": "..."
}
```

### 3. Test Endpoints
- [ ] POST /api/auth/register (create user)
- [ ] POST /api/auth/login (login)
- [ ] GET /api/tournaments (list tournaments)

### 4. Verify Scheduler
- [ ] Check logs for "Tournament scheduler started"
- [ ] Scheduler runs every 5 minutes
- [ ] Archives expired tournaments automatically

### 5. Update Frontend
Update your frontend `.env`:
```env
VITE_API_URL=https://your-app.onrender.com/api
```

## Troubleshooting

### Issue: "Build Failed"
**Solutions:**
- Check Render build logs
- Verify package.json has all dependencies
- Check Node version compatibility
- Try: `npm install` locally first

### Issue: "Cannot connect to MongoDB"
**Solutions:**
- Verify MONGODB_URI is correct
- Check MongoDB Atlas whitelist (use 0.0.0.0/0)
- Verify database user credentials
- Test connection string locally

### Issue: "CORS Error"
**Solutions:**
- Add your frontend URL to FRONTEND_URL env var
- Check server.js CORS configuration
- Verify frontend URL is correct (with https://)

### Issue: "Service Sleeping"
**Solutions:**
- Set up UptimeRobot to ping every 5 minutes
- Upgrade to paid plan ($7/month)
- Accept 30-second wake-up time

### Issue: "Scheduler Not Running"
**Solutions:**
- Check logs for "Tournament scheduler started"
- Verify server.js imports scheduler
- Check no errors in scheduler code
- Restart service

## Monitoring

### View Logs
1. Go to Render dashboard
2. Select your service
3. Click "Logs" tab
4. See real-time logs

### Check Scheduler Activity
Look for these messages:
```
🚀 Starting tournament scheduler...
✅ Tournament scheduler started (runs every 5 minutes)
⏰ No tournaments to archive
// or
📦 Archived X expired tournaments
```

### Monitor Uptime
- Use Render dashboard metrics
- Set up UptimeRobot for external monitoring
- Check MongoDB Atlas metrics

## Deployment from Monorepo

If your backend is in a subfolder:

### Option 1: Set Root Directory
In Render dashboard:
- **Root Directory**: `backend`
- Render will only deploy that folder

### Option 2: Separate Repository
Create a separate repo for backend:
```bash
cd backend
git init
git add .
git commit -m "Backend only"
git remote add origin YOUR_BACKEND_REPO_URL
git push -u origin main
```

## Auto-Deploy Setup

### Enable Auto-Deploy
1. Render dashboard → Settings
2. **Auto-Deploy**: Yes
3. **Branch**: main

Now every push to GitHub triggers automatic deployment!

### Disable Auto-Deploy
If you want manual control:
1. Settings → Auto-Deploy: No
2. Click "Manual Deploy" when ready

## Custom Domain (Paid Plans Only)

Free tier uses: `your-app.onrender.com`

For custom domain:
1. Upgrade to paid plan ($7/month)
2. Settings → Custom Domain
3. Add your domain
4. Update DNS records

## Scaling & Upgrading

### Free Tier
- **Cost**: $0
- **Good for**: Development, testing, hobby projects
- **Limitations**: Sleeps after 15 min, 512MB RAM

### Starter Plan ($7/month)
- **No sleep**
- **Better performance**
- **Custom domain**
- **More resources**

### Standard Plan ($25/month)
- **Even better performance**
- **More RAM/CPU**
- **Priority support**

## Comparison: Render vs Railway

| Feature | Render Free | Railway Free |
|---------|-------------|--------------|
| Cost | $0 | $5 credit/month |
| Sleep | After 15 min | After 30 min |
| Wake Time | ~30 sec | ~10 sec |
| Hours | 750/month | 500/month |
| RAM | 512 MB | 512 MB |
| Build Time | 15 min | 10 min |
| Custom Domain | ❌ | ❌ |
| Auto-Deploy | ✅ | ✅ |

**Recommendation**: 
- **Render**: Better for 24/7 free hosting (more hours)
- **Railway**: Better for development (faster wake-up)

## Cost Estimate

### Free Tier
- **Backend**: $0
- **MongoDB Atlas**: $0 (free tier)
- **Total**: $0/month

### With UptimeRobot (Keep Awake)
- **Backend**: $0
- **MongoDB**: $0
- **UptimeRobot**: $0 (free tier)
- **Total**: $0/month

### Production (Recommended)
- **Backend**: $7/month (Starter)
- **MongoDB**: $0-9/month
- **Total**: $7-16/month

## Security Checklist

- [ ] Strong JWT_SECRET (min 32 characters)
- [ ] NODE_ENV set to production
- [ ] MongoDB uses authentication
- [ ] CORS configured for your frontend only
- [ ] .env file not in git
- [ ] Environment variables in Render dashboard
- [ ] MongoDB Atlas IP whitelist configured

## Backup Strategy

### Database Backups
- MongoDB Atlas auto-backups (free tier)
- Export data regularly
- Keep local development copy

### Code Backups
- GitHub repository
- Multiple branches
- Regular commits

## Final Checklist

Before going live:
- [ ] MongoDB Atlas cluster created
- [ ] All environment variables set
- [ ] JWT_SECRET is strong
- [ ] FRONTEND_URL is correct
- [ ] Deployment successful
- [ ] Health endpoint works
- [ ] Scheduler is running
- [ ] Test all API endpoints
- [ ] Frontend connected
- [ ] UptimeRobot configured (optional)

## Support Resources

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Render Community**: [community.render.com](https://community.render.com)
- **MongoDB Docs**: [docs.mongodb.com](https://docs.mongodb.com)
- **Status Page**: [status.render.com](https://status.render.com)

## Quick Commands

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Test health endpoint
curl https://your-app.onrender.com/api/health

# Test with verbose output
curl -v https://your-app.onrender.com/api/health

# Check if service is awake
curl -w "@-" https://your-app.onrender.com/api/health
```

## Summary

Your backend is **100% ready** for Render! Just:
1. ✅ Create MongoDB Atlas cluster
2. ✅ Push to GitHub
3. ✅ Deploy on Render
4. ✅ Set environment variables
5. ✅ Set up UptimeRobot (optional)

The tournament scheduler runs automatically! 🚀

---

**Deployment Time**: ~5 minutes  
**Cost**: $0 (completely free)  
**Status**: Production Ready ✅  
**Auto-Deploy**: Yes ✅  
**Scheduler**: Runs automatically ✅
