import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { homepageSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const settings = await db
      .select()
      .from(homepageSettings)
      .where(eq(homepageSettings.id, 1))
      .then(res => res[0] || null);
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('GET /api/homepage error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    console.log('PUT /api/homepage received:', data);
    
    // Check if record exists
    const existing = await db
      .select()
      .from(homepageSettings)
      .where(eq(homepageSettings.id, 1))
      .then(res => res[0]);
    
    let result;
    if (existing) {
      result = await db
        .update(homepageSettings)
        .set({
          hero_image_url: data.hero_image_url,
          hero_title: data.hero_title,
          hero_subtitle: data.hero_subtitle,
          updated_at: new Date(),
        })
        .where(eq(homepageSettings.id, 1))
        .returning();
    } else {
      result = await db
        .insert(homepageSettings)
        .values({
          id: 1,
          hero_image_url: data.hero_image_url,
          hero_title: data.hero_title,
          hero_subtitle: data.hero_subtitle,
        })
        .returning();
    }
    
    // Revalidate homepage (non-blocking)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://whizzer-art-portfolio.vercel.app';
    fetch(`${baseUrl}/api/revalidate?path=/`).catch(console.error);
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('PUT /api/homepage error:', error);
    return NextResponse.json(
      { error: 'Failed to update homepage settings: ' + (error as Error).message },
      { status: 500 }
    );
  }
}