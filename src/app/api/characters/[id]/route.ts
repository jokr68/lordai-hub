export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { characters } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as {
      userId: number;
      email: string;
    };
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const characterId = parseInt(resolvedParams.id);

    const [character] = await db
      .select()
      .from(characters)
      .where(eq(characters.id, characterId))
      .limit(1);

    if (!character) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      );
    }

    const parsedCharacter = {
      ...character,
      personality: character.personality ? JSON.parse(character.personality) : null,
      attributes: character.attributes ? JSON.parse(character.attributes) : null,
      skills: character.skills ? JSON.parse(character.skills) : null,
    };

    return NextResponse.json({ character: parsedCharacter }, { status: 200 });
  } catch (error) {
    console.error('Fetch character error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const characterId = parseInt(resolvedParams.id);
    const body = await request.json();
    const {
      name,
      description,
      avatar,
      personality,
      attributes,
      skills,
      isPublic,
    } = body;

    const [existingCharacter] = await db
      .select()
      .from(characters)
      .where(
        and(
          eq(characters.id, characterId),
          eq(characters.creatorId, user.userId)
        )
      )
      .limit(1);

    if (!existingCharacter) {
      return NextResponse.json(
        { error: 'Character not found or unauthorized' },
        { status: 404 }
      );
    }

    const [updatedCharacter] = await db
      .update(characters)
      .set({
        name: name || existingCharacter.name,
        description: description !== undefined ? description : existingCharacter.description,
        avatar: avatar !== undefined ? avatar : existingCharacter.avatar,
        personality: personality !== undefined ? JSON.stringify(personality) : existingCharacter.personality,
        attributes: attributes !== undefined ? JSON.stringify(attributes) : existingCharacter.attributes,
        skills: skills !== undefined ? JSON.stringify(skills) : existingCharacter.skills,
        isPublic: isPublic !== undefined ? isPublic : existingCharacter.isPublic,
      })
      .where(eq(characters.id, characterId))
      .returning();

    return NextResponse.json(
      { 
        message: 'Character updated successfully',
        character: updatedCharacter 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update character error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const characterId = parseInt(resolvedParams.id);

    const [existingCharacter] = await db
      .select()
      .from(characters)
      .where(
        and(
          eq(characters.id, characterId),
          eq(characters.creatorId, user.userId)
        )
      )
      .limit(1);

    if (!existingCharacter) {
      return NextResponse.json(
        { error: 'Character not found or unauthorized' },
        { status: 404 }
      );
    }

    await db.delete(characters).where(eq(characters.id, characterId));

    return NextResponse.json(
      { message: 'Character deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete character error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}