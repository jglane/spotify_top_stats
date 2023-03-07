const express = require('express');
const ejs = require('ejs');
require('dotenv').config();

const app = express();

// Render files in the public folder first
app.use(express.static('public'));

app.set('view engine', 'ejs');

// Get environment variables
app.get('/env', (req, res) => {
    res.send({
        CLIENT_ID: process.env.CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET
    });
});

// render index.ejs
app.get('/', (req, res) => {
    res.render('pages/index');
});

// Render the artists page
app.get('/artists', (req, res) => {
    res.render('pages/home', {
        // EJS variable: server-side variable
        page_type: 'artists'
    });
});

// Render the tracks page
app.get('/tracks', (req, res) => {
    res.render('pages/home', {
        // EJS variable: server-side variable
        page_type: 'tracks'
    });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000')
});