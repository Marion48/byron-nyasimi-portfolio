import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactMessages } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET all messages
export async function GET() {
  try {
    const allMessages = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.created_at));
    
    return NextResponse.json(allMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// PUT update message status
export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    
    const updated = await db
      .update(contactMessages)
      .set({ status, updated_at: new Date() })
      .where(eq(contactMessages.id, id))
      .returning();
    
    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

// DELETE message
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
      .delete(contactMessages)
      .where(eq(contactMessages.id, parseInt(id)));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}