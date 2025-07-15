const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'cpn_db',
  password: process.env.DB_PASSWORD || 'your_password',
  port: process.env.DB_PORT || 5432,
});

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Read schema file
    const schemaPath = path.join(__dirname, 'config', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema
    await pool.query(schema);
    
    console.log('Database setup completed successfully!');
    console.log('Default admin credentials:');
    console.log('Username: admin');
    console.log('Password: password');
    console.log('Email: admin@cpn.com');
    
  } catch (error) {
    console.error('Database setup failed:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase(); 