# MongoDB Atlas Setup Guide

## 🌐 Complete Step-by-Step Guide

### Step 1: Create Account
1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Sign up (email or Google)
3. Verify your email

### Step 2: Create Free Cluster
1. Click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Select provider and region:
   - **Provider:** AWS (recommended)
   - **Region:** ap-south-1 (Mumbai) or ap-southeast-1 (Singapore)
4. Cluster Name: `Cluster0` (default is fine)
5. Click **"Create"**
6. Wait 1-3 minutes for cluster creation

### Step 3: Create Database User
1. You'll see a security quickstart
2. **Authentication Method:** Username and Password
3. **Username:** `inazuma_admin`
4. **Password:** Click "Autogenerate Secure Password" and SAVE IT!
   - Example: `Abc123xyz789`
5. Click **"Create User"**

### Step 4: Network Access
1. **Where would you like to connect from?**
2. Choose **"My Local Environment"**
3. Click **"Add My Current IP Address"**
4. Also add: **"Allow Access from Anywhere"**
   - IP Address: `0.0.0.0/0`
   - Description: `Allow all (development)`
5. Click **"Finish and Close"**

### Step 5: Get Connection String
1. Click **"Connect"** button
2. Choose **"Drivers"**
3. Driver: **Node.js**
4. Version: **4.1 or later**
5. Copy the connection string:

```
mongodb+srv://inazuma_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 6: Update .env File

Open `backend/.env` and update:

```env
MONGODB_URI=mongodb+srv://inazuma_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/inazuma-battle?retryWrites=true&w=majority
```

**Replace:**
- `YOUR_PASSWORD` → Your actual password (from Step 3)
- `cluster0.xxxxx` → Your actual cluster URL (from connection string)
- Add `/inazuma-battle` before the `?` to specify database name

**Example:**
```env
MONGODB_URI=mongodb+srv://inazuma_admin:Abc123xyz789@cluster0.abc123.mongodb.net/inazuma-battle?retryWrites=true&w=majority
```

### Step 7: Test Connection

```bash
cd backend
npm run seed
```

If successful, you'll see:
```
✅ MongoDB Connected
✅ Created users
✅ Created wallets
✅ Created tournaments
🎉 Database seeded successfully!
```

## 🔍 Finding Your Connection String Later

1. Go to: https://cloud.mongodb.com
2. Click **"Database"** in left sidebar
3. Click **"Connect"** on your cluster
4. Choose **"Connect your application"**
5. Copy the connection string

## 🔐 Security Best Practices

### For Development:
- ✅ Use "Allow Access from Anywhere" (0.0.0.0/0)
- ✅ Keep password in .env file
- ✅ Add .env to .gitignore

### For Production:
- ❌ Remove "Allow Access from Anywhere"
- ✅ Add only your server's IP address
- ✅ Use environment variables on hosting platform
- ✅ Use strong, unique password

## 📊 View Your Data

### Option 1: MongoDB Atlas UI
1. Go to: https://cloud.mongodb.com
2. Click **"Browse Collections"**
3. View your data in the web interface

### Option 2: MongoDB Compass (Desktop App)
1. Download: https://www.mongodb.com/products/compass
2. Install and open
3. Paste your connection string
4. Click "Connect"

## 🆓 Free Tier Limits

MongoDB Atlas Free Tier (M0) includes:
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ Shared vCPU
- ✅ Perfect for development and small apps
- ✅ No credit card required

## 🚨 Troubleshooting

### Error: "Authentication failed"
- Check password is correct
- No special characters causing issues
- Password is URL-encoded if needed

### Error: "Connection timeout"
- Check Network Access settings
- Ensure 0.0.0.0/0 is whitelisted
- Check your internet connection

### Error: "MongoServerError"
- Cluster might still be creating (wait 2-3 minutes)
- Check connection string format
- Ensure database name is included

## 📝 Connection String Format

```
mongodb+srv://[username]:[password]@[cluster-url]/[database]?retryWrites=true&w=majority
```

**Parts:**
- `username`: Your database user (e.g., inazuma_admin)
- `password`: Your database password
- `cluster-url`: Your cluster URL (e.g., cluster0.abc123.mongodb.net)
- `database`: Your database name (e.g., inazuma-battle)

## ✅ Checklist

- [ ] Created MongoDB Atlas account
- [ ] Created free cluster
- [ ] Created database user
- [ ] Whitelisted IP (0.0.0.0/0)
- [ ] Got connection string
- [ ] Updated .env file
- [ ] Replaced `<password>` with actual password
- [ ] Added database name to connection string
- [ ] Tested with `npm run seed`

## 🎉 You're Done!

Your app is now connected to MongoDB Atlas cloud database!

No need to install MongoDB locally - everything is in the cloud! 🌐
