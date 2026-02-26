import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { characters } from '@/db/schema';
import { eq } from 'drizzle-orm';
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let characterList;

    if (userId) {
      characterList = await db
        .select()
        .from(characters)
        .where(eq(characters.creatorId, parseInt(userId)));
    } else {
      characterList = await db
        .select()
        .from(characters)
        .where(eq(characters.isPublic, true));
    }

    return NextResponse.json({ characters: characterList }, { status: 200 });
  } catch (error) {
    console.error('Fetch characters error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    if (!name) {
      return NextResponse.json(
        { error: 'Character name is required' },
        { status: 400 }
      );
    }

    const [newCharacter] = await db
      .insert(characters)
      .values({
        creatorId: user.userId,
        name,
        description,
        avatar,
        personality: personality ? JSON.stringify(personality) : null,
        attributes: attributes ? JSON.stringify(attributes) : null,
        skills: skills ? JSON.stringify(skills) : null,
        isPublic: isPublic !== undefined ? isPublic : true,
      })
      .returning();

    return NextResponse.json(
      { 
        message: 'Character created successfully',
        character: newCharacter 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create character error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}