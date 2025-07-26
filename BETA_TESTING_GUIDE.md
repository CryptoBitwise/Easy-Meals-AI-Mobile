# 🧪 EasyMeal AI Beta Testing Guide

## **🎯 Overview**

This guide helps you set up beta testing with your own API key while keeping it secure from testers.

## **🔐 Security Approach**

- **Your API key stays private** - Only you have access
- **Rate limiting** - Prevent abuse during testing
- **Usage monitoring** - Track how much your key is being used
- **Easy switch** - Toggle between beta mode and production

## **🚀 Setup Steps**

### **1. Deploy Backend Proxy**

#### **Option A: Heroku (Recommended)**

```bash
# Install Heroku CLI
# Create new Heroku app
heroku create your-easymeal-proxy

# Add environment variables
heroku config:set OPENAI_API_KEY=your_actual_openai_key
heroku config:set RATE_LIMIT_MAX_REQUESTS=100
heroku config:set RATE_LIMIT_WINDOW_MS=900000

# Deploy
cd backend-proxy
git init
git add .
git commit -m "Initial backend proxy"
git push heroku main
```

#### **Option B: Railway**

```bash
# Connect your GitHub repo to Railway
# Add environment variables in Railway dashboard
# Deploy automatically
```

#### **Option C: Vercel**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd backend-proxy
vercel --prod
```

### **2. Update App Configuration**

Edit `src/config/api.ts`:

```typescript
export const API_CONFIG = {
    // Your deployed backend URL
    BACKEND_URL: 'https://your-easymeal-proxy.herokuapp.com',
    
    // Beta testing mode
    BETA_MODE: true, // Set to false for production
};
```

### **3. Test the Setup**

1. **Start your app**: `npm start`
2. **Test AI features** - They should work without users needing API keys
3. **Check backend logs** - Monitor usage in your hosting platform

## **📊 Monitoring Usage**

### **Heroku Logs**

```bash
heroku logs --tail
```

### **Usage Tracking**

Your backend proxy includes:

- **Rate limiting**: 100 requests per 15 minutes per IP
- **Error logging**: All API errors are logged
- **Health endpoint**: `/api/health` to check if backend is running

## **🔄 Switching to Production**

When ready for app store release:

1. **Update config**:

```typescript
// src/config/api.ts
BETA_MODE: false
```

2. **Remove API key input** from Account Settings (optional)
3. **Users provide their own keys** for production

## **💰 Cost Control**

### **OpenAI API Costs**

- **GPT-4o-mini**: ~$0.15 per 1M tokens
- **Typical chat**: ~500 tokens per response
- **100 requests**: ~$0.0075

### **Monthly Estimates**

- **10 testers, 50 requests/day each**: ~$11.25/month
- **20 testers, 30 requests/day each**: ~$13.50/month

## **🛡️ Security Features**

### **Rate Limiting**

- **100 requests per 15 minutes** per IP address
- **Prevents abuse** and controls costs
- **Configurable** in environment variables

### **Error Handling**

- **No API key exposure** in error messages
- **Graceful fallbacks** for network issues
- **Detailed logging** for debugging

## **📱 Beta Testing Workflow**

### **For Testers**

1. **Download app** from your beta distribution
2. **No API key needed** - Everything works automatically
3. **Test all AI features** - Chat, recommendations, etc.
4. **Report bugs** - Use your preferred feedback system

### **For You**

1. **Monitor usage** in hosting platform dashboard
2. **Check logs** for errors or abuse
3. **Adjust rate limits** if needed
4. **Collect feedback** from testers

## **🔧 Troubleshooting**

### **Common Issues**

**Backend not responding:**

- Check if deployed correctly
- Verify environment variables
- Check hosting platform logs

**Rate limit errors:**

- Increase `RATE_LIMIT_MAX_REQUESTS` in environment
- Or extend `RATE_LIMIT_WINDOW_MS`

**API errors:**

- Verify your OpenAI API key is valid
- Check OpenAI account for usage limits
- Review backend logs for specific errors

## **🎯 Next Steps**

1. **Deploy backend proxy** using one of the options above
2. **Update your app** with the new backend URL
3. **Test thoroughly** before sending to beta testers
4. **Distribute beta** through TestFlight (iOS) or Google Play Console (Android)
5. **Monitor usage** and collect feedback
6. **Switch to production** when ready for app store release

## **💡 Pro Tips**

- **Start small** - Test with 5-10 users first
- **Monitor costs** - Set up billing alerts
- **Backup plan** - Keep direct API option as fallback
- **Document everything** - For smooth production transition

**Your beta testers will have a seamless experience while you maintain full control over your API key!** 🚀
