import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
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
    
    const columns = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name='bookings' ORDER BY ordinal_position`;
    
    return Response.json({ 
      success: true, 
      message: 'Bookings table created!',
      columns: columns 
    });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}