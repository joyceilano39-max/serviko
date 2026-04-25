const fs = require('fs');
let envContent = fs.readFileSync('.env.local', 'utf-8');
envContent = envContent.replace(/^\uFEFF/, '');
envContent.split(/\r?\n/).forEach(line => { line = line.trim(); if (!line || line.startsWith('#')) return; const eq = line.indexOf('='); if (eq > 0) { const key = line.substring(0, eq).trim(); const value = line.substring(eq + 1).trim().replace(/^["']|["']$/g, ''); process.env[key] = value; } });
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
(async () => {
  const users = await sql`SELECT id, name, role FROM users ORDER BY id`;
  console.log('Users:', JSON.stringify(users, null, 2));
  const artists = await sql`SELECT id, user_id, name FROM artists ORDER BY id`;
  console.log('Artists table:', JSON.stringify(artists, null, 2));
})();