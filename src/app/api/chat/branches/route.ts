import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { branches, messages } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// GET - Get all branches for a conversation
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    const allBranches = await db
      .select()
      .from(branches)
      .where(eq(branches.conversationId, parseInt(conversationId)))
      .orderBy(desc(branches.createdAt));

    // Get messages for each branch
    const branchesWithMessages = await Promise.all(
      allBranches.map(async (branch) => {
        const branchMessages = await db
          .select()
          .from(messages)
          .where(eq(messages.branchId, branch.id))
          .orderBy(messages.createdAt);

        return {
          ...branch,
          messages: branchMessages,
        };
      })
    );

    return NextResponse.json({ branches: branchesWithMessages });
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch branches' },
      { status: 500 }
    );
  }
}

// POST - Create a new branch
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, name, parentId, messageIds } = body;

    if (!conversationId || !name) {
      return NextResponse.json(
        { error: 'Conversation ID and name are required' },
        { status: 400 }
      );
    }

    // Create the branch
    const result = await db.insert(branches).values({
      conversationId: parseInt(conversationId),
      name,
      parentId: parentId ? parseInt(parentId) : null,
    }).returning();

    const newBranch = Array.isArray(result) ? result[0] : result;

    // If messageIds provided, copy messages to the new branch
    if (messageIds && messageIds.length > 0) {
      const messagesToCopy = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, parseInt(conversationId)));

      const filteredMessages = messagesToCopy.filter((msg) =>
        messageIds.includes(msg.id.toString())
      );

      for (const msg of filteredMessages) {
        await db.insert(messages).values({
          conversationId: parseInt(conversationId),
          branchId: newBranch.id,
          sender: msg.sender,
          content: msg.content,
          isVoice: msg.isVoice,
          voiceUrl: msg.voiceUrl,
        });
      }
    }

    // Get the created branch with messages
    const branchMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.branchId, newBranch.id))
      .orderBy(messages.createdAt);

    return NextResponse.json({
      ...newBranch,
      messages: branchMessages,
    });
  } catch (error) {
    console.error('Error creating branch:', error);
    return NextResponse.json(
      { error: 'Failed to create branch' },
      { status: 500 }
    );
  }
}