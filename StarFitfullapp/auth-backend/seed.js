const sqlite3 = require('sqlite3').verbose();

// Connect to database
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
        return;
    }
    console.log('Connected to SQLite database.');
});

// Insert demo users
const demoUsers = [
    {
        email: 'manager@starfit.com',
        password: 'admin123',
        role: 'manager',
        name: 'Admin Manager',
        plan: null,
        next_payment: null,
        status: 'active'
    },
    {
        email: 'user@starfit.com',
        password: 'user123',
        role: 'user',
        name: 'João Silva',
        plan: 'Plano Gold',
        next_payment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active'
    },
    {
        email: 'ana@starfit.com',
        password: 'ana123',
        role: 'user',
        name: 'Ana Clara Souza',
        plan: 'Plano Gold',
        next_payment: '2025-08-02',
        status: 'active'
    },
    {
        email: 'bruno@starfit.com',
        password: 'bruno123',
        role: 'user',
        name: 'Bruno Martins',
        plan: 'Plano Fit',
        next_payment: '2025-08-01',
        status: 'active'
    },
    {
        email: 'carla@starfit.com',
        password: 'carla123',
        role: 'user',
        name: 'Carla Dias',
        plan: 'Plano Premium',
        next_payment: '2025-07-31',
        status: 'active'
    }
];

// Insert each demo user
demoUsers.forEach((user) => {
    db.run(
        `INSERT OR IGNORE INTO users (email, password, role, name, plan, next_payment, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user.email, user.password, user.role, user.name, user.plan, user.next_payment, user.status],
        function(err) {
            if (err) {
                console.error(`Error inserting ${user.email}:`, err.message);
            } else {
                console.log(`✓ User ${user.email} created/verified`);
            }
        }
    );
});

// Close database after a delay
setTimeout(() => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('\n✅ Demo users setup complete!');
            console.log('\n🔐 Demo Credentials:');
            console.log('Manager: manager@starfit.com / admin123');
            console.log('User: user@starfit.com / user123');
        }
    });
}, 1000);
