require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
const SALT_ROUNDS = 10;

// Rate limiting
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    message: 'Too many login attempts, please try again after 15 minutes'
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 registrations per hour
    message: 'Too many accounts created, please try again later'
});

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(bodyParser.json());

// Initialize SQLite DB
const db = new sqlite3.Database(process.env.DB_PATH || './users.db', (err) => {
    if (err) return console.error(err.message);
    console.log('Connected to SQLite database.');
});

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Middleware to check if user is a manager
const isManager = (req, res, next) => {
    if (req.user.role !== 'manager') {
        return res.status(403).json({ error: 'Manager access required' });
    }
    next();
};

// Create tables
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    name TEXT,
    plan TEXT,
    next_payment DATE,
    status TEXT DEFAULT 'active',
    manager_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(id)
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

// Login endpoint with validation and rate limiting
app.post('/login', 
    loginLimiter,
    [
        body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) return res.status(500).json({ error: 'Database error.' });
            if (!user) return res.status(401).json({ error: 'Invalid credentials.' });
            
            // Compare hashed password
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid credentials.' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
            );

            res.json({ 
                success: true,
                token,
                user: { 
                    id: user.id, 
                    email: user.email, 
                    role: user.role,
                    name: user.name,
                    plan: user.plan,
                    next_payment: user.next_payment,
                    status: user.status,
                    manager_id: user.manager_id
                } 
            });
        });
    }
);

// Register endpoint for regular users
app.post('/register', 
    registerLimiter,
    [
        body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('plan').optional().trim(),
        body('manager_id').optional().isInt().withMessage('Invalid manager ID')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, name, plan, manager_id } = req.body;
        const next_payment = new Date();
        next_payment.setMonth(next_payment.getMonth() + 1);
        
        try {
            // Hash password
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            
            db.run(
                'INSERT INTO users (email, password, role, name, plan, next_payment, manager_id) VALUES (?, ?, ?, ?, ?, ?, ?)', 
                [email, hashedPassword, 'user', name, plan || 'Plano Fit', next_payment.toISOString().split('T')[0], manager_id || null], 
                function(err) {
                    if (err) {
                        if (err.message.includes('UNIQUE')) {
                            return res.status(400).json({ error: 'Email already registered.' });
                        }
                        return res.status(500).json({ error: 'Registration failed.' });
                    }
                    
                    // Generate JWT token
                    const token = jwt.sign(
                        { id: this.lastID, email, role: 'user' },
                        JWT_SECRET,
                        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
                    );
                    
                    res.json({ success: true, token, id: this.lastID, role: 'user' });
                }
            );
        } catch (error) {
            res.status(500).json({ error: 'Server error during registration.' });
        }
    }
);

// Register endpoint for managers
app.post('/register/manager', 
    registerLimiter,
    [
        body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('gym_name').optional().trim(),
        body('phone').optional().trim()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, name, gym_name, phone } = req.body;
        
        try {
            // Hash password
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            
            db.run(
                'INSERT INTO users (email, password, role, name, plan) VALUES (?, ?, ?, ?, ?)', 
                [email, hashedPassword, 'manager', name, gym_name || 'StarFit Manager'], 
                function(err) {
                    if (err) {
                        if (err.message.includes('UNIQUE')) {
                            return res.status(400).json({ error: 'Email already registered.' });
                        }
                        return res.status(500).json({ error: 'Registration failed.' });
                    }
                    
                    // Generate JWT token
                    const token = jwt.sign(
                        { id: this.lastID, email, role: 'manager' },
                        JWT_SECRET,
                        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
                    );
                    
                    res.json({ success: true, token, id: this.lastID, role: 'manager' });
                }
            );
        } catch (error) {
            res.status(500).json({ error: 'Server error during registration.' });
        }
    }
);

// Get all users (for manager) - Protected route
app.get('/users', authenticateToken, isManager, (req, res) => {
    // If manager wants to see only their clients
    const managerId = req.query.my_clients === 'true' ? req.user.id : null;
    
    const query = managerId 
        ? 'SELECT id, email, name, plan, next_payment, status, role, created_at FROM users WHERE role = "user" AND manager_id = ?'
        : 'SELECT id, email, name, plan, next_payment, status, role, created_at FROM users WHERE role = "user"';
    
    const params = managerId ? [managerId] : [];
    
    db.all(query, params, (err, users) => {
        if (err) return res.status(500).json({ error: 'Database error.' });
        res.json({ users });
    });
});

// Assign client to manager (Protected route)
app.post('/users/:userId/assign-manager', 
    authenticateToken, 
    isManager,
    [body('manager_id').optional().isInt()],
    (req, res) => {
        const { userId } = req.params;
        const managerId = req.body.manager_id || req.user.id;
        
        db.run(
            'UPDATE users SET manager_id = ? WHERE id = ? AND role = "user"',
            [managerId, userId],
            function(err) {
                if (err) return res.status(500).json({ error: 'Database error.' });
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'User not found or not a client.' });
                }
                res.json({ success: true, message: 'Client assigned to manager.' });
            }
        );
    }
);

// Get manager's clients (Protected route)
app.get('/manager/clients', authenticateToken, isManager, (req, res) => {
    db.all(
        'SELECT id, email, name, plan, next_payment, status, created_at FROM users WHERE role = "user" AND manager_id = ?',
        [req.user.id],
        (err, clients) => {
            if (err) return res.status(500).json({ error: 'Database error.' });
            res.json({ clients });
        }
    );
});

// Get dashboard stats (for manager) - Protected route
app.get('/stats', authenticateToken, isManager, (req, res) => {
    const managerId = req.user.id;
    
    // Get stats for manager's clients only
    db.get(
        'SELECT COUNT(*) as total, SUM(CASE WHEN status = "active" THEN 1 ELSE 0 END) as active FROM users WHERE role = "user" AND (manager_id = ? OR manager_id IS NULL)',
        [managerId],
        (err, stats) => {
            if (err) return res.status(500).json({ error: 'Database error.' });
            
            // Calculate revenue (based on active members)
            const revenue = stats.active * 150; // R$ 150 per active member
            const occupancyRate = stats.total > 0 ? Math.floor((stats.active / stats.total) * 100) : 0;
            const churnRate = stats.total > 0 ? Math.floor(((stats.total - stats.active) / stats.total) * 100) : 0;
            
            res.json({ 
                revenue,
                active_members: stats.active,
                total_members: stats.total,
                occupancy_rate: occupancyRate,
                churn_rate: churnRate
            });
        }
    );
});

// Get all exercises - Protected route
app.get('/exercises', authenticateToken, (req, res) => {
    db.all('SELECT * FROM exercises', [], (err, exercises) => {
        if (err) return res.status(500).json({ error: 'Database error.' });
        res.json({ exercises });
    });
});

// Create routine for user - Protected route
app.post('/routines', 
    authenticateToken,
    [
        body('user_id').isInt().withMessage('Valid user ID required'),
        body('exercise_id').isInt().withMessage('Valid exercise ID required'),
        body('sets').isInt({ min: 1 }).withMessage('Sets must be at least 1'),
        body('reps').isInt({ min: 1 }).withMessage('Reps must be at least 1')
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { user_id, exercise_id, sets, reps } = req.body;
        
        // Check if user is creating routine for themselves or if they're a manager
        if (req.user.role !== 'manager' && req.user.id !== parseInt(user_id)) {
            return res.status(403).json({ error: 'Unauthorized to create routine for this user.' });
        }
        
        db.run(
            'INSERT INTO routines (user_id, exercise_id, sets, reps) VALUES (?, ?, ?, ?)',
            [user_id, exercise_id, sets, reps],
            function(err) {
                if (err) return res.status(500).json({ error: 'Database error.' });
                res.json({ success: true, id: this.lastID });
            }
        );
    }
);

// Get routines for a user - Protected route
app.get('/routines/:user_id', authenticateToken, (req, res) => {
    const { user_id } = req.params;
    
    // Users can only see their own routines, managers can see any
    if (req.user.role !== 'manager' && req.user.id !== parseInt(user_id)) {
        return res.status(403).json({ error: 'Unauthorized to view these routines.' });
    }
    
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

// Mark routine as completed - Protected route
app.put('/routines/:id/complete', authenticateToken, (req, res) => {
    const { id } = req.params;
    
    // First check if the routine belongs to the user
    db.get('SELECT user_id FROM routines WHERE id = ?', [id], (err, routine) => {
        if (err) return res.status(500).json({ error: 'Database error.' });
        if (!routine) return res.status(404).json({ error: 'Routine not found.' });
        
        if (req.user.role !== 'manager' && req.user.id !== routine.user_id) {
            return res.status(403).json({ error: 'Unauthorized to update this routine.' });
        }
        
        db.run('UPDATE routines SET completed = 1 WHERE id = ?', [id], function(err) {
            if (err) return res.status(500).json({ error: 'Database error.' });
            res.json({ success: true });
        });
    });
});

// Delete routine - Protected route
app.delete('/routines/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    
    // First check if the routine belongs to the user or if user is a manager
    db.get('SELECT user_id FROM routines WHERE id = ?', [id], (err, routine) => {
        if (err) return res.status(500).json({ error: 'Database error.' });
        if (!routine) return res.status(404).json({ error: 'Routine not found.' });
        
        if (req.user.role !== 'manager' && req.user.id !== routine.user_id) {
            return res.status(403).json({ error: 'Unauthorized to delete this routine.' });
        }
        
        db.run('DELETE FROM routines WHERE id = ?', [id], function(err) {
            if (err) return res.status(500).json({ error: 'Database error.' });
            res.json({ success: true });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Auth server running on http://localhost:${PORT}`);
});
