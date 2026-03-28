import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { artist } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET artist info
export async function GET() {
  try {
    const artistInfo = await db
      .select()
      .from(artist)
      .where(eq(artist.id, 1))
      .then(res => res[0] || null);
    
    return NextResponse.json(artistInfo);
  } catch (error) {
    console.error('Error fetching artist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artist' },
      { status: 500 }
    );
  }
}

// PUT update artist info
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    const existing = await db
      .select()
      .from(artist)
      .where(eq(artist.id, 1))
      .then(res => res[0]);
    
    let result;
    if (existing) {
      // Update existing
      result = await db
        .update(artist)
        .set({
          name: data.name,
          portrait_url: data.portrait_url,
          bio: data.bio,
          born: data.born,
          education: data.education,
          represented_by: data.represented_by,
          cv: JSON.stringify(data.cv || []),
          updated_at: new Date(),
        })
        .where(eq(artist.id, 1))
        .returning();
    } else {
      // Insert new
      result = await db
        .insert(artist)
        .values({
          id: 1,
          name: data.name,
          portrait_url: data.portrait_url,
          bio: data.bio,
          born: data.born,
          education: data.education,
          represented_by: data.represented_by,
          cv: JSON.stringify(data.cv || []),
        })
        .returning();
    }
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating artist:', error);
    return NextResponse.json(
      { error: 'Failed to update artist' },
      { status: 500 }
    );
  }
}

// DELETE artist info
export async function DELETE() {
  try {
    await db
      .delete(artist)
      .where(eq(artist.id, 1));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting artist:', error);
    return NextResponse.json(
      { error: 'Failed to delete artist' },
      { status: 500 }
    );
  }
}