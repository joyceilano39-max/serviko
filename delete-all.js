const fs = require('fs');
let envContent = fs.readFileSync('.env.local', 'utf-8');
envContent = envContent.replace(/^\uFEFF/, '');
envContent.split(/\r?\n/).forEach(line => { line = line.trim(); if (!line || line.startsWith('#')) return; const eq = line.indexOf('='); if (eq > 0) { const key = line.substring(0, eq).trim(); const value = line.substring(eq + 1).trim().replace(/^["']|["']$/g, ''); process.env[key] = value; } });
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
(async () => {
  try {
    console.log('=== Cleaning Database ===');
    await sql`DELETE FROM artist_services`;
    console.log('Deleted artist_services');
    await sql`DELETE FROM bookings`;
    console.log('Deleted bookings');
    await sql`DELETE FROM artists`;
    console.log('Deleted artists');
    await sql`DELETE FROM users`;
    console.log('Deleted users');
    console.log('=== Cleaning Clerk ===');
    const clerkSecret = process.env.CLERK_SECRET_KEY;
    const resp = await fetch('https://api.clerk.com/v1/users?limit=100', { headers: { 'Authorization': 'Bearer ' + clerkSecret } });
    const users = await resp.json();
    console.log('Found ' + users.length + ' users in Clerk');
    for (const user of users) {
      const email = user.email_addresses && user.email_addresses[0] ? user.email_addresses[0].email_address : 'unknown';
      await fetch('https://api.clerk.com/v1/users/' + user.id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + clerkSecret } });
      console.log('Deleted Clerk user: ' + email);
    }
    console.log('=== CLEAN! ===');
  } catch (e) { console.error('ERROR:', e.message); }
})();