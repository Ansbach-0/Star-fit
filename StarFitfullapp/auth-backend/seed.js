const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

// Connect to database
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
        return;
    }
    console.log('Connected to SQLite database.');
});

// Demo users data
const demoUsers = [
    {
        email: 'manager@starfit.com',
        password: 'Manager@123',
        role: 'manager',
        name: 'Admin Manager',
        plan: 'StarFit Manager',
        next_payment: null,
        status: 'active',
        manager_id: null
    },
    {
        email: 'user@starfit.com',
        password: 'User@123',
        role: 'user',
        name: 'João Silva',
        plan: 'Plano Gold',
        next_payment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active',
        manager_id: 1 // Assigned to first manager
    },
    {
        email: 'ana@starfit.com',
        password: 'Ana@123',
        role: 'user',
        name: 'Ana Clara Souza',
        plan: 'Plano Gold',
        next_payment: '2025-08-02',
        status: 'active',
        manager_id: 1
    },
    {
        email: 'bruno@starfit.com',
        password: 'Bruno@123',
        role: 'user',
        name: 'Bruno Martins',
        plan: 'Plano Fit',
        next_payment: '2025-08-01',
        status: 'active',
        manager_id: 1
    },
    {
        email: 'carla@starfit.com',
        password: 'Carla@123',
        role: 'user',
        name: 'Carla Dias',
        plan: 'Plano Premium',
        next_payment: '2025-07-31',
        status: 'active',
        manager_id: 1
    }
];

// Function to insert user with hashed password
async function insertUser(user) {
    try {
        const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
        
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT OR IGNORE INTO users (email, password, role, name, plan, next_payment, status, manager_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [user.email, hashedPassword, user.role, user.name, user.plan, user.next_payment, user.status, user.manager_id],
                function(err) {
                    if (err) {
                        console.error(`✗ Error inserting ${user.email}:`, err.message);
                        reject(err);
                    } else {
                        console.log(`✓ User ${user.email} created with hashed password (password: ${user.password})`);
                        resolve();
                    }
                }
            );
        });
    } catch (error) {
        console.error(`✗ Error hashing password for ${user.email}:`, error);
    }
}

// Insert all demo users sequentially
async function seedDatabase() {
    console.log('\n🌱 Seeding database with demo users...\n');
    
    for (const user of demoUsers) {
        await insertUser(user);
    }
    
    console.log('\n✅ Database seeding completed!\n');
    console.log('🔐 Demo Credentials (for testing only):');
    console.log('Manager: manager@starfit.com / Manager@123');
    console.log('User: user@starfit.com / User@123');
    console.log('User: ana@starfit.com / Ana@123');
    console.log('User: bruno@starfit.com / Bruno@123');
    console.log('User: carla@starfit.com / Carla@123\n');
    
    // Close database
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('✅ Database connection closed.');
        }
    });
}

// Run the seed function
seedDatabase().catch(err => {
    console.error('Error seeding database:', err);
    process.exit(1);
});
