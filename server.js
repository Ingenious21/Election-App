const express = require('express');
const bodyParser = require('body-parser');
const app = express();
let users = []; // Global variable to store user information

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.render('signup');
});

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    users.push({ username, password });
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.redirect('/dashboard');
    } else {
        res.send('Invalid login credentials');
    }
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
