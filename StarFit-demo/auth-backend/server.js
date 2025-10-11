const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite DB
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) return console.error(err.message);
    console.log('Connected to SQLite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)`);

// Login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error.' });
        if (!user) return res.status(401).json({ error: 'Invalid credentials.' });
        res.json({ success: true, user: { id: user.id, email: user.email } });
    });
});

// Add user endpoint (for demo/testing)
app.post('/register', (req, res) => {
    const { email, password } = req.body;
    db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], function(err) {
        if (err) return res.status(400).json({ error: 'User already exists.' });
        res.json({ success: true, id: this.lastID });
    });
});

app.listen(PORT, () => {
    console.log(`Auth server running on http://localhost:${PORT}`);
});
