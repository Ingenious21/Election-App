const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'views')); // Updated path

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('voter-registration');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
