import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactInfo } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET contact info
export async function GET() {
  try {
    const info = await db
      .select()
      .from(contactInfo)
      .where(eq(contactInfo.id, 1))
      .then(res => res[0] || null);
    
    return NextResponse.json(info);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact info' },
      { status: 500 }
    );
  }
}

// PUT update contact info
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    const existing = await db
      .select()
      .from(contactInfo)
      .where(eq(contactInfo.id, 1))
      .then(res => res[0]);
    
    let result;
    if (existing) {
      result = await db
        .update(contactInfo)
        .set({
          studio_address: data.studio_address,
          studio_email: data.studio_email,
          gallery_name: data.gallery_name,
          gallery_email: data.gallery_email,
          instagram_url: data.instagram_url,
          artsy_url: data.artsy_url,
          updated_at: new Date(),
        })
        .where(eq(contactInfo.id, 1))
        .returning();
    } else {
      result = await db
        .insert(contactInfo)
        .values({
          id: 1,
          studio_address: data.studio_address,
          studio_email: data.studio_email,
          gallery_name: data.gallery_name,
          gallery_email: data.gallery_email,
          instagram_url: data.instagram_url,
          artsy_url: data.artsy_url,
        })
        .returning();
    }
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating contact info:', error);
    return NextResponse.json(
      { error: 'Failed to update contact info' },
      { status: 500 }
    );
  }
}