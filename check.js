const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
const line = envFile.split('\n').find(l => l.startsWith('DATABASE_URL='));
const dbUrl = line.replace('DATABASE_URL=', '').replace(/"/g, '').trim();
const sql = neon(dbUrl);
sql.query(`CREATE TABLE IF NOT EXISTS artist_services (
  id SERIAL PRIMARY KEY,
  artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  price INTEGER NOT NULL,
  duration TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
)`).then(r => console.log('Services table created:', JSON.stringify(r))).catch(e => console.error(e));
