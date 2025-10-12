const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('./users.db');

// Test password for manager
const testEmail = 'manager@starfit.com';
const testPassword = 'Manager@123';

db.get('SELECT email, password FROM users WHERE email = ?', [testEmail], async (err, user) => {
    if (err) {
        console.error('Database error:', err);
        db.close();
        return;
    }
    
    if (!user) {
        console.log('User not found');
        db.close();
        return;
    }
    
    console.log('User found:', user.email);
    console.log('Stored password hash:', user.password);
    console.log('Testing password:', testPassword);
    
    try {
        const isValid = await bcrypt.compare(testPassword, user.password);
        console.log('Password valid:', isValid);
        
        if (!isValid) {
            console.log('\nPassword does NOT match!');
            console.log('Generating new hash for testing...');
            const newHash = await bcrypt.hash(testPassword, 10);
            console.log('New hash:', newHash);
            console.log('\nTrying with new hash...');
            const testNew = await bcrypt.compare(testPassword, newHash);
            console.log('New hash works:', testNew);
        }
    } catch (error) {
        console.error('Bcrypt error:', error);
    }
    
    db.close();
});
