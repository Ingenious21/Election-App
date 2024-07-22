const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');

const app = express();
const db = new sqlite3.Database('./elections.db');

// Set up EJS view engine and static files directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse URL-encoded and JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize the database tables if they do not exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS auth (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL,
    password TEXT NOT NULL,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES user(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    dob DATE NOT NULL,
    photo BLOB NOT NULL,
    auth_id INTEGER,
    FOREIGN KEY (auth_id) REFERENCES auth(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS parties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    party TEXT NOT NULL,
    logo BLOB NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS positions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    position TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    position_id INTEGER,
    party_id INTEGER,
    photo BLOB,
    FOREIGN KEY (position_id) REFERENCES positions(id),
    FOREIGN KEY (party_id) REFERENCES parties(id)
  )`);
});

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/reg-to-vote', (req, res) => {
  res.render('voter-registration');
});

app.get('/reg-party', (req, res) => {
  res.render('party-registration');
});

app.post('/voter-registration', upload.single('photo'), (req, res) => {
  const { username, password, confirmPassword, firstname, middlename, lastname, dob } = req.body;
  const photo = req.file ? req.file.buffer : null;

  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match.');
  }

  // Insert into the auth table
  db.run('INSERT INTO auth (user_name, password, user_id) VALUES (?, ?, ?)', [username, password, username], function(err) {
    if (err) {
      return res.status(500).send('Error inserting data into the auth table.');
    }
    const authId = this.lastID;

    // Insert into the user table
    db.run('INSERT INTO user (first_name, middle_name, last_name, dob, photo, auth_id) VALUES (?, ?, ?, ?, ?, ?)', [firstname, middlename, lastname, dob, photo, authId], function(err) {
      if (err) {
        return res.status(500).send('Error inserting data into the user table.');
      }
      res.send('Registration successful!');
    });
  });
});

app.get('/register-party', (req, res) => {
  res.render('party-registration');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
