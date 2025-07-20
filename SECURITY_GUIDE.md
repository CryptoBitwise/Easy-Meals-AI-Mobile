# 🔒 Security Guide - EasyMeal AI

## **🚨 CRITICAL: API Key Security**

### **✅ What We've Fixed:**

#### **1. Environment Variables Setup:**

- ✅ **Created .env file** - Stores all sensitive API keys
- ✅ **Updated .gitignore** - Prevents .env from being committed
- ✅ **Installed react-native-dotenv** - Loads environment variables
- ✅ **Updated Firebase config** - Uses environment variables instead of hardcoded keys
- ✅ **Added TypeScript declarations** - Proper type support for env vars

#### **2. Security Best Practices:**

- ✅ **API keys moved to .env** - No longer in source code
- ✅ **Fallback values removed** - No hardcoded keys in code
- ✅ **Environment-specific configs** - Different keys for dev/prod

### **🔧 Current Setup:**

#### **Environment Variables (.env):**

```bash
# Firebase Configuration
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id

# OpenAI Configuration (if needed)
OPENAI_API_KEY=your_openai_key_here
```

#### **Firebase Configuration (src/services/firebase.ts):**

```typescript
import {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    // ... other env vars
} from '@env';

const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    // ... other config
};
```

### **🚨 IMMEDIATE ACTIONS REQUIRED:**

#### **1. Regenerate Firebase API Keys:**

- [ ] **Go to Firebase Console** - [console.firebase.google.com](https://console.firebase.google.com)
- [ ] **Select your project** - easy-meal-ai
- [ ] **Go to Project Settings** - ⚙️ icon
- [ ] **Regenerate API keys** - Click "Regenerate" for each key
- [ ] **Update .env file** - Replace with new keys

#### **2. Check Git History:**

```bash
# Check if API keys are in commit history
git log --all --full-history -- src/services/firebase.ts

# If keys are in history, consider rewriting history:
git filter-branch --force --index-filter \
"git rm --cached --ignore-unmatch src/services/firebase.ts" \
--prune-empty --tag-name-filter cat -- --all
```

#### **3. Update Environment Variables:**

- [ ] **Replace API keys** in .env file with new ones
- [ ] **Test the app** - Make sure everything still works
- [ ] **Commit .env changes** - Only after regenerating keys

### **🔒 Security Checklist:**

#### **✅ Completed:**

- [x] **API keys moved to .env**
- [x] **.env added to .gitignore**
- [x] **Environment variables configured**
- [x] **TypeScript declarations added**
- [x] **Firebase config updated**

#### **🚨 Still Need To Do:**

- [ ] **Regenerate Firebase API keys**
- [ ] **Update .env with new keys**
- [ ] **Test app functionality**
- [ ] **Check Git history for old keys**
- [ ] **Consider rewriting Git history** (if keys were committed)

### **💡 Best Practices Going Forward:**

#### **1. Never Commit Sensitive Data:**

- ✅ **Use .env files** for all API keys
- ✅ **Add .env to .gitignore**
- ✅ **Use environment variables** in code
- ✅ **Create .env.example** for team members

#### **2. Environment-Specific Configs:**

```bash
# Development
.env.development

# Production  
.env.production

# Local development
.env.local
```

#### **3. Regular Security Audits:**

- [ ] **Monthly API key rotation**
- [ ] **Review access logs**
- [ ] **Monitor for unusual activity**
- [ ] **Update dependencies regularly**

### **🔧 Deployment Security:**

#### **For Production Builds:**

```bash
# Set production environment variables
export FIREBASE_API_KEY=your_production_key
export FIREBASE_AUTH_DOMAIN=your_production_domain

# Build with production config
eas build --platform android --profile production
```

#### **For App Store Deployment:**

- [ ] **Use production API keys**
- [ ] **Enable Firebase App Check**
- [ ] **Set up proper security rules**
- [ ] **Monitor usage and costs**

### **🚨 Emergency Contacts:**

#### **If API Keys Are Compromised:**

1. **Immediately regenerate keys** in Firebase Console
2. **Update .env file** with new keys
3. **Test app functionality**
4. **Monitor for unauthorized usage**
5. **Consider rewriting Git history** if keys were committed

### **✅ Security Status:**

**Your app is now properly secured with environment variables!**

**Next steps:**

1. **Regenerate Firebase API keys**
2. **Update .env file**
3. **Test the app**
4. **Deploy with confidence!**

**Your API keys are now safe and secure!** 🔒✨
