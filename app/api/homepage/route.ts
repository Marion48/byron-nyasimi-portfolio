import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { homepageSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET homepage settings
export async function GET() {
  try {
    let settings = await db
      .select()
      .from(homepageSettings)
      .where(eq(homepageSettings.id, 1))
      .then(res => res[0] || null);
    
    // Return default if no settings found
    if (!settings) {
      settings = {
        id: 1,
        hero_image_url: '/archive/hero.jpg',
        hero_title: 'Byron Nyasimi',
        hero_subtitle: 'Contemporary Abstract Artist',
        updated_at: new Date(),
      };
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching homepage settings:', error);
    // Return defaults on error
    return NextResponse.json({
      id: 1,
      hero_image_url: '/archive/hero.jpg',
      hero_title: 'Byron Nyasimi',
      hero_subtitle: 'Contemporary Abstract Artist',
    });
  }
}

// PUT update homepage settings
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    // Check if record exists
    const existing = await db
      .select()
      .from(homepageSettings)
      .where(eq(homepageSettings.id, 1))
      .then(res => res[0]);
    
    let result;
    if (existing) {
      // Update existing
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
      // Insert new
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
    
    // Revalidate homepage (don't await to avoid blocking)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://whizzer-art-portfolio.vercel.app';
    fetch(`${baseUrl}/api/revalidate?path=/`).catch(console.error);
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating homepage settings:', error);
    return NextResponse.json(
      { error: 'Failed to update homepage settings' },
      { status: 500 }
    );
  }
}