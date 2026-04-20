const fs = require('fs');
let envContent = fs.readFileSync('.env.local', 'utf-8');
envContent = envContent.replace(/^\uFEFF/, ''); // Remove BOM
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

console.log('DB URL starts with:', (process.env.DATABASE_URL || '').substring(0, 30));

const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

(async () => {
  try {
    await sql`ALTER TABLE artists ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 7)`;
    await sql`ALTER TABLE artists ADD COLUMN IF NOT EXISTS longitude DECIMAL(10, 7)`;
    console.log('Added columns');
    
    await sql`UPDATE artists SET latitude = 14.6760, longitude = 121.0437 WHERE id = 12 AND latitude IS NULL`;
    await sql`UPDATE artists SET latitude = 14.6760, longitude = 121.0437 WHERE id = 13 AND latitude IS NULL`;
    await sql`UPDATE artists SET latitude = 15.4827, longitude = 120.9681 WHERE id = 14 AND latitude IS NULL`;
    console.log('Set coordinates');
    
    const result = await sql`SELECT a.id, u.name, a.latitude, a.longitude FROM artists a JOIN users u ON a.user_id = u.id`;
    console.log('Artists:', JSON.stringify(result, null, 2));
  } catch (e) {
    console.error('Error:', e.message);
  }
})();
