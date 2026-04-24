const fs = require('fs');
let envContent = fs.readFileSync('.env.local', 'utf-8');
envContent = envContent.replace(/^\uFEFF/, '');
envContent.split(/\r?\n/).forEach(line => {
  line = line.trim();
  if (!line || line.startsWith('#')) return;
  const eq = line.indexOf('=');
  if (eq > 0) {
    const key = line.substring(0, eq).trim();
    const value = line.substring(eq + 1).trim().replace(/^["']|["']$/g, '');
    process.env[key] = value;
  }
});
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
(async () => {
  const result = await sql`SELECT u.id, u.name, u.email, u.role, u.clerk_id, a.id as artist_id FROM users u JOIN artists a ON a.user_id = u.id`;
  console.log('Artists:', JSON.stringify(result, null, 2));
})();