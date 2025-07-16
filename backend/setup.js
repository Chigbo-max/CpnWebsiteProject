// const { Pool } = require('pg');
import { pool } from './config/database';
const fs = require('fs');
const path = require('path');


// Database configuration
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

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
    console.log('Username: Uju');
    console.log('Password: password');
    console.log('Email: chizzyaac@gmail.com');
    
  } catch (error) {
    console.error('Database setup failed:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase(); 