# 🔥 Firebase Setup Guide for EasyMeals AI

## 📋 Prerequisites

- Google account
- Firebase project (free tier is sufficient for Lite version)

## 🚀 Step-by-Step Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `EasyMeals AI`
4. Enable Google Analytics (optional but recommended)
5. Click "Create project"

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Go to **Sign-in method** tab
4. Enable **Email/Password**
5. Click "Save"

### 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development)
4. Select location closest to your users
5. Click "Done"

### 4. Set Up Security Rules

In Firestore Database → Rules, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Subcollections
      match /{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### 5. Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Click **Add app** → **Web app**
4. Register app with name: `EasyMeals AI Web`
5. Copy the config object

### 6. Update App Configuration

Replace the placeholder config in `src/services/firebase.ts`:

```typescript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

### 7. Environment Variables (Optional)

Create `.env` file in project root:

```env
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
```

Then update `src/services/firebase.ts`:

```typescript
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};
```

## 🔧 Testing Firebase Connection

### Test Authentication

1. Run the app
2. Try to create an account
3. Check Firebase Console → Authentication → Users
4. Verify user appears in the list

### Test Firestore

1. Sign in to the app
2. Add a favorite recipe
3. Check Firebase Console → Firestore Database
4. Verify data appears in the database

## 📊 Firebase Analytics (Optional)

1. In Firebase Console, go to **Analytics**
2. Enable Google Analytics
3. Add tracking events in your app:

```typescript
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics();

// Track user actions
logEvent(analytics, 'recipe_viewed', {
    recipe_id: recipeId,
    recipe_name: recipeName
});
```

## 🔒 Security Best Practices

### 1. Environment Variables

- Never commit Firebase config to public repositories
- Use environment variables for sensitive data

### 2. Security Rules

- Always validate user authentication
- Restrict access to user's own data only
- Use proper Firestore security rules

### 3. API Key Restrictions

- In Google Cloud Console, restrict API keys
- Set up proper domain restrictions
- Monitor usage for unusual activity

## 🚀 Production Deployment

### 1. Update Security Rules

Change from test mode to production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### 2. Enable Additional Auth Methods (Pro Version)

- Google Sign-In
- Apple Sign-In (iOS)
- Phone Authentication

### 3. Set Up Monitoring

- Enable Firebase Crashlytics
- Set up performance monitoring
- Configure alerts for unusual activity

## 📱 App Store Considerations

### 1. Privacy Policy

- Update privacy policy to include Firebase
- Mention data collection and storage

### 2. App Store Listing

- Mention "Sign in with email" in features
- Include data sync capabilities

### 3. Testing

- Test offline functionality
- Verify data sync across devices
- Test authentication flows

## 🔧 Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check Firebase config
   - Verify Authentication is enabled
   - Check network connectivity

2. **Firestore permission denied**
   - Verify security rules
   - Check user authentication status
   - Ensure proper user ID matching

3. **Data not syncing**
   - Check internet connectivity
   - Verify Firestore rules
   - Check for JavaScript errors

### Debug Mode

Enable Firebase debug mode:

```typescript
import { connectFirestoreEmulator } from 'firebase/firestore';

if (__DEV__) {
    connectFirestoreEmulator(db, 'localhost', 8080);
}
```

## 📈 Monitoring & Analytics

### 1. Firebase Console

- Monitor user authentication
- Track Firestore usage
- View error reports

### 2. Custom Analytics

- Track feature usage
- Monitor user engagement
- Analyze conversion rates

### 3. Performance Monitoring

- Monitor app performance
- Track API response times
- Identify bottlenecks

## 🎯 Next Steps

1. ✅ Set up Firebase project
2. ✅ Configure authentication
3. ✅ Set up Firestore database
4. ✅ Test basic functionality
5. ✅ Deploy to production
6. 🔄 Monitor and optimize

---

**Need Help?** Check the [Firebase Documentation](https://firebase.google.com/docs) for detailed guides.
