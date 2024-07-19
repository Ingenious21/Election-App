const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');

const app = express();
const db = new sqlite3.Database('./elections.db');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'views')); // Updated path

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize the database table if not exists
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS roles (id INT AUTO_INCREMENT PRIMARY KEY, role VARCHAR(50) NOT NULL)')
  
    db.run('CREATE TABLE IF NOT EXISTS auth (id INT AUTO_INCREMENT PRIMARY KEY, user_name VARCHAR(50) NOT NULL, password VARCHAR(50) NOT NULL, user_id VARCHAR(50) NOT NULL)')
  
    db.run('CREATE TABLE IF NOT EXISTS user (id INT AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(50) NOT NULL, middle_name VARCHAR(50), last_name VARCHAR(50) NOT NULL, dob DATE NOT NULL, photo BLOB NOT NULL)')
  
    db.run('CREATE TABLE IF NOT EXISTS parties (id INT AUTO_INCREMENT PRIMARY KEY, party VARCHAR(80) NOT NULL, logo BLOB NOT NULL)')
  
    db.run('CREATE TABLE IF NOT EXISTS positions (id INT AUTO_INCREMENT PRIMARY KEY, position VARCHAR(50))')
  
    db.run('CREATE TABLE IF NOT EXISTS candidates (id INT AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(50) NOT NULL, middle_name VARCHAR(50), last_name VARCHAR(50) NOT NULL, position_id, party_id, photo BLOB, FOREIGN KEY (position_id) REFERENCES positions(id), FOREIGN KEY (party_id) REFERENCES parties(id))')
});

// Routes
app.get('/', (req, res) => {
  res.render('voter-registration');
});

app.get('/register-party', (req, res) => {
  res.render('party-registration');
});

app.get('/login', (req, res) => {
  res.render('login');
});

// Handle voter registration form submission
app.post('/voter-registration', upload.single('pp'), (req, res) => {
  const { username, password, firstname, middlename, lastname, dob } = req.body;
  const photo = req.file.buffer;

  const query = `INSERT INTO auth (username, password) VALUES (?, ?)`;

  db.run(query, [username, password], function(err) {
    if (err) {
      return res.status(500).send('Error inserting data');
    }
    res.send('Voter registered successfully!');
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
