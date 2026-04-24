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
  const allUsers = await sql`SELECT id, name, email, role, clerk_id FROM users ORDER BY role, id`;
  console.log('ALL USERS IN DATABASE:');
  console.log(JSON.stringify(allUsers, null, 2));
  console.log('\nTotal users:', allUsers.length);
  
  const bookings = await sql`SELECT COUNT(*) as count FROM bookings`;
  console.log('Bookings count:', bookings[0].count);
})();