const fs = require('fs');
let envContent = fs.readFileSync('.env.local', 'utf-8');
envContent = envContent.replace(/^\uFEFF/, '');
envContent.split(/\r?\n/).forEach(line => { line = line.trim(); if (!line || line.startsWith('#')) return; const eq = line.indexOf('='); if (eq > 0) { const key = line.substring(0, eq).trim(); const value = line.substring(eq + 1).trim().replace(/^["']|["']$/g, ''); process.env[key] = value; } });
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
(async () => {
  const before = await sql`SELECT id, name, email, role FROM users WHERE email = 'joyceilano39@gmail.com'`;
  console.log('Before:', JSON.stringify(before, null, 2));
  await sql`UPDATE users SET role = 'admin' WHERE email = 'joyceilano39@gmail.com'`;
  const after = await sql`SELECT id, name, email, role FROM users WHERE email = 'joyceilano39@gmail.com'`;
  console.log('After:', JSON.stringify(after, null, 2));
  console.log('YOU ARE NOW ADMIN!');
})();