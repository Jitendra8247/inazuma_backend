# Railway Deployment Checklist ✅

## Before Deployment

### 1. MongoDB Atlas Setup
- [ ] Create MongoDB Atlas account
- [ ] Create a free cluster
- [ ] Create database user with password
- [ ] Whitelist all IPs (0.0.0.0/0) or Railway IPs
- [ ] Get connection string
- [ ] Test connection locally

### 2. Prepare Environment Variables
- [ ] Generate strong JWT_SECRET (min 32 characters)
- [ ] Note your frontend URL (e.g., Vercel URL)
- [ ] Have MongoDB connection string ready

### 3. Code Preparation
- [ ] Commit all changes
- [ ] Push to GitHub
- [ ] Verify package.json has "start" script
- [ ] Verify .gitignore excludes .env and node_modules

## Deployment Steps

### 1. Create Railway Project
- [ ] Go to railway.app
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Choose your repository
- [ ] Select backend folder (if monorepo)

### 2. Configure Environment Variables
Go to Railway Dashboard → Variables tab:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/inazuma-battle
JWT_SECRET=your_32_character_secret_key_here
FRONTEND_URL=https://your-frontend.vercel.app
```

- [ ] NODE_ENV set to "production"
- [ ] PORT set to "5000"
- [ ] MONGODB_URI with your Atlas connection string
- [ ] JWT_SECRET with strong random key
- [ ] FRONTEND_URL with your frontend domain

### 3. Deploy
- [ ] Railway automatically deploys
- [ ] Wait for build to complete
- [ ] Check deployment logs for errors

## Post-Deployment Verification

### 1. Check Logs
- [ ] See "Server running on port 5000"
- [ ] See "MongoDB Connected"
- [ ] See "Tournament scheduler started"
- [ ] No error messages

### 2. Test Health Endpoint
```bash
curl https://your-app.railway.app/api/health
```
- [ ] Returns 200 OK
- [ ] Returns JSON with status "OK"

### 3. Test API Endpoints
- [ ] POST /api/auth/register (create test user)
- [ ] POST /api/auth/login (login with test user)
- [ ] GET /api/tournaments (list tournaments)
- [ ] POST /api/tournaments (create tournament as organizer)

### 4. Verify Scheduler
- [ ] Check logs for scheduler messages
- [ ] Create tournament with past time
- [ ] Wait 5 minutes or run test script
- [ ] Verify tournament gets archived

### 5. Update Frontend
- [ ] Update frontend .env with Railway URL
- [ ] Deploy frontend
- [ ] Test frontend → backend connection
- [ ] Test user registration from frontend
- [ ] Test tournament creation from frontend

## Security Verification

- [ ] JWT_SECRET is strong (min 32 chars)
- [ ] MongoDB uses authentication
- [ ] CORS only allows your frontend URL
- [ ] .env file not committed to git
- [ ] No sensitive data in logs
- [ ] NODE_ENV is "production"

## Performance Check

- [ ] API responds in < 1 second
- [ ] Database queries are fast
- [ ] No memory leaks in logs
- [ ] Scheduler runs every 5 minutes

## Troubleshooting

### If deployment fails:
1. Check Railway logs for errors
2. Verify all env variables are set
3. Check MongoDB connection string
4. Verify package.json start script

### If can't connect to MongoDB:
1. Check connection string format
2. Whitelist Railway IPs in Atlas
3. Verify database user credentials
4. Check network access settings

### If CORS errors:
1. Verify FRONTEND_URL is correct
2. Check server.js CORS config
3. Add your domain to allowed origins

### If scheduler not running:
1. Check logs for "scheduler started"
2. Verify server.js imports scheduler
3. Check no errors in scheduler code

## Going Live Checklist

- [ ] All tests passing
- [ ] Frontend connected to backend
- [ ] Users can register and login
- [ ] Tournaments can be created
- [ ] Tournaments auto-archive correctly
- [ ] Room credentials work
- [ ] Wallet system works
- [ ] No errors in production logs
- [ ] Performance is acceptable
- [ ] Security measures in place

## Monitoring Setup

- [ ] Set up UptimeRobot to prevent sleep (optional)
- [ ] Monitor Railway logs regularly
- [ ] Check MongoDB Atlas metrics
- [ ] Set up error alerting (optional)

## Backup Plan

- [ ] Export MongoDB data regularly
- [ ] Keep local development environment working
- [ ] Document any custom configurations
- [ ] Have rollback plan ready

## Cost Management

- [ ] Monitor Railway usage
- [ ] Check MongoDB Atlas storage
- [ ] Upgrade plans if needed
- [ ] Set up billing alerts

## Status: Ready to Deploy! ✅

Your backend has:
- ✅ Procfile for Railway
- ✅ railway.json configuration
- ✅ Correct package.json scripts
- ✅ Environment variable template
- ✅ Tournament scheduler
- ✅ All features working locally

Just follow the checklist above and you're good to go! 🚀
