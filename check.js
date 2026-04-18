const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
const line = envFile.split('\n').find(l => l.startsWith('DATABASE_URL='));
const dbUrl = line.replace('DATABASE_URL=', '').replace(/"/g, '').trim();
const sql = neon(dbUrl);
sql.query("UPDATE users SET email = 'joyceilano40@gmail.com' WHERE email = 'penasjoyce5@gmail.com'").then(r => console.log('Updated:', JSON.stringify(r))).catch(e => console.error(e));
