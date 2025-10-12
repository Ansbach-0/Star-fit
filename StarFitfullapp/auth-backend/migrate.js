const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// Delete old database if exists
if (fs.existsSync('./users.db')) {
    fs.unlinkSync('./users.db');
    console.log('✓ Old database deleted');
}

// Create new database with updated schema
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('Error creating database:', err.message);
        return;
    }
    console.log('✓ New database created');
});

// Create tables with new schema
db.serialize(() => {
    // Users table with manager_id relationship
    db.run(`CREATE TABLE users (
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
    )`, (err) => {
        if (err) console.error('Error creating users table:', err.message);
        else console.log('✓ Users table created with manager_id relationship');
    });

    // Exercises table
    db.run(`CREATE TABLE exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT
    )`, (err) => {
        if (err) console.error('Error creating exercises table:', err.message);
        else console.log('✓ Exercises table created');
    });

    // Routines table
    db.run(`CREATE TABLE routines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        exercise_id INTEGER,
        sets INTEGER,
        reps INTEGER,
        completed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (exercise_id) REFERENCES exercises(id)
    )`, (err) => {
        if (err) console.error('Error creating routines table:', err.message);
        else console.log('✓ Routines table created');
    });

    // Insert default exercises
    const exercises = [
        [1, 'Spinning', 'Cardio', 'Aula de ciclismo indoor'],
        [2, 'Musculação', 'Força', 'Treino com pesos'],
        [3, 'Yoga', 'Flexibilidade', 'Alongamento e meditação'],
        [4, 'Zumba', 'Dança', 'Dança fitness'],
        [5, 'Crossfit', 'Funcional', 'Treino funcional de alta intensidade']
    ];

    const insertExercise = db.prepare('INSERT INTO exercises (id, name, category, description) VALUES (?, ?, ?, ?)');
    exercises.forEach(ex => {
        insertExercise.run(ex, (err) => {
            if (err) console.error(`Error inserting exercise ${ex[1]}:`, err.message);
        });
    });
    insertExercise.finalize(() => console.log('✓ Exercises inserted'));

    // Insert demo users
    const users = [
        ['manager@starfit.com', 'admin123', 'manager', 'Admin Manager', null, null, 'active'],
        ['user@starfit.com', 'user123', 'user', 'João Silva', 'Plano Gold', '2025-11-11', 'active'],
        ['ana@starfit.com', 'ana123', 'user', 'Ana Clara Souza', 'Plano Gold', '2025-11-02', 'active'],
        ['bruno@starfit.com', 'bruno123', 'user', 'Bruno Martins', 'Plano Fit', '2025-11-01', 'active'],
        ['carla@starfit.com', 'carla123', 'user', 'Carla Dias', 'Plano Premium', '2025-10-31', 'active']
    ];

    const insertUser = db.prepare('INSERT INTO users (email, password, role, name, plan, next_payment, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
    users.forEach(user => {
        insertUser.run(user, (err) => {
            if (err) console.error(`Error inserting user ${user[0]}:`, err.message);
        });
    });
    insertUser.finalize(() => {
        console.log('✓ Demo users inserted');
        console.log('\n✅ Database migration complete!');
        console.log('\n🔐 Demo Credentials:');
        console.log('Manager: manager@starfit.com / admin123');
        console.log('User: user@starfit.com / user123\n');
    });
});

db.close();
