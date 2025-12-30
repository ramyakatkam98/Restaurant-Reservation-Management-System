# GitHub Setup Guide

## Step-by-Step Instructions to Push Code to GitHub

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Fill in:
   - **Repository name:** `restaurant-reservation-system` (or your preferred name)
   - **Description:** "Restaurant Reservation Management System - Full Stack Application"
   - **Visibility:** Public (or Private)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click "Create repository"

### Step 2: Initialize Git in Your Project

Open terminal/command prompt in your project root:

```bash
# Navigate to project root
cd "C:\Users\91849\Downloads\VibeCoders_Restaurant_Reservation_Full_Project\VibeCoders_Restaurant_Reservation_Full_Project\VibeCoders_Restaurant_Reservation"

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Restaurant Reservation Management System"
```

### Step 3: Connect to GitHub

```bash
# Add remote repository (replace with your actual repository URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 4: Verify Upload

1. Go to your GitHub repository page
2. You should see all your files
3. Check that `.env` files are NOT uploaded (they should be in `.gitignore`)

### Step 5: Future Updates

When you make changes:

```bash
# Check what changed
git status

# Add changed files
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push
```

## Important Notes

1. **Never commit sensitive data:**
   - `.env` files are in `.gitignore` - they won't be uploaded
   - Don't add API keys, passwords, or secrets to code

2. **Good commit messages:**
   - Be descriptive: "Fix authentication bug" not "fix"
   - Use present tense: "Add user validation" not "Added"

3. **Branch protection (optional):**
   - In GitHub settings, you can protect the main branch
   - Require pull requests for changes

## Troubleshooting

### If you get "repository not found":
- Check the repository URL is correct
- Verify you have access to the repository
- Make sure you're logged into GitHub

### If you get "authentication failed":
- Use GitHub Personal Access Token instead of password
- Generate token: GitHub Settings → Developer settings → Personal access tokens
- Use token as password when pushing

### If files are too large:
- Check `.gitignore` includes `node_modules/`
- Don't commit build files (`dist/`, `build/`)

