require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

app.post('/chat', async (req, res) => {
    const history = req.body.history || [];
    const model = req.body.model || 'gemini-2.0-flash';
    
    const contents = history.map(item => ({
        role: item.role === 'user' ? 'user' : 'model',
        parts: [{ text: item.text }]
    }));
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const body = { contents };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': API_KEY
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        res.json({ reply: data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Bot chưa có câu trả lời.' });
    } catch (e) {
        res.json({ reply: 'Lỗi kết nối tới Gemini!' });
    }
});

app.listen(3000, () => console.log('Server chạy ở http://localhost:3000'));

