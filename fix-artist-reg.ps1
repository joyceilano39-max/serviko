$path = "C:\Users\Dell_PC\serviko\app\api\register\artist\route.ts"
$content = @"
import { neon } from `"@neondatabase/serverless`";
import { NextRequest, NextResponse } from `"next/server`";

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const { name, email, phone, address, bio, experience, services, gcash, clerkId, profilePhoto, validId } = await req.json();

  try {
    const existing = await sql``SELECT id, clerk_id FROM users WHERE email = `${email}``;
    let userId;

    if (existing.length > 0) {
      // User exists in database - update with Clerk ID if missing
      userId = existing[0].id;
      if (!existing[0].clerk_id && clerkId) {
        await sql``UPDATE users SET clerk_id = `${clerkId}, name = `${name}, phone = `${phone}, address = `${address} WHERE id = `${userId}``;
      } else if (existing[0].clerk_id) {
        return NextResponse.json({ error: `"Email already registered`" }, { status: 400 });
      }
    } else {
      // New user - insert
      const userResult = await sql``
        INSERT INTO users (clerk_id, name, email, phone, role, address)
        VALUES (`${clerkId}, `${name}, `${email}, `${phone}, 'artist', `${address})
        RETURNING id
      ``;
      userId = userResult[0].id;
    }

    const artistResult = await sql``SELECT id FROM artists WHERE user_id = `${userId}``;
    let artistId;

    if (artistResult.length > 0) {
      artistId = artistResult[0].id;
      await sql``
        UPDATE artists SET
          bio = `${bio},
          experience = `${experience},
          services = `${services},
          gcash_number = `${gcash},
          profile_photo = `${profilePhoto},
          valid_id = `${validId},
          verification_status = 'pending'
        WHERE id = `${artistId}
      ``;
    } else {
      const newArtist = await sql``
        INSERT INTO artists (user_id, bio, experience, services, gcash_number, profile_photo, valid_id, verification_status)
        VALUES (`${userId}, `${bio}, `${experience}, `${services}, `${gcash}, `${profilePhoto}, `${validId}, 'pending')
        RETURNING id
      ``;
      artistId = newArtist[0].id;
    }

    return NextResponse.json({ success: true, userId, artistId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
"@
[System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false))
Write-Host "Fixed artist registration to handle existing users!"