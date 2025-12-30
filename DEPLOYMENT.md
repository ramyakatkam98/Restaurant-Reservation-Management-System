# Deployment Guide

This guide will help you deploy the Restaurant Reservation Management System to GitHub and make it publicly accessible.

## Step 1: Prepare for GitHub

### 1.1 Create a `.gitignore` file (if not exists)

Create `.gitignore` in the root directory:

```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.production

# Build outputs
dist/
build/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# MongoDB
*.db
```

### 1.2 Initialize Git and Push to GitHub

```bash
# Navigate to project root
cd VibeCoders_Restaurant_Reservation_Full_Project/VibeCoders_Restaurant_Reservation

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Restaurant Reservation Management System"

# Create a new repository on GitHub (via web interface)
# Then connect and push:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend (Node.js/Express)

### Option A: Render (Recommended - Free tier available)

1. **Sign up/Login** at [render.com](https://render.com)

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Backend:**
   - **Name:** `restaurant-reservation-backend` (or any name)
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free

4. **Environment Variables:**
   - Click "Environment" tab
   - Add:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_secret_key_here_make_it_long_and_random
     PORT=10000
     NODE_ENV=production
     ```

5. **Get MongoDB URI:**
   - Option 1: Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier)
     - Sign up → Create cluster → Get connection string
   - Option 2: Use [Railway MongoDB](https://railway.app) (Free tier)

6. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy the URL (e.g., `https://restaurant-reservation-backend.onrender.com`)

### Option B: Railway

1. **Sign up** at [railway.app](https://railway.app)

2. **New Project:**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Configure:**
   - Root Directory: `server`
   - Add MongoDB service (Railway provides MongoDB)
   - Add environment variables:
     ```
     JWT_SECRET=your_secret_key
     PORT=provided_by_railway
     ```

4. **Deploy:**
   - Railway auto-deploys on push
   - Get your backend URL

## Step 3: Deploy Frontend (React/Vite)

### Option A: Vercel (Recommended - Free, fast)

1. **Sign up** at [vercel.com](https://vercel.com)

2. **Import Project:**
   - Click "Add New" → "Project"
   - Import from GitHub
   - Select your repository

3. **Configure:**
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Environment Variables:**
   - Add:
     ```
     VITE_API_BASE=https://your-backend-url.onrender.com
     ```
   - Replace with your actual backend URL

5. **Deploy:**
   - Click "Deploy"
   - Get your frontend URL (e.g., `https://restaurant-reservation.vercel.app`)

### Option B: Netlify

1. **Sign up** at [netlify.com](https://netlify.com)

2. **New Site from Git:**
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub → Select repository

3. **Build Settings:**
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/dist`

4. **Environment Variables:**
   - Site settings → Environment variables
   - Add:
     ```
     VITE_API_BASE=https://your-backend-url.onrender.com
     ```

5. **Deploy:**
   - Click "Deploy site"
   - Get your frontend URL

### Option C: Render (Same as backend)

1. **Create Static Site:**
   - Click "New +" → "Static Site"
   - Connect GitHub repository

2. **Configure:**
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

3. **Environment Variables:**
   ```
   VITE_API_BASE=https://your-backend-url.onrender.com
   ```

## Step 4: Update CORS Settings

Update `server/app.js` to allow your frontend domain:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend-url.vercel.app',
    'https://your-frontend-url.netlify.app'
  ],
  credentials: true
}));
```

Or for production, you can use:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

## Step 5: Seed Database

After backend is deployed, seed the tables:

1. **Option 1: Via Render Shell**
   - Go to your backend service on Render
   - Click "Shell" tab
   - Run:
     ```bash
     cd server
     node seed/tables.seed.js
     node seed/admin.seed.js
     ```

2. **Option 2: Via Local Machine**
   - Update `.env` with production MongoDB URI
   - Run seed scripts locally (they'll connect to production DB)

3. **Option 3: Create API Endpoint** (for admin use)
   - Add a seed endpoint in admin routes (temporary)

## Step 6: Update README with Deployment URLs

Update your README.md with:
- GitHub repository link
- Live frontend URL
- Live backend URL (optional, for API documentation)

## Quick Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed (Render/Railway)
- [ ] MongoDB database set up (Atlas/Railway)
- [ ] Environment variables configured
- [ ] Frontend deployed (Vercel/Netlify)
- [ ] Frontend environment variable (VITE_API_BASE) set
- [ ] CORS configured on backend
- [ ] Database seeded with tables
- [ ] Admin user created
- [ ] Tested end-to-end

## Troubleshooting

### Backend Issues:
- **Port:** Render uses port from `PORT` env var, Railway auto-assigns
- **MongoDB:** Ensure connection string is correct
- **Build:** Check build logs for errors

### Frontend Issues:
- **API Calls:** Verify `VITE_API_BASE` is set correctly
- **CORS:** Check backend CORS settings
- **Build:** Check build logs for errors

### Common Errors:
- **404 on API calls:** Check `VITE_API_BASE` includes `/api` prefix
- **CORS errors:** Update backend CORS to include frontend URL
- **Database connection:** Verify MongoDB URI is correct

## Example Environment Variables

### Backend (.env):
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/vibecoders?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env.production):
```env
VITE_API_BASE=https://your-backend.onrender.com
```

## Security Notes

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use strong JWT_SECRET** - Generate with: `openssl rand -base64 32`
3. **MongoDB credentials** - Keep secure, rotate if exposed
4. **CORS** - Only allow your frontend domains

## Free Tier Limits

- **Render:** Free tier has cold starts (first request may be slow)
- **Vercel:** Generous free tier, very fast
- **Netlify:** Good free tier
- **MongoDB Atlas:** 512MB free storage
- **Railway:** $5 free credit monthly

