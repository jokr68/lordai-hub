import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { memories, characters } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token and get user ID (simplified - in production use proper JWT verification)
    const user = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const userId = user.id;

    // Fetch memories with character names
    const userMemories = await db
      .select({
        id: memories.id,
        characterId: memories.characterId,
        characterName: characters.name,
        content: memories.content,
        priority: memories.priority,
        createdAt: memories.createdAt,
      })
      .from(memories)
      .innerJoin(characters, eq(memories.characterId, characters.id))
      .where(eq(characters.creatorId, userId))
      .orderBy(memories.createdAt);

    return NextResponse.json({ memories: userMemories });
  } catch (error) {
    console.error('Error fetching memories:', error);
    return NextResponse.json({ error: 'Failed to fetch memories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const userId = user.id;

    const body = await request.json();
    const { characterId, content, priority } = body;

    if (!characterId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify character belongs to user
    const character = await db
      .select()
      .from(characters)
      .where(and(eq(characters.id, characterId), eq(characters.creatorId, userId)))
      .limit(1);

    if (character.length === 0) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    // Create memory
    const [newMemory] = await db
      .insert(memories)
      .values({
        characterId,
        content,
        priority: priority || 'medium',
        createdAt: new Date(),
      })
      .returning();

    return NextResponse.json({ memory: newMemory }, { status: 201 });
  } catch (error) {
    console.error('Error creating memory:', error);
    return NextResponse.json({ error: 'Failed to create memory' }, { status: 500 });
  }
}