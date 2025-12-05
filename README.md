# Inazuma Battle Backend API

Complete REST API for the Inazuma Battle eSports Tournament Platform.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)

### Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Setup environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)

3. **Start MongoDB:**
```bash
# If using local MongoDB
mongod
```

4. **Seed the database:**
```bash
npm run seed
```

5. **Start the server:**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Most endpoints require authentication. Include JWT token in headers:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Body:**
```json
{
  "username": "player123",
  "email": "player@example.com",
  "password": "Password123",
  "role": "player"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "player123",
    "email": "player@example.com",
    "role": "player",
    "avatar": "/placeholder.svg",
    "stats": {...}
  }
}
```

### Login
```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "player@example.com",
  "password": "Password123"
}
```

### Get Current User
```http
GET /api/auth/me
```
*Requires authentication*

---

## 👥 User Endpoints

### Get All Users (Organizer Only)
```http
GET /api/users
```

### Get User by ID
```http
GET /api/users/:id
```

### Update User Profile
```http
PUT /api/users/:id
```

**Body:**
```json
{
  "username": "newusername",
  "avatar": "/new-avatar.jpg"
}
```

---

## 🏆 Tournament Endpoints

### Get All Tournaments
```http
GET /api/tournaments
```

**Query Parameters:**
- `status` - Filter by status (upcoming, ongoing, completed)
- `game` - Filter by game
- `mode` - Filter by mode (Solo, Duo, Squad)

### Get Tournament by ID
```http
GET /api/tournaments/:id
```

### Create Tournament (Organizer Only)
```http
POST /api/tournaments
```

**Body:**
```json
{
  "name": "Tournament Name",
  "game": "BGMI",
  "mode": "Squad",
  "prizePool": 100000,
  "entryFee": 500,
  "maxTeams": 64,
  "startDate": "2024-03-01",
  "endDate": "2024-03-05",
  "description": "Tournament description",
  "rules": ["Rule 1", "Rule 2"],
  "region": "India",
  "platform": "Mobile"
}
```

### Update Tournament (Organizer Only)
```http
PUT /api/tournaments/:id
```

### Delete Tournament (Organizer Only)
```http
DELETE /api/tournaments/:id
```

---

## 📝 Registration Endpoints

### Register for Tournament
```http
POST /api/registrations
```

**Body:**
```json
{
  "tournamentId": "tournament_id",
  "teamName": "Team Phoenix",
  "email": "player@example.com",
  "phone": "9876543210",
  "inGameId": "PLAYER123"
}
```

### Get My Registrations
```http
GET /api/registrations/my
```

### Get Tournament Registrations
```http
GET /api/registrations/tournament/:tournamentId
```

---

## 💰 Wallet Endpoints

### Get My Wallet
```http
GET /api/wallets/my
```

### Get All Wallets (Organizer Only)
```http
GET /api/wallets/all
```

### Deposit Money
```http
POST /api/wallets/deposit
```

**Body:**
```json
{
  "amount": 1000,
  "bankDetails": {
    "accountNumber": "1234567890",
    "ifscCode": "SBIN0001234",
    "accountHolderName": "John Doe",
    "bankName": "State Bank of India"
  }
}
```

### Withdraw Money
```http
POST /api/wallets/withdraw
```

**Body:**
```json
{
  "amount": 500,
  "bankDetails": {
    "accountNumber": "1234567890",
    "ifscCode": "SBIN0001234",
    "accountHolderName": "John Doe",
    "bankName": "State Bank of India"
  }
}
```

### Transfer Money
```http
POST /api/wallets/transfer
```

**Body:**
```json
{
  "toUserId": "recipient_user_id",
  "amount": 200
}
```

### Admin Add Funds (Organizer Only)
```http
POST /api/wallets/admin/add
```

**Body:**
```json
{
  "userId": "user_id",
  "amount": 1000,
  "reason": "Compensation for technical issue"
}
```

### Admin Deduct Funds (Organizer Only)
```http
POST /api/wallets/admin/deduct
```

**Body:**
```json
{
  "userId": "user_id",
  "amount": 500,
  "reason": "Penalty for cheating"
}
```

---

## 📊 Transaction Endpoints

### Get My Transactions
```http
GET /api/transactions/my?limit=50&page=1
```

### Get User Transactions (Organizer Only)
```http
GET /api/transactions/user/:userId
```

### Get All Transactions (Organizer Only)
```http
GET /api/transactions/all?limit=100&page=1
```

---

## 🔒 Authorization Levels

- **Public**: No authentication required
- **Private**: Requires authentication (any user)
- **Organizer Only**: Requires authentication + organizer role

---

## 📦 Database Models

### User
- username, email, password
- role (player/organizer)
- avatar, stats
- timestamps

### Tournament
- name, game, mode
- prizePool, entryFee
- maxTeams, registeredTeams
- dates, status
- organizer info
- timestamps

### Registration
- tournament, player info
- team details
- contact info
- status
- timestamps

### Wallet
- user reference
- balance
- timestamps

### Transaction
- user reference
- type, amount, balance
- description
- related user/tournament
- bank details
- timestamps

---

## 🛠️ Tech Stack

- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

---

## 📝 Default Credentials

After running `npm run seed`:

**Player:**
- Email: player@demo.com
- Password: demo123

**Organizer 1:**
- Email: admin@inazuma.com
- Password: Admin@2024

**Organizer 2:**
- Email: organizer@demo.com
- Password: Organizer@123

---

## 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 🔄 Development

### Project Structure
```
backend/
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── scripts/         # Utility scripts
├── server.js        # Main server file
├── package.json     # Dependencies
└── .env            # Environment variables
```

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run seed` - Seed database with initial data

---

## 📄 License

MIT
