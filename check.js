const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
const line = envFile.split('\n').find(l => l.startsWith('DATABASE_URL='));
const dbUrl = line.replace('DATABASE_URL=', '').replace(/"/g, '').trim();
const sql = neon(dbUrl);
sql.query(`CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  booking_id INTEGER,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
)`).then(r => console.log('Reviews table created:', JSON.stringify(r))).catch(e => console.error(e));
