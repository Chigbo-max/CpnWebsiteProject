const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('Setting up database...');
    const schemaPath = path.join(__dirname, 'config', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split into individual commands
    const commands = schema.split(';').filter(cmd => cmd.trim().length > 0);
    
    for (const cmd of commands) {
      await pool.query(cmd);
    }
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

module.exports = setupDatabase;



// const { Pool } = require('pg');
// const fs = require('fs');
// const path = require('path');

// // Database configuration
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// async function setupDatabase() {
//   try {
//     console.log('Setting up database...');
    
//     // Read schema file
//     const schemaPath = path.join(__dirname, 'config', 'schema.sql');
//     const schema = fs.readFileSync(schemaPath, 'utf8');
    
//     // Execute schema
//     await pool.query(schema);
    
    
//   } catch (error) {
//     console.error('Database setup failed:', error);
//   } finally {
//     await pool.end();
//   }
// }

// setupDatabase(); 





