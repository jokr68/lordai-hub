import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { memories, characters } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const userId = user.id;
    const { id } = await params;
    const memoryId = parseInt(id);

    const body = await request.json();
    const { content, priority } = body;

    // Verify memory belongs to user's character
    const memoryCheck = await db
      .select({
        memoryId: memories.id,
        characterId: memories.characterId,
      })
      .from(memories)
      .innerJoin(characters, eq(memories.characterId, characters.id))
      .where(and(eq(memories.id, memoryId), eq(characters.creatorId, userId)))
      .limit(1);

    if (memoryCheck.length === 0) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    // Update memory
    const [updatedMemory] = await db
      .update(memories)
      .set({
        content: content || undefined,
        priority: priority || undefined,
      })
      .where(eq(memories.id, memoryId))
      .returning();

    return NextResponse.json({ memory: updatedMemory });
  } catch (error) {
    console.error('Error updating memory:', error);
    return NextResponse.json({ error: 'Failed to update memory' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const userId = user.id;
    const { id } = await params;
    const memoryId = parseInt(id);

    // Verify memory belongs to user's character
    const memoryCheck = await db
      .select({
        memoryId: memories.id,
        characterId: memories.characterId,
      })
      .from(memories)
      .innerJoin(characters, eq(memories.characterId, characters.id))
      .where(and(eq(memories.id, memoryId), eq(characters.creatorId, userId)))
      .limit(1);

    if (memoryCheck.length === 0) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    // Delete memory
    await db.delete(memories).where(eq(memories.id, memoryId));

    return NextResponse.json({ message: 'Memory deleted successfully' });
  } catch (error) {
    console.error('Error deleting memory:', error);
    return NextResponse.json({ error: 'Failed to delete memory' }, { status: 500 });
  }
}