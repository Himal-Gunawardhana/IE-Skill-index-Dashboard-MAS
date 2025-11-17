# Deployment Guide - IE Skill Index Dashboard

## 🚀 Deploy to Vercel (Recommended)

### Step 1: Push Your Code to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy to Vercel

1. **Go to [Vercel](https://vercel.com)**
2. Click **"Sign Up"** or **"Login"** with GitHub
3. Click **"Add New Project"**
4. **Import your GitHub repository**: `IE-Skill-index-Dashboard-MAS`
5. **Configure Project**:
   - Framework Preset: `Create React App`
   - Root Directory: `./`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `build` (auto-detected)

6. **Add Environment Variables** (Critical Step):
   Click on **"Environment Variables"** and add these from your `.env` file:
   
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
   REACT_APP_FIREBASE_APP_ID=your_app_id_here
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
   ```

7. Click **"Deploy"**
8. Wait 2-3 minutes for the build to complete
9. Your dashboard will be live at `https://your-project.vercel.app`

### Step 3: Configure Firebase for Production

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your Vercel domain: `your-project.vercel.app`

### Step 4: Set Up Automatic Deployments

Vercel automatically deploys when you push to GitHub:
- **Push to `main`** → Deploys to production
- **Pull Requests** → Creates preview deployments

---

## 📦 Alternative: Deploy to GitHub Pages

If you prefer GitHub Pages (free but requires more setup):

### Step 1: Install GitHub Pages Package

```bash
npm install --save-dev gh-pages
```

### Step 2: Update package.json

Add these lines to `package.json`:

```json
{
  "homepage": "https://Himal-Gunawardhana.github.io/IE-Skill-index-Dashboard-MAS",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

### Step 3: Configure React Router for GitHub Pages

Since GitHub Pages doesn't support client-side routing, you need to:

1. Use **HashRouter** instead of **BrowserRouter** in `src/App.tsx`:
   ```typescript
   import { HashRouter as Router } from 'react-router-dom';
   ```

2. Or set up a custom 404 redirect (more complex)

### Step 4: Deploy

```bash
npm run deploy
```

### Step 5: Configure GitHub Repository

1. Go to your GitHub repository settings
2. Navigate to **Pages** section
3. Set source to `gh-pages` branch
4. Your site will be available at the URL shown

### Step 6: Update Firebase Authorized Domains

Add `Himal-Gunawardhana.github.io` to Firebase authorized domains.

---

## 🔒 Security Checklist

- [x] `.env` file is in `.gitignore`
- [ ] Environment variables added to Vercel/hosting platform
- [ ] Firebase authorized domains configured
- [ ] Firebase Firestore security rules configured
- [ ] Firebase Authentication enabled

---

## 🔄 Continuous Deployment

### Vercel (Automatic)
- Every push to `main` → Production deployment
- Every PR → Preview deployment
- Instant rollbacks available

### GitHub Pages (Manual)
- Run `npm run deploy` to update
- Takes 2-5 minutes to reflect changes

---

## 📊 Post-Deployment Checklist

1. **Test Login** - Ensure Firebase authentication works
2. **Check Data Loading** - Verify Firestore data displays correctly
3. **Test All Pages** - Navigate through all 8 pages
4. **Mobile Responsiveness** - Check on mobile devices
5. **Performance** - Use Lighthouse to check performance scores
6. **Environment Variables** - Confirm all env vars are loaded

---

## 🐛 Common Issues & Solutions

### Issue: "Firebase is not configured"
**Solution**: Make sure all environment variables are added to Vercel

### Issue: "Blank page after deployment"
**Solution**: Check browser console for errors, verify Firebase config

### Issue: "Authentication fails"
**Solution**: Add your deployment domain to Firebase authorized domains

### Issue: "404 on page refresh" (GitHub Pages)
**Solution**: Use HashRouter instead of BrowserRouter

---

## 🌐 Custom Domain Setup (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as shown
4. SSL certificate added automatically

### GitHub Pages
1. Add `CNAME` file to `public` folder with your domain
2. Update DNS records to point to GitHub Pages
3. Enable HTTPS in repository settings

---

## 📈 Monitoring & Analytics

- **Vercel Analytics**: Enable in project settings for free
- **Firebase Analytics**: Already configured in your app
- **Performance Monitoring**: Available in Firebase console

---

## 💡 Recommendations

✅ **Use Vercel** for:
- Professional deployments
- Easy environment variable management
- Automatic deployments
- Better performance
- Preview deployments for testing

⚠️ **Use GitHub Pages** for:
- Simple static sites
- When you don't need environment variables
- Educational/portfolio projects

**For your IE Skill Index Dashboard with Firebase integration, Vercel is the better choice!**
