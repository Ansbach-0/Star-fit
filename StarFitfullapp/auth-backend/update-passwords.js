const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const db = new sqlite3.Database('./users.db');

const users = [
    { email: 'manager@starfit.com', password: 'Manager@123' },
    { email: 'user@starfit.com', password: 'User@123' },
    { email: 'ana@starfit.com', password: 'Ana@123' },
    { email: 'bruno@starfit.com', password: 'Bruno@123' },
    { email: 'carla@starfit.com', password: 'Carla@123' }
];

async function updatePasswords() {
    console.log('🔄 Updating passwords with bcrypt hashes...\n');
    
    for (const user of users) {
        try {
            const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
            
            await new Promise((resolve, reject) => {
                db.run(
                    'UPDATE users SET password = ? WHERE email = ?',
                    [hashedPassword, user.email],
                    function(err) {
                        if (err) {
                            console.error(`✗ Error updating ${user.email}:`, err.message);
                            reject(err);
                        } else if (this.changes === 0) {
                            console.log(`⚠ User ${user.email} not found`);
                            resolve();
                        } else {
                            console.log(`✓ Updated ${user.email} (password: ${user.password})`);
                            resolve();
                        }
                    }
                );
            });
        } catch (error) {
            console.error(`✗ Error processing ${user.email}:`, error);
        }
    }
    
    console.log('\n✅ Password update complete!\n');
    console.log('🔐 Test Credentials:');
    users.forEach(u => {
        console.log(`   ${u.email} / ${u.password}`);
    });
    
    db.close();
}

updatePasswords().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
