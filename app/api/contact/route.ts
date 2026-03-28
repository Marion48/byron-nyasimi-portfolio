import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactMessages } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';

// POST new contact message
export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();
    
    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Save to database
    const newMessage = await db
      .insert(contactMessages)
      .values({
        name,
        email,
        message,
        status: 'unread',
      })
      .returning();
    
    // Revalidate messages page
    revalidatePath('/admin/messages');
    
    // Optional: Send email notification
    // You can add Resend or other email service here
    
    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}