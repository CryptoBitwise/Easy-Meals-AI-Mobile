const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting for beta testers
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Your OpenAI API key (hidden from users)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Proxy endpoint for OpenAI API calls
app.post('/api/ai/chat', async (req, res) => {
    try {
        const { messages, temperature = 0.7 } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format' });
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages,
                temperature,
                max_tokens: 500,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenAI API error:', response.status, errorText);
            return res.status(response.status).json({
                error: `OpenAI API error: ${response.status}`
            });
        }

        const result = await response.json();
        res.json({
            success: true,
            response: result.choices[0]?.message?.content || 'No response from AI'
        });

    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'EasyMeal AI Backend Proxy' });
});

app.listen(PORT, () => {
    console.log(`🚀 EasyMeal AI Backend Proxy running on port ${PORT}`);
    console.log(`📊 Rate limited to 100 requests per 15 minutes per IP`);
}); 