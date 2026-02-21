require('dotenv').config({ path: '.env' });
const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
});
const db = drizzle(pool);

async function run() {
    const insertQuery = `
    INSERT INTO "user" (id, name, email, username, password) 
    VALUES ('admin_1', 'Admin', 'aminoasadi97@gmail.com', 'admin', '$2b$10$UBm.MG05K0a8S6KYHmQ6MOecQ9QOTN0F9cWLPNggZlsTcU2eL1dLu') 
    ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;
  `;
    try {
        const result = await pool.query(insertQuery);
        console.log('Successfully created admin user: aminoasadi97@gmail.com with password: admin123');
    } catch (err) {
        console.error('Error creating admin:', err.message);
    } finally {
        pool.end();
    }
}
run();
