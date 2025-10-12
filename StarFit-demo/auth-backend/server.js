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

// Create tables
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    name TEXT,
    plan TEXT,
    next_payment DATE,
    status TEXT DEFAULT 'active'
)`);

db.run(`CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS routines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    exercise_id INTEGER,
    sets INTEGER,
    reps INTEGER,
    completed INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
)`);

// Insert default exercises
db.run(`INSERT OR IGNORE INTO exercises (id, name, category, description) VALUES 
    (1, 'Spinning', 'Cardio', 'Aula de ciclismo indoor'),
    (2, 'Musculação', 'Força', 'Treino com pesos'),
    (3, 'Yoga', 'Flexibilidade', 'Alongamento e meditação'),
    (4, 'Zumba', 'Dança', 'Dança fitness'),
    (5, 'Crossfit', 'Funcional', 'Treino funcional de alta intensidade')
`);

// Login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error.' });
        if (!user) return res.status(401).json({ error: 'Invalid credentials.' });
        res.json({ 
            success: true, 
            user: { 
                id: user.id, 
                email: user.email, 
                role: user.role,
                name: user.name,
                plan: user.plan,
                next_payment: user.next_payment,
                status: user.status
            } 
        });
    });
});

// Register endpoint
app.post('/register', (req, res) => {
    const { email, password, role = 'user', name, plan } = req.body;
    const next_payment = new Date();
    next_payment.setMonth(next_payment.getMonth() + 1);
    
    db.run(
        'INSERT INTO users (email, password, role, name, plan, next_payment) VALUES (?, ?, ?, ?, ?, ?)', 
        [email, password, role, name, plan || 'Plano Fit', next_payment.toISOString().split('T')[0]], 
        function(err) {
            if (err) return res.status(400).json({ error: 'User already exists.' });
            res.json({ success: true, id: this.lastID, role });
        }
    );
});

// Get all users (for manager)
app.get('/users', (req, res) => {
    db.all('SELECT id, email, name, plan, next_payment, status, role FROM users WHERE role = "user"', [], (err, users) => {
        if (err) return res.status(500).json({ error: 'Database error.' });
        res.json({ users });
    });
});

// Get dashboard stats (for manager)
app.get('/stats', (req, res) => {
    db.get('SELECT COUNT(*) as total, SUM(CASE WHEN status = "active" THEN 1 ELSE 0 END) as active FROM users WHERE role = "user"', [], (err, stats) => {
        if (err) return res.status(500).json({ error: 'Database error.' });
        
        // Calculate revenue (fake data for demo)
        const revenue = stats.active * 150; // Assuming R$ 150 per active member
        const occupancyRate = Math.floor((stats.active / (stats.active + 20)) * 100); // Fake calculation
        const churnRate = Math.floor(Math.random() * 30 + 10); // Random for demo
        
        res.json({ 
            revenue,
            active_members: stats.active,
            total_members: stats.total,
            occupancy_rate: occupancyRate,
            churn_rate: churnRate
        });
    });
});

// Get all exercises
app.get('/exercises', (req, res) => {
    db.all('SELECT * FROM exercises', [], (err, exercises) => {
        if (err) return res.status(500).json({ error: 'Database error.' });
        res.json({ exercises });
    });
});

// Create routine for user
app.post('/routines', (req, res) => {
    const { user_id, exercise_id, sets, reps } = req.body;
    db.run(
        'INSERT INTO routines (user_id, exercise_id, sets, reps) VALUES (?, ?, ?, ?)',
        [user_id, exercise_id, sets, reps],
        function(err) {
            if (err) return res.status(500).json({ error: 'Database error.' });
            res.json({ success: true, id: this.lastID });
        }
    );
});

// Get routines for a user
app.get('/routines/:user_id', (req, res) => {
    const { user_id } = req.params;
    db.all(
        `SELECT r.*, e.name as exercise_name, e.category, e.description 
         FROM routines r 
         JOIN exercises e ON r.exercise_id = e.id 
         WHERE r.user_id = ?`,
        [user_id],
        (err, routines) => {
            if (err) return res.status(500).json({ error: 'Database error.' });
            res.json({ routines });
        }
    );
});

// Mark routine as completed
app.put('/routines/:id/complete', (req, res) => {
    const { id } = req.params;
    db.run('UPDATE routines SET completed = 1 WHERE id = ?', [id], function(err) {
        if (err) return res.status(500).json({ error: 'Database error.' });
        res.json({ success: true });
    });
});

// Delete routine
app.delete('/routines/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM routines WHERE id = ?', [id], function(err) {
        if (err) return res.status(500).json({ error: 'Database error.' });
        res.json({ success: true });
    });
});

app.listen(PORT, () => {
    console.log(`Auth server running on http://localhost:${PORT}`);
});
