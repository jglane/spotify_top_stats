const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.static('authenticate'));
app.use('/home', express.static('home'));

app.get('/env', (req, res) => {
    res.send({
        CLIENT_ID: process.env.CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET
    });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000')
});