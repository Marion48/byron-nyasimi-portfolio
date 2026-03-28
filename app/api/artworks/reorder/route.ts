import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { artworks } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { artworks: reorderedArtworks } = await request.json();
    
    // Update display_order for each artwork
    for (let i = 0; i < reorderedArtworks.length; i++) {
      await db
        .update(artworks)
        .set({ display_order: i })
        .where(eq(artworks.id, reorderedArtworks[i].id));
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering artworks:', error);
    return NextResponse.json(
      { error: 'Failed to reorder artworks' },
      { status: 500 }
    );
  }
}