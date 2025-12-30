# PowerShell Setup Script for Restaurant Reservation System
# Run this script from the project root directory

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Restaurant Reservation System Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
Write-Host "Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found. Please install npm" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Setting up Backend..." -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan

# Backend setup
Set-Location server
if (Test-Path "node_modules") {
    Write-Host "Backend dependencies already installed." -ForegroundColor Yellow
} else {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
}

# Check for .env file
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    @"
MONGO_URI=mongodb://127.0.0.1:27017/vibecoders
JWT_SECRET=dev-secret-key-change-in-production
PORT=5000
"@ | Out-File -FilePath .env -Encoding utf8
    Write-Host "✓ .env file created. Please update with your MongoDB URI." -ForegroundColor Green
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

Set-Location ..

Write-Host ""
Write-Host "Setting up Frontend..." -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan

# Frontend setup
Set-Location client
if (Test-Path "node_modules") {
    Write-Host "Frontend dependencies already installed." -ForegroundColor Yellow
} else {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
}

Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Make sure MongoDB is running" -ForegroundColor White
Write-Host "2. Update server/.env with your MongoDB connection string" -ForegroundColor White
Write-Host "3. Seed the database: cd server; node seed/tables.seed.js" -ForegroundColor White
Write-Host "4. Create admin user: cd server; node seed/admin.seed.js" -ForegroundColor White
Write-Host "5. Start backend: cd server; npm start" -ForegroundColor White
Write-Host "6. Start frontend: cd client; npm run dev" -ForegroundColor White
Write-Host ""

