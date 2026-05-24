import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // Add missing columns
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_reference VARCHAR(20) UNIQUE`;
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS artist_name VARCHAR(255)`;
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS service VARCHAR(255)`;
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS price DECIMAL(10,2)`;
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS location_lat DECIMAL(10,8)`;
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS location_lng DECIMAL(11,8)`;
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS location_address TEXT`;
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS landmark TEXT`;
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS contact_name VARCHAR(255)`;
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50)`;
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS voucher_code VARCHAR(50)`;
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS discount DECIMAL(10,2) DEFAULT 0`;
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending'`;
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`;
    
    const columns = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name='bookings' ORDER BY ordinal_position`;
    
    return Response.json({ 
      success: true, 
      message: 'Bookings table updated with new columns!',
      columns: columns 
    });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}