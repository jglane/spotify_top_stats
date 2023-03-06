const express = require('express');
const ejs = require('ejs');
require('dotenv').config();

const app = express();

// Render files in the public folder
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/env', (req, res) => {
    res.send({
        CLIENT_ID: process.env.CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET
    });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000')
});

app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/artists', (req, res) => {
    res.render('pages/home', {
        // EJS variable: server-side variable
        page_type: 'artists'
    });
});

app.get('/tracks', (req, res) => {
    res.render('pages/home', {
        // EJS variable: server-side variable
        page_type: 'tracks'
    });
});