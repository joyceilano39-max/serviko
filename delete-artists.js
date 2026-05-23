const { neon } = require("@neondatabase/serverless");

async function deleteArtists() {
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    // Delete artist records
    await sql`DELETE FROM artists WHERE user_id IN (17, 18)`;
    console.log("✓ Deleted artists table entries");
    
    // Delete user records
    await sql`DELETE FROM users WHERE id IN (17, 18)`;
    console.log("✓ Deleted users: Lance (17) and Feliciano (18)");
    
    console.log("\n✅ Database cleaned! Lance and Feliciano can now re-register.");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

deleteArtists();
