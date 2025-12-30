# PowerShell Setup Guide for Windows

This guide provides PowerShell-specific commands for setting up and running the project on Windows.

## Initial Setup

### 1. Navigate to Project Directory

```powershell
cd "C:\Users\91849\Downloads\VibeCoders_Restaurant_Reservation_Full_Project\VibeCoders_Restaurant_Reservation_Full_Project\VibeCoders_Restaurant_Reservation"
```

### 2. Backend Setup

```powershell
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (use Notepad or VS Code)
# Copy the content from README.md and create .env file

# Seed tables (optional)
node seed/tables.seed.js

# Create admin user (optional)
node seed/admin.seed.js

# Start server
npm start
# OR
node server.js
```

### 3. Frontend Setup (New Terminal)

```powershell
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

## Git Commands (PowerShell)

### Initialize and Push to GitHub

```powershell
# Initialize git
git init

# Add all files
git add .

# Check what will be committed
git status

# Create initial commit
git commit -m "Initial commit: Restaurant Reservation Management System"

# Add remote repository (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

### Update Repository

```powershell
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push changes
git push
```

## Common PowerShell Commands

### Check Node.js and npm
```powershell
node --version
npm --version
```

### Check if MongoDB is running (if local)
```powershell
# Check MongoDB service
Get-Service MongoDB
```

### Generate JWT Secret (PowerShell)
```powershell
# Generate random secret
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

## Troubleshooting PowerShell Issues

### If git commands don't work:
```powershell
# Check if git is installed
git --version

# If not installed, download from: https://git-scm.com/download/win
```

### If npm commands fail:
```powershell
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
npm install
```

### Path with spaces:
```powershell
# Always use quotes for paths with spaces
cd "C:\Users\91849\Downloads\VibeCoders_Restaurant_Reservation_Full_Project"
```

### Permission errors:
```powershell
# Run PowerShell as Administrator if needed
# Right-click PowerShell → "Run as Administrator"
```

## Environment Variables in PowerShell

### Create .env file manually:
1. Open Notepad or VS Code
2. Create file named `.env` (no extension)
3. Add content:
   ```
   MONGO_URI=mongodb://127.0.0.1:27017/vibecoders
   JWT_SECRET=your-secret-key-here
   PORT=5000
   ```
4. Save in the `server` directory

### Or use PowerShell to create:
```powershell
cd server
@"
MONGO_URI=mongodb://127.0.0.1:27017/vibecoders
JWT_SECRET=your-secret-key-here
PORT=5000
"@ | Out-File -FilePath .env -Encoding utf8
```

## Running Both Servers

### Option 1: Two PowerShell Windows
- Window 1: Backend (`cd server` → `npm start`)
- Window 2: Frontend (`cd client` → `npm run dev`)

### Option 2: Background Jobs (PowerShell)
```powershell
# Start backend in background
Start-Job -ScriptBlock { cd server; npm start }

# Start frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev"
```

