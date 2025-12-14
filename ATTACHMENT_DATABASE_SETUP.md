# Attachment Store - Separate Database Setup Guide

## Why a Separate Database?

The Attachment Store system uses a **separate Firebase database** to:
- Keep attachment inventory data isolated from skill assessment data
- Allow different access controls and security rules
- Enable independent scaling and management
- Prevent data conflicts between systems

## 🚀 Quick Setup (5 Minutes)

### Option 1: Use Same Database (Easiest - Already Done!)

For testing and development, I've configured it to use the **same Firebase database** as your skill assessment system. The Attachment Store should work immediately!

**Current Configuration:**
- ✅ Using existing Firebase project: `ie-skill-index`
- ✅ Separate collections: `attachmentTypes`, `locations`, `attachmentInventory`, `attachmentTransactions`
- ✅ No additional setup needed

**Just click the "Attachment Store" button to start using it!**

---

### Option 2: Create Separate Database (Recommended for Production)

Follow these steps if you want a completely separate Firebase project:

#### Step 1: Create New Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"**
3. Name it: **"MKB Attachment Store"** or similar
4. Disable Google Analytics (optional)
5. Click **"Create project"**

#### Step 2: Enable Firestore

1. In your new project, go to **Firestore Database**
2. Click **"Create database"**
3. Start in **production mode**
4. Choose location: **(us-central)** or nearest
5. Click **"Enable"**

#### Step 3: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"**
3. Click **Web icon** `</>`
4. Register app: **"Attachment Store"**
5. Copy the configuration values

#### Step 4: Update Environment Variables

1. Open your `.env` file
2. Replace the `REACT_APP_ATTACHMENT_*` variables:

```env
# Attachment Store - Separate Firebase Database
REACT_APP_ATTACHMENT_FIREBASE_API_KEY=your_new_api_key
REACT_APP_ATTACHMENT_FIREBASE_AUTH_DOMAIN=your_new_project.firebaseapp.com
REACT_APP_ATTACHMENT_FIREBASE_PROJECT_ID=your_new_project_id
REACT_APP_ATTACHMENT_FIREBASE_STORAGE_BUCKET=your_new_project.firebasestorage.app
REACT_APP_ATTACHMENT_FIREBASE_MESSAGING_SENDER_ID=your_new_sender_id
REACT_APP_ATTACHMENT_FIREBASE_APP_ID=your_new_app_id
```

#### Step 5: Set Security Rules

In Firestore Database → Rules, add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Attachment Types
    match /attachmentTypes/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Locations
    match /locations/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Inventory
    match /attachmentInventory/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Transactions
    match /attachmentTransactions/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

#### Step 6: Restart Development Server

```bash
# Stop the server (Ctrl+C)
npm start
```

## 📊 Database Collections

The Attachment Store creates 4 collections:

### 1. `attachmentTypes`
Stores attachment definitions (WA001, WA006, etc.)

### 2. `locations`
Storage locations (Main Stock, Line 1, Line 2, etc.)

### 3. `attachmentInventory`
Current stock levels by type and location

### 4. `attachmentTransactions`
Complete history of all operations

## 🎯 First-Time Setup

### Initialize Default Data

1. Go to **Attachment Store** page
2. Click **Settings** tab
3. Add locations:
   - **Main Stock** - Central inventory
   - **Line 1** - Production Line 1
   - **Line 2** - Production Line 2
   - (Add more as needed)

4. Add attachment types (or use pre-configured):
   - **WA001** - Walking Foot Attachment
   - **WA006** - Zipper Foot
   - **WA011** - Button Hole Attachment
   - **WA022** - Hemming Foot
   - **WA033** - Overlock Attachment

5. Add initial stock using **"Add to Stock"** button

## ✅ Verify Setup

1. Click **"Attachment Store"** in header
2. You should see the dashboard with tabs
3. Go to **Settings** tab
4. Add a test location
5. Add a test attachment type
6. If successful, you're ready to go! 🎉

## 🔧 Troubleshooting

### Issue: "Attachment Store Database Not Configured"

**Solution:** 
- Check that environment variables are added to `.env`
- Restart development server
- Verify variable names start with `REACT_APP_ATTACHMENT_`

### Issue: "Permission denied" errors

**Solution:**
- Update Firestore security rules (see Step 5 above)
- Ensure you're logged in

### Issue: Data not saving

**Solution:**
- Check browser console for errors
- Verify Firebase project is enabled
- Check internet connection

## 🚀 For Vercel Deployment

When deploying to Vercel, add the same environment variables:

1. Go to Vercel project settings
2. Environment Variables section
3. Add all `REACT_APP_ATTACHMENT_*` variables
4. Redeploy

## 📝 Current Status

**✅ READY TO USE!**

The system is currently configured to use your existing Firebase project (`ie-skill-index`). The Attachment Store will work immediately with separate collections.

**You can start using it right now by clicking the "Attachment Store" button!**

---

**For questions or issues, refer to ATTACHMENT_STORE_GUIDE.md for usage instructions.**
