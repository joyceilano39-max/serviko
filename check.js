const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
const line = envFile.split('\n').find(l => l.startsWith('DATABASE_URL='));
const dbUrl = line.replace('DATABASE_URL=', '').replace(/"/g, '').trim();
const sql = neon(dbUrl);
sql.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1', ['users']).then(r => console.log(JSON.stringify(r))).catch(e => console.error(e));
