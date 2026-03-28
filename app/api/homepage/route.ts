import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { homepageSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET homepage settings
export async function GET() {
  try {
    const settings = await db
      .select()
      .from(homepageSettings)
      .where(eq(homepageSettings.id, 1))
      .then(res => res[0] || null);
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching homepage settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage settings' },
      { status: 500 }
    );
  }
}

// PUT update homepage settings
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    const updated = await db
      .update(homepageSettings)
      .set({
        hero_image_url: data.hero_image_url,
        hero_title: data.hero_title,
        hero_subtitle: data.hero_subtitle,
        updated_at: new Date(),
      })
      .where(eq(homepageSettings.id, 1))
      .returning();
    
    // Revalidate homepage
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/revalidate?path=/`);
    
    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('Error updating homepage settings:', error);
    return NextResponse.json(
      { error: 'Failed to update homepage settings' },
      { status: 500 }
    );
  }
}