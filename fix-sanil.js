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
  await sql`UPDATE artists SET latitude = 14.6760, longitude = 121.0437 WHERE id = 15`;
  console.log('Sanil coordinates updated!');
  const result = await sql`SELECT a.id, u.name, a.latitude, a.longitude FROM artists a JOIN users u ON a.user_id = u.id`;
  console.log('All artists:', JSON.stringify(result, null, 2));
})();