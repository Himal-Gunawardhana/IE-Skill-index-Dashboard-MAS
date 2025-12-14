# GitHub Actions Deployment Setup

## Fix the Permission Error

The error `Permission denied to github-actions[bot]` occurs because GitHub Actions doesn't have write permissions. Follow these steps:

### Step 1: Enable GitHub Actions Write Permissions

1. Go to your GitHub repository: https://github.com/Himal-Gunawardhana/IE-Skill-index-Dashboard-MAS
2. Click **Settings** tab
3. In the left sidebar, click **Actions** → **General**
4. Scroll down to **Workflow permissions**
5. Select **"Read and write permissions"**
6. Check **"Allow GitHub Actions to create and approve pull requests"**
7. Click **Save**

### Step 2: Enable GitHub Pages

1. Still in **Settings**, scroll down the left sidebar to **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Under **Branch**, select **gh-pages** and **/ (root)**
4. Click **Save**

### Step 3: Commit and Push the Fixed Workflow

The workflow file has been updated with:
- ✅ Added `permissions` section
- ✅ Added attachment store environment variables
- ✅ Added git user config for the bot

### Step 4: Trigger the Workflow

After enabling the permissions:

```bash
git add .github/workflows/deploy.yml GITHUB_ACTIONS_SETUP.md
git commit -m "Fix GitHub Actions permissions for deployment"
git push origin main
```

The workflow will run automatically and deploy to GitHub Pages.

## Alternative: Deploy to Vercel (Easier!)

If you're getting frustrated with GitHub Pages, **Vercel is much simpler**:

### Quick Vercel Setup (2 minutes)

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click **"Add New Project"**
   - Select `IE-Skill-index-Dashboard-MAS`

2. **Configure Environment Variables**
   - Add all your Firebase variables:
     ```
     REACT_APP_FIREBASE_API_KEY
     REACT_APP_FIREBASE_AUTH_DOMAIN
     REACT_APP_FIREBASE_PROJECT_ID
     REACT_APP_FIREBASE_STORAGE_BUCKET
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID
     REACT_APP_FIREBASE_APP_ID
     REACT_APP_ATTACHMENT_FIREBASE_API_KEY
     REACT_APP_ATTACHMENT_FIREBASE_AUTH_DOMAIN
     REACT_APP_ATTACHMENT_FIREBASE_PROJECT_ID
     REACT_APP_ATTACHMENT_FIREBASE_STORAGE_BUCKET
     REACT_APP_ATTACHMENT_FIREBASE_MESSAGING_SENDER_ID
     REACT_APP_ATTACHMENT_FIREBASE_APP_ID
     ```

3. **Deploy**
   - Click **Deploy**
   - Done! 🎉

### Benefits of Vercel:
- ✅ Automatic deployments on every push
- ✅ Preview deployments for pull requests
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ No permission issues
- ✅ Much faster builds
- ✅ Better for React apps

## Current Setup Status

- **GitHub Pages**: Fixed workflow, needs repository permissions enabled
- **Vercel**: Recommended alternative (already configured if you followed previous setup)

## Which Should You Use?

| Feature | GitHub Pages | Vercel |
|---------|-------------|---------|
| Setup Time | 5 minutes | 2 minutes |
| Automatic Deploy | Yes | Yes |
| Custom Domain | Yes (more setup) | Yes (easy) |
| Build Speed | Slower | Faster |
| Preview Deploys | No | Yes |
| Analytics | No | Yes |
| **Recommended** | For static sites | **For React apps** ✅ |

## Troubleshooting

### If GitHub Actions still fails:

1. **Check Actions tab** for detailed error logs
2. **Verify** all environment variables are added to Secrets
3. **Ensure** branch name is exactly `main` (not `master`)
4. **Check** that `gh-pages` branch exists (will be created automatically on first run)

### If you want to remove GitHub Pages deployment:

```bash
# Delete the workflow file
rm .github/workflows/deploy.yml

# Commit and push
git add .
git commit -m "Remove GitHub Pages deployment, using Vercel instead"
git push origin main
```

Then use Vercel exclusively for deployments.

---

**Need help?** Check the workflow run in the **Actions** tab of your repository for detailed logs.
