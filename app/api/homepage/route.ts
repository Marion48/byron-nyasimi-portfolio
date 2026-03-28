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
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { hero_image_url, hero_title, hero_subtitle } = body;
    
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
          hero_image_url,
          hero_title,
          hero_subtitle,
          updated_at: new Date(),
        })
        .where(eq(homepageSettings.id, 1))
        .returning();
    } else {
      result = await db
        .insert(homepageSettings)
        .values({
          id: 1,
          hero_image_url,
          hero_title,
          hero_subtitle,
        })
        .returning();
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://whizzer-art-portfolio.vercel.app';
    fetch(`${baseUrl}/api/revalidate?path=/`).catch(() => {});
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Update failed' },
      { status: 500 }
    );
  }
}