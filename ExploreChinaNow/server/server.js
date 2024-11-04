const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.static('./dist'));
app.use(express.json()); // Parses requests with json content bodies

app.get('/api/homepage', (req, res) => {
    res.json({test: 'successful'});
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));