# EasyMeal AI Backend Proxy

This is the backend proxy for EasyMeal AI beta testing. It securely handles OpenAI API calls without exposing your API key to users.

## 🚀 Quick Deploy

### Railway (Recommended)

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select this repository and set the root directory to `backend-proxy`
4. Add environment variables:
   - `OPENAI_API_KEY` = your OpenAI API key
   - `PORT` = 3001 (optional, Railway sets this automatically)
5. Deploy!

### Heroku

```bash
cd backend-proxy
heroku create your-easymeal-proxy
heroku config:set OPENAI_API_KEY=your_openai_key_here
git push heroku main
```

### Vercel

```bash
cd backend-proxy
vercel --prod
```

## 🔧 Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `PORT` - Server port (optional, defaults to 3001)
- `RATE_LIMIT_MAX_REQUESTS` - Rate limit per window (optional, defaults to 100)
- `RATE_LIMIT_WINDOW_MS` - Rate limit window in ms (optional, defaults to 900000)

## 📊 Usage

Once deployed, your proxy will be available at:

- Railway: `https://your-app-name.railway.app`
- Heroku: `https://your-app-name.herokuapp.com`
- Vercel: `https://your-app-name.vercel.app`

Update your app's `src/config/api.ts` with the deployed URL.

## 🛡️ Security Features

- Rate limiting (100 requests per 15 minutes per IP)
- No API key exposure in error messages
- CORS enabled for mobile app access
- Health check endpoint at `/api/health`

## 📝 API Endpoints

- `POST /api/ai/chat` - Main AI chat endpoint
- `GET /api/health` - Health check endpoint
