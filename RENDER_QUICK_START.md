# Deploy to Render.com - 5 Minutes ⚡

## 100% Free Deployment (No Credit Card Required)

### Step 1: MongoDB Atlas (2 minutes)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up → Create free cluster
3. Create database user (username + password)
4. Network Access → Add IP: `0.0.0.0/0`
5. Connect → "Connect your application" → Copy connection string
6. Replace `<password>` with your actual password

**Your connection string:**
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/inazuma-battle
```

### Step 2: Generate JWT Secret (30 seconds)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output (64 characters)

### Step 3: Deploy to Render (2 minutes)
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (free, no credit card)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: inazuma-battle-backend
   - **Region**: Oregon
   - **Branch**: main
   - **Root Directory**: `backend` (if monorepo, leave empty if backend is root)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 4: Environment Variables (1 minute)
Click "Advanced" → Add environment variables:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/inazuma-battle
JWT_SECRET=your_64_character_secret_from_step_2
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**Replace with your actual values!**

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait 2-3 minutes for deployment
3. Check logs for:
   - ✅ "Server running on port"
   - ✅ "MongoDB Connected"
   - ✅ "Tournament scheduler started"

### Step 6: Test
```bash
curl https://your-app.onrender.com/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Inazuma Battle API is running"
}
```

## Done! 🎉

Your backend is live at: `https://your-app.onrender.com`

### Update Frontend
In your frontend `.env`:
```
VITE_API_URL=https://your-app.onrender.com/api
```

## ⚠️ Important: Free Tier Sleeps

**Free services sleep after 15 minutes of inactivity**

### Keep It Awake (Optional)
1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Sign up (free)
3. Add monitor:
   - URL: `https://your-app.onrender.com/api/health`
   - Interval: 5 minutes
4. Your service stays awake 24/7!

## What's Running
- ✅ Express API server
- ✅ MongoDB connection
- ✅ Tournament auto-archiver (every 5 minutes)
- ✅ All routes and features
- ✅ Auto-deploy on git push

## Need Help?
- Check `RENDER_DEPLOYMENT.md` for detailed guide
- Render logs: Dashboard → Your Service → Logs
- MongoDB Atlas: Check connection and IP whitelist

---

**Total Time**: ~5 minutes  
**Cost**: $0 (100% free)  
**Credit Card**: Not required  
**Status**: Production Ready ✅
