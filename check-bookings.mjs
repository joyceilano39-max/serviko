import dotenv from 'dotenv';
import postgres from 'postgres';

dotenv.config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL);

try {
  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name='bookings'`;
  console.log('Bookings table:', tables.length > 0 ? 'EXISTS' : 'DOES NOT EXIST');
  
  if (tables.length > 0) {
    const columns = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name='bookings' ORDER BY ordinal_position`;
    console.log('\nColumns:');
    columns.forEach(col => console.log(`  ${col.column_name}: ${col.data_type}`));
  }
} catch (err) {
  console.error('Error:', err.message);
} finally {
  await sql.end();
}