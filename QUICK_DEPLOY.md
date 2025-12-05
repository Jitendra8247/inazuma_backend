# Quick Deploy to Railway - 5 Minutes ⚡

## Step 1: MongoDB Atlas (2 minutes)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account → Create cluster
3. Create database user (save password!)
4. Network Access → Add IP: `0.0.0.0/0` (allow all)
5. Click "Connect" → "Connect your application" → Copy connection string
6. Replace `<password>` with your password

**Your connection string looks like:**
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/inazuma-battle
```

## Step 2: Generate JWT Secret (30 seconds)
Run this in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output (64 character string)

## Step 3: Deploy to Railway (2 minutes)
1. Go to [railway.app](https://railway.app) → Login with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. If monorepo: Select `backend` folder

## Step 4: Set Environment Variables (1 minute)
In Railway dashboard → Variables tab → Add these:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/inazuma-battle
JWT_SECRET=your_64_character_secret_from_step_2
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**Replace:**
- `MONGODB_URI` with your Atlas connection string from Step 1
- `JWT_SECRET` with the secret from Step 2
- `FRONTEND_URL` with your actual frontend URL

## Step 5: Verify (30 seconds)
1. Check Railway logs for:
   - ✅ "Server running on port 5000"
   - ✅ "MongoDB Connected"
   - ✅ "Tournament scheduler started"

2. Test health endpoint:
   ```bash
   curl https://your-app.railway.app/api/health
   ```

## Done! 🎉

Your backend is live at: `https://your-app.railway.app`

### Update Frontend
In your frontend `.env`:
```
VITE_API_URL=https://your-app.railway.app/api
```

### What's Running
- ✅ Express API server
- ✅ MongoDB connection
- ✅ Tournament auto-archiver (every 5 minutes)
- ✅ All your routes and features

### Need Help?
- Check `RAILWAY_DEPLOYMENT.md` for detailed guide
- Check `DEPLOYMENT_CHECKLIST.md` for full checklist
- Railway logs: Dashboard → Deployments → View Logs

---

**Total Time**: ~5 minutes  
**Cost**: Free (with Railway $5 credit + MongoDB free tier)  
**Status**: Production Ready ✅
