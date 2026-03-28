import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { exhibitions } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET all exhibitions
export async function GET() {
  try {
    const allExhibitions = await db
      .select()
      .from(exhibitions)
      .orderBy(desc(exhibitions.date));
    
    return NextResponse.json(allExhibitions);
  } catch (error) {
    console.error('Error fetching exhibitions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exhibitions' },
      { status: 500 }
    );
  }
}

// POST new exhibition
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newExhibition = await db
      .insert(exhibitions)
      .values({
        title: body.title,
        gallery_name: body.gallery_name,
        location: body.location,
        date: body.date,
        description: body.description,
        image_urls: JSON.stringify(body.image_urls),
        display_order: body.display_order,
      })
      .returning();
    
    return NextResponse.json(newExhibition[0]);
  } catch (error) {
    console.error('Error creating exhibition:', error);
    return NextResponse.json(
      { error: 'Failed to create exhibition' },
      { status: 500 }
    );
  }
}

// PUT update exhibition
export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();
    
    const updated = await db
      .update(exhibitions)
      .set({
        title: data.title,
        gallery_name: data.gallery_name,
        location: data.location,
        date: data.date,
        description: data.description,
        image_urls: JSON.stringify(data.image_urls),
        display_order: data.display_order,
        updated_at: new Date(),
      })
      .where(eq(exhibitions.id, id))
      .returning();
    
    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('Error updating exhibition:', error);
    return NextResponse.json(
      { error: 'Failed to update exhibition' },
      { status: 500 }
    );
  }
}

// DELETE exhibition
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
      .delete(exhibitions)
      .where(eq(exhibitions.id, parseInt(id)));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting exhibition:', error);
    return NextResponse.json(
      { error: 'Failed to delete exhibition' },
      { status: 500 }
    );
  }
}