require('dotenv').config();
const { Client } = require('pg');

async function connectToDatabase() {
  const client = new Client({
    host: process.env.DATABASE_HOSTNAME,
    port: process.env.DATABASE_PORT || 5432,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  });

  try {
    await client.connect();
    console.log('Database is connected successfully');
    await client.end();
  } catch (error) {
    console.log('Database is not connected');
    console.error('Error:', error.message);
  }
}

connectToDatabase();
