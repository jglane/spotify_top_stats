const express = require('express');
const app = express();

app.use(express.static('webpage'));
app.use('/home', express.static('home'))

app.listen(3000, () => {
    console.log('Server listening on port 3000')
});