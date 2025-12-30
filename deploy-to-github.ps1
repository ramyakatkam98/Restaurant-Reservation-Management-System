# PowerShell Script to Deploy to GitHub
# Run this script from the project root directory

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubUsername,
    
    [Parameter(Mandatory=$true)]
    [string]$RepositoryName
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GitHub Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
Write-Host "Checking Git installation..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✓ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git not found. Please install Git from https://git-scm.com/download/win" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Initializing Git repository..." -ForegroundColor Yellow

# Initialize git if not already done
if (-not (Test-Path ".git")) {
    git init
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✓ Git repository already initialized" -ForegroundColor Green
}

Write-Host ""
Write-Host "Adding files to Git..." -ForegroundColor Yellow
git add .
Write-Host "✓ Files added" -ForegroundColor Green

Write-Host ""
Write-Host "Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: Restaurant Reservation Management System"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Commit created" -ForegroundColor Green
} else {
    Write-Host "⚠ No changes to commit or commit already exists" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Setting up remote repository..." -ForegroundColor Yellow
$remoteUrl = "https://github.com/$GitHubUsername/$RepositoryName.git"

# Check if remote already exists
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "Remote 'origin' already exists: $existingRemote" -ForegroundColor Yellow
    $update = Read-Host "Update to $remoteUrl? (y/n)"
    if ($update -eq 'y' -or $update -eq 'Y') {
        git remote set-url origin $remoteUrl
        Write-Host "✓ Remote updated" -ForegroundColor Green
    }
} else {
    git remote add origin $remoteUrl
    Write-Host "✓ Remote added: $remoteUrl" -ForegroundColor Green
}

Write-Host ""
Write-Host "Renaming branch to main..." -ForegroundColor Yellow
git branch -M main
Write-Host "✓ Branch renamed to main" -ForegroundColor Green

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "Repository URL: $remoteUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠ Make sure you have:" -ForegroundColor Yellow
Write-Host "  1. Created the repository on GitHub first" -ForegroundColor White
Write-Host "  2. Authenticated with GitHub (Personal Access Token)" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "Ready to push? (y/n)"
if ($confirm -eq 'y' -or $confirm -eq 'Y') {
    git push -u origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "✓ Successfully pushed to GitHub!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Repository URL: https://github.com/$GitHubUsername/$RepositoryName" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "✗ Failed to push. Check your authentication." -ForegroundColor Red
        Write-Host "You may need to use a Personal Access Token instead of password." -ForegroundColor Yellow
    }
} else {
    Write-Host "Push cancelled. Run the script again when ready." -ForegroundColor Yellow
}

