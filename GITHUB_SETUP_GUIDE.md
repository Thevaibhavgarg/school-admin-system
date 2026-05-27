# 🚀 GitHub Setup & Deployment Guide

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click **"New"** or go to https://github.com/new
3. Fill in:
   - **Repository name:** `school-admin-system` (or your choice)
   - **Description:** `School Administration System - Spring Boot & React`
   - **Public** or **Private** (your choice)
   - ✅ **Initialize repository:** Choose NO (we'll push existing code)
4. Click **"Create repository"**

## Step 2: Push Your Project to GitHub

In your project's root directory, run these commands:

```bash
# Initialize Git (if not already done)
git init

# Add GitHub as origin
git remote add origin https://github.com/YOUR_USERNAME/school-admin-system.git

# Add all files (respects .gitignore)
git add .

# Create first commit
git commit -m "Initial commit: School Administration System"

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace** `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Verify What's Pushed ✅

After pushing, verify on GitHub that these folders/files are there:
- ✅ `school-admin-backend/` (Java backend)
- ✅ `school-admin-frontend/` (React frontend)
- ✅ `README.md` (Project documentation)
- ✅ `.gitignore` (Prevents unnecessary files)
- ❌ `target/` (should NOT be there - .gitignore blocks it)
- ❌ `node_modules/` (should NOT be there - .gitignore blocks it)

## Step 4: Setup Instructions for Collaborators

When others clone your repository, they should:

### Backend Setup
```bash
cd school-admin-backend

# 1. Update database config in application.properties
# Edit: src/main/resources/application.properties
# Set PostgreSQL credentials

# 2. Install & Run
mvn clean install
mvn spring-boot:run

# Server will start on http://localhost:8080
# Database will auto-initialize with data.sql
```

### Frontend Setup
```bash
cd school-admin-frontend

# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# App will be available at http://localhost:5173
```

### Default Login Credentials
- **Username:** `admin`
- **Password:** `password`

---

## 📊 How Data is Seeded (Automatic)

Your project uses `data.sql` for automatic data initialization:

```
school-admin-backend/src/main/resources/data.sql
```

**How it works:**
1. When Spring Boot starts, it reads `data.sql`
2. Inserts sample data into PostgreSQL
3. Your collaborators can immediately see working data
4. **data.sql is committed to Git** ✅ (included in repo)

**Note:** The data.sql is already in your project at:
```
school-admin-backend/src/main/resources/data.sql
```

## 🔐 Environment Variables

**For local development:**
1. Copy `.env.example` to `.env`
2. Update with your local database credentials
3. ✅ `.env` is in `.gitignore` (not pushed to GitHub - SAFE)
4. Share `.env.example` instead (template only)

## 📋 Before Each Push

Always run:
```bash
# Backend
cd school-admin-backend
mvn clean

# Frontend  
cd school-admin-frontend
rm -rf node_modules

# Then commit & push
git add .
git commit -m "Your message"
git push
```

## 🆘 Troubleshooting

**Q: I got "remote already exists" error**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/school-admin-system.git
```

**Q: Sensitive files were pushed**
```bash
git rm -r --cached .
git add .
git commit -m "Remove sensitive files"
git push
```

**Q: Others want latest changes**
```bash
git clone https://github.com/YOUR_USERNAME/school-admin-system.git
# Follow Backend & Frontend setup steps
```

## ✨ Additional Tips

- Create a `.github/workflows/` folder for CI/CD pipelines
- Add a `CONTRIBUTING.md` for collaboration guidelines
- Use GitHub Issues for bug tracking
- Add branch protection rules for `main` branch
- Create releases with version tags

---

**Your project is ready to share! 🎉**
