require('dotenv').config();
const { Client } = require('pg');
const http = require('http');
const url = require('url');

let dbStatus = 'Not checked';

async function connectToDatabase() {
  console.log('DATABASE_HOSTNAME:', process.env.DATABASE_HOSTNAME);
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
    dbStatus = 'Connected';
    await client.end();
  } catch (error) {
    console.log('Database is not connected');
    console.error('Error:', error.message);
    dbStatus = `Error: ${error.message}`;
  }
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  res.setHeader('Content-Type', 'text/html');

  if (path === '/') {
    res.statusCode = 200;
    res.end(`
      <html>
        <head><title>Node Database App</title></head>
        <body>
          <h1>Node Database App</h1>
          <p>Server is running on port 3000</p>
          <p>Database Status: ${dbStatus}</p>
          <a href="/db-check">Check Database Connection</a>
        </body>
      </html>
    `);
  } else if (path === '/db-check') {
    res.statusCode = 200;
    connectToDatabase().then(() => {
      res.end(`
        <html>
          <head><title>Database Check</title></head>
          <body>
            <h1>Database Connection Check</h1>
            <p>Status: ${dbStatus}</p>
            <a href="/">Back to Home</a>
          </body>
        </html>
      `);
    });
  } else {
    res.statusCode = 404;
    res.end(`
      <html>
        <head><title>Page Not Found</title></head>
        <body>
          <h1>404 - Page Not Found</h1>
          <a href="/">Back to Home</a>
        </body>
      </html>
    `);
  }
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

connectToDatabase();
