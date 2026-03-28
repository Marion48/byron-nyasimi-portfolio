import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { artworks } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

// GET all artworks
export async function GET() {
  try {
    const allArtworks = await db
      .select()
      .from(artworks)
      .orderBy(asc(artworks.display_order));
    
    return NextResponse.json(allArtworks);
  } catch (error) {
    console.error('Error fetching artworks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artworks' },
      { status: 500 }
    );
  }
}

// POST new artwork
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newArtwork = await db
      .insert(artworks)
      .values({
        title: body.title,
        year: body.year,
        medium: body.medium,
        dimensions: body.dimensions,
        description: body.description,
        image_url: body.image_url,
        display_order: body.display_order,
      })
      .returning();
    
    return NextResponse.json(newArtwork[0]);
  } catch (error) {
    console.error('Error creating artwork:', error);
    return NextResponse.json(
      { error: 'Failed to create artwork' },
      { status: 500 }
    );
  }
}

// PUT update artwork
export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();
    
    const updated = await db
      .update(artworks)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(artworks.id, id))
      .returning();
    
    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('Error updating artwork:', error);
    return NextResponse.json(
      { error: 'Failed to update artwork' },
      { status: 500 }
    );
  }
}

// DELETE artwork
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID required' },
        { status: 400 }
      );
    }
    
    await db
      .delete(artworks)
      .where(eq(artworks.id, parseInt(id)));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting artwork:', error);
    return NextResponse.json(
      { error: 'Failed to delete artwork' },
      { status: 500 }
    );
  }
}