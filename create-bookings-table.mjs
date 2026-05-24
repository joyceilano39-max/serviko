import postgres from 'postgres';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const lines = envContent.split('\n');
let DATABASE_URL = '';
let inUrl = false;

for (let line of lines) {
  if (line.startsWith('DATABASE_URL=')) {
    DATABASE_URL = line.substring(13).trim();
    if (!DATABASE_URL.endsWith('"')) inUrl = true;
  } else if (inUrl) {
    DATABASE_URL += line.trim();
    if (line.trim().endsWith('"')) inUrl = false;
  }
}

DATABASE_URL = DATABASE_URL.replace(/^["']|["']$/g, '');

const sql = postgres(DATABASE_URL);

try {
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      booking_reference VARCHAR(20) UNIQUE NOT NULL,
      artist_id INTEGER,
      artist_name VARCHAR(255),
      service VARCHAR(255),
      price DECIMAL(10,2),
      date DATE,
      time TIME,
      location_lat DECIMAL(10,8),
      location_lng DECIMAL(11,8),
      location_address TEXT,
      landmark TEXT,
      contact_name VARCHAR(255),
      contact_phone VARCHAR(50),
      voucher_code VARCHAR(50),
      discount DECIMAL(10,2) DEFAULT 0,
      transport_fee DECIMAL(10,2) DEFAULT 50,
      total DECIMAL(10,2),
      notes TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      payment_status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  console.log('✅ Bookings table created successfully!');
  
  const columns = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name='bookings' ORDER BY ordinal_position`;
  console.log('\nColumns:');
  columns.forEach(col => console.log(`  ${col.column_name}: ${col.data_type}`));
  
} catch (err) {
  console.error('Error:', err.message);
} finally {
  await sql.end();
}