# Railway Deployment Guide for Backend

## ✅ Your Backend is Railway-Ready!

Your backend will work on Railway. Here's everything you need to know:

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **MongoDB Atlas**: You'll need a cloud MongoDB (Railway doesn't provide MongoDB by default)
3. **GitHub Repository**: Push your code to GitHub (recommended)

## Quick Deployment Steps

### Option 1: Deploy from GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial backend commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` folder (if monorepo)
   - Railway will auto-detect Node.js and deploy

3. **Set Environment Variables**
   In Railway dashboard, go to Variables tab and add:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_min_32_characters
   FRONTEND_URL=your_frontend_url
   ```

### Option 2: Deploy with Railway CLI

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**
   ```bash
   railway login
   ```

3. **Initialize and Deploy**
   ```bash
   cd backend
   railway init
   railway up
   ```

4. **Set Environment Variables**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set MONGODB_URI=your_mongodb_connection_string
   railway variables set JWT_SECRET=your_secret_key
   railway variables set FRONTEND_URL=your_frontend_url
   ```

## Environment Variables Required

### Critical Variables
```env
# Required for production
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inazuma-battle
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### How to Get MongoDB URI

1. **Go to MongoDB Atlas**
   - Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create free account
   - Create a cluster (free tier available)

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `inazuma-battle`

3. **Example**
   ```
   mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/inazuma-battle?retryWrites=true&w=majority
   ```

### How to Generate JWT Secret

```bash
# Option 1: Use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Use OpenSSL
openssl rand -hex 32

# Option 3: Use online generator
# Visit: https://randomkeygen.com/
```

## Files Added for Railway

### 1. Procfile
```
web: npm start
```
Tells Railway how to start your app.

### 2. railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```
Configures Railway deployment settings.

### 3. package.json (Already Configured)
```json
{
  "scripts": {
    "start": "node server.js"  // ✅ Railway uses this
  },
  "engines": {
    "node": ">=18.0.0",  // ✅ Specifies Node version
    "npm": ">=9.0.0"
  }
}
```

## Post-Deployment Checklist

### 1. Verify Deployment
- [ ] Check Railway logs for "Server running on port"
- [ ] Check "Tournament scheduler started" message
- [ ] No error messages in logs

### 2. Test API Endpoints
```bash
# Replace YOUR_RAILWAY_URL with your actual URL
curl https://your-app.railway.app/api/health

# Expected response:
{
  "status": "OK",
  "message": "Inazuma Battle API is running",
  "timestamp": "2024-12-05T..."
}
```

### 3. Test Database Connection
- Create a test user via API
- Check MongoDB Atlas to see if data is saved

### 4. Update Frontend
Update your frontend `.env` file:
```env
VITE_API_URL=https://your-backend.railway.app/api
```

## Important Notes

### ✅ What Works Automatically
- Node.js detection
- npm install
- Port binding (Railway provides PORT env var)
- HTTPS/SSL certificates
- Auto-restarts on crashes
- Tournament scheduler (runs automatically)

### ⚠️ What You Need to Configure
- MongoDB connection (use MongoDB Atlas)
- Environment variables
- CORS settings (add your frontend URL)
- JWT secret

### 🔒 Security Checklist
- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas with authentication
- [ ] Add your frontend URL to CORS whitelist
- [ ] Don't commit .env file to git
- [ ] Use environment variables for all secrets

## Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution**: 
- Check MONGODB_URI is correct
- Whitelist Railway's IP in MongoDB Atlas (or use 0.0.0.0/0 for all IPs)
- Verify database user has read/write permissions

### Issue: "CORS error from frontend"
**Solution**:
- Add your frontend URL to FRONTEND_URL env variable
- Check server.js CORS configuration includes your domain

### Issue: "Application failed to start"
**Solution**:
- Check Railway logs for error details
- Verify all required env variables are set
- Check package.json has correct start script

### Issue: "Scheduler not running"
**Solution**:
- Check logs for "Tournament scheduler started"
- Verify server.js includes scheduler initialization
- Check no errors in tournamentScheduler.js

## Monitoring

### View Logs
```bash
# Using Railway CLI
railway logs

# Or in Railway Dashboard
# Go to your project → Deployments → View Logs
```

### Check Scheduler Activity
Look for these log messages:
```
🚀 Starting tournament scheduler...
✅ Tournament scheduler started (runs every 5 minutes)
⏰ No tournaments to archive
// or
📦 Archived X expired tournaments
```

## Scaling

### Free Tier Limits
- 500 hours/month execution time
- $5 free credit/month
- Sleeps after 30 minutes of inactivity

### Prevent Sleep (Optional)
Use a service like UptimeRobot to ping your API every 5 minutes:
```
https://your-backend.railway.app/api/health
```

### Upgrade for Production
- Pro Plan: $20/month
- No sleep
- More resources
- Better performance

## Cost Estimate

### Free Tier (Hobby)
- **Cost**: $0 (with $5 credit)
- **Good for**: Development, testing, small projects
- **Limitations**: Sleeps after inactivity

### Pro Plan
- **Cost**: ~$5-10/month (usage-based)
- **Good for**: Production apps
- **Benefits**: No sleep, better performance

### MongoDB Atlas
- **Free Tier**: 512MB storage (sufficient for small apps)
- **Paid**: Starts at $9/month for more storage

## Deployment Commands

```bash
# Deploy
railway up

# View logs
railway logs

# Open in browser
railway open

# Set environment variable
railway variables set KEY=value

# Link to existing project
railway link

# Check status
railway status
```

## Alternative: Deploy Backend Folder Only

If you have a monorepo (frontend + backend), you can deploy just the backend:

1. **Create railway.toml in backend folder**
   ```toml
   [build]
   builder = "NIXPACKS"
   
   [deploy]
   startCommand = "npm start"
   ```

2. **Deploy**
   ```bash
   cd backend
   railway up
   ```

## Final Checklist

Before going live:
- [ ] MongoDB Atlas cluster created and connected
- [ ] All environment variables set in Railway
- [ ] JWT_SECRET is strong and unique
- [ ] FRONTEND_URL points to your actual frontend
- [ ] Test all API endpoints
- [ ] Check scheduler is running
- [ ] Update frontend to use Railway backend URL
- [ ] Test user registration and login
- [ ] Test tournament creation and archiving

## Support

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **MongoDB Atlas Docs**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)

## Summary

Your backend is **100% ready** for Railway! Just:
1. ✅ Push to GitHub
2. ✅ Deploy on Railway
3. ✅ Set environment variables
4. ✅ Connect MongoDB Atlas
5. ✅ Update frontend URL

The tournament scheduler will run automatically! 🚀
