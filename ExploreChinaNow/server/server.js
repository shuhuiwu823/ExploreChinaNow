const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.ChatGPT_API_KEY;

app.use(cookieParser());

app.use(express.static('./dist'));
app.use(express.json());

// Allow requests from your Vite static site
const allowedOrigins = ['https://explorechinanow-1de2.onrender.com','https://explorechinanow.onrender.com','https://explorechinanow-planserver.onrender.com','http://localhost:5173','http://localhost:3000','http://localhost:4000'];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // if using cookies/authentication
}));

// Serve static files from React's build folder
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all route for React Router
app.get('*', (req, res) => {
   res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.post('/api/chat', async (req, res) => {
    try {
      const userMessage = req.body.message;

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: userMessage }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.ChatGPT_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

app.get('/api/homepage', (req, res) => {
    res.json({test: 'successful'});
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

