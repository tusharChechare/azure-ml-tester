# 🚀 Deployment Guide - ML API Tester

This guide walks you through deploying the ML API Tester to Azure Static Web Apps.

## 📋 Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [GitHub Account](https://github.com/)
- [Azure Account](https://azure.microsoft.com/free/) (free tier works!)

---

## 🎯 Quick Deploy (5 Minutes)

### Step 1: Push to GitHub

```bash
# Navigate to project
cd ML_Model_Test_App

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/ml-api-tester.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Azure

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **"Create a resource"**
3. Search **"Static Web Apps"** → Click **Create**
4. Fill in:
   - **Name**: `ml-api-tester`
   - **Plan**: Free
   - **Source**: GitHub
   - **Repository**: Select your repo
   - **Branch**: `main`
   - **Build Preset**: Next.js
   - **App location**: `/`
   - **Output location**: `.next`
5. Click **Review + Create** → **Create**

### Step 3: Done! 🎉

Your app will be live at: `https://[random-name].azurestaticapps.net`

---

## 📖 Detailed Deployment Steps

### Phase 1: Prepare Your Code

#### 1.1 Verify Build Works Locally

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Test locally
npm run start
```

Open http://localhost:3000 to verify everything works.

#### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `ml-api-tester`
3. Description: "Educational ML API Testing Tool for Azure ML"
4. Visibility: Public (or Private)
5. Click **Create repository**

#### 1.3 Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit - ML API Tester"
git remote add origin https://github.com/YOUR_USERNAME/ml-api-tester.git
git branch -M main
git push -u origin main
```

---

### Phase 2: Azure Static Web Apps Setup

#### 2.1 Create Azure Account

**Option A: Free Account**
- Go to https://azure.microsoft.com/free/
- Get $200 credit for 30 days

**Option B: Student Account (Recommended for educators)**
- Go to https://azure.microsoft.com/free/students/
- Get $100 credit, no credit card required!

#### 2.2 Create Static Web App

1. Sign in to [Azure Portal](https://portal.azure.com)

2. Click **"+ Create a resource"**

3. Search for **"Static Web Apps"**

4. Click **Create**

5. **Basics Tab:**
   | Field | Value |
   |-------|-------|
   | Subscription | Your subscription |
   | Resource group | Create new: `ml-tester-rg` |
   | Name | `ml-api-tester` |
   | Plan type | Free |
   | Region | East US (or closest) |
   | Source | GitHub |

6. Click **"Sign in with GitHub"** and authorize Azure

7. **Build Details:**
   | Field | Value |
   |-------|-------|
   | Organization | Your GitHub username |
   | Repository | `ml-api-tester` |
   | Branch | `main` |
   | Build Presets | Next.js |
   | App location | `/` |
   | API location | (leave empty) |
   | Output location | `.next` |

8. Click **"Review + create"** → **"Create"**

#### 2.3 Monitor Deployment

1. Go to your GitHub repository
2. Click **Actions** tab
3. Watch the workflow run
4. Wait for green checkmark ✅

#### 2.4 Access Your App

1. Go back to Azure Portal
2. Open your Static Web App resource
3. Copy the **URL** from the overview page
4. Open it in your browser!

---

### Phase 3: Post-Deployment

#### 3.1 Custom Domain (Optional)

1. In Azure Portal, open your Static Web App
2. Go to **Custom domains**
3. Click **+ Add**
4. Follow the DNS configuration steps

#### 3.2 Environment Variables (If needed)

1. Go to **Configuration** in your Static Web App
2. Add any environment variables
3. Click **Save**

---

## 🔧 Troubleshooting

### Build Fails

**Error: "npm ci" failed**
```bash
# Make sure package-lock.json exists
npm install
git add package-lock.json
git commit -m "Add package-lock.json"
git push
```

### Page Not Loading

Check if the output location is correct:
- For Next.js: `.next`
- For static export: `out`

### API Routes Not Working

Azure Static Web Apps needs API routes in a specific format. The proxy we built should work automatically.

---

## 🎓 Teaching Tips

### Demonstrate the Deployment Process

1. **Show the GitHub Actions** - Students see CI/CD in action
2. **Explain the build process** - npm install → npm build → deploy
3. **Show Azure Portal** - Introduce cloud infrastructure
4. **Custom domain** - Explain DNS if time permits

### Student Exercise

Have students:
1. Fork your repository
2. Deploy their own instance
3. Test with their own Azure ML endpoints
4. Compare results with classmates

---

## 📊 Cost Summary

| Resource | Cost |
|----------|------|
| Azure Static Web Apps (Free tier) | $0 |
| GitHub Repository | $0 |
| Custom Domain | $0-12/year (optional) |
| **Total** | **$0** |

---

## 🔗 Useful Links

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [Next.js on Azure](https://docs.microsoft.com/azure/static-web-apps/deploy-nextjs)
- [GitHub Actions](https://docs.github.com/actions)
- [Azure for Students](https://azure.microsoft.com/free/students/)

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Azure account created
- [ ] Static Web App created
- [ ] GitHub connected to Azure
- [ ] Build successful (green checkmark)
- [ ] App accessible via URL
- [ ] Tested with Azure ML endpoint
- [ ] (Optional) Custom domain configured

---

Happy Deploying! 🚀




