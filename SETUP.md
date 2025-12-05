# Backend Setup Guide

## Step-by-Step Installation

### 1. Install MongoDB

**Windows:**
- Download from: https://www.mongodb.com/try/download/community
- Install and start MongoDB service

**Mac (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### 2. Install Node.js Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/inazuma-battle
JWT_SECRET=your_super_secret_jwt_key_change_this
FRONTEND_URL=http://localhost:5173
```

### 4. Seed Database

```bash
npm run seed
```

This will create:
- 3 demo users (1 player, 2 organizers)
- 3 sample tournaments
- Wallets for all users

### 5. Start Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on: `http://localhost:5000`

### 6. Test API

Open browser or Postman and visit:
```
http://localhost:5000/api/health
```

You should see:
```json
{
  "status": "OK",
  "message": "Inazuma Battle API is running",
  "timestamp": "2024-..."
}
```

## 🔐 Test Login

Use Postman or curl to test login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "player@demo.com",
    "password": "demo123"
  }'
```

You'll receive a JWT token. Use it for authenticated requests:

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔄 Connect Frontend

Update your frontend to use the backend API:

1. Create `.env` in frontend root:
```env
VITE_API_URL=http://localhost:5000/api
```

2. Update API calls to use `VITE_API_URL`

## 📊 Database Management

### View Data
Use MongoDB Compass (GUI) or mongo shell:

```bash
mongo
use inazuma-battle
db.users.find()
db.tournaments.find()
db.wallets.find()
```

### Reset Database
```bash
npm run seed
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `sudo systemctl status mongodb`
- Check connection string in `.env`

### Port Already in Use
- Change PORT in `.env` to different number (e.g., 5001)

### JWT Token Invalid
- Check JWT_SECRET matches between requests
- Token expires after 30 days

## 📝 Next Steps

1. ✅ Backend is running
2. Connect frontend to backend
3. Test all features
4. Deploy to production

## 🚀 Production Deployment

### MongoDB Atlas (Cloud Database)
1. Create account at mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update MONGODB_URI in production

### Deploy Backend
Options:
- **Heroku**: Easy deployment
- **Railway**: Modern platform
- **DigitalOcean**: VPS hosting
- **AWS/Azure**: Enterprise solutions

### Environment Variables
Set these in production:
- `NODE_ENV=production`
- `MONGODB_URI=your_production_db`
- `JWT_SECRET=strong_random_secret`
- `FRONTEND_URL=your_frontend_domain`
