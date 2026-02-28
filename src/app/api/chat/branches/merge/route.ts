import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { branches, messages } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// POST - Merge two branches
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sourceBranchId, targetBranchId } = body;

    if (!sourceBranchId || !targetBranchId) {
      return NextResponse.json(
        { error: 'Source and target branch IDs are required' },
        { status: 400 }
      );
    }

    // Get source branch
    const sourceBranch = await db
      .select()
      .from(branches)
      .where(eq(branches.id, parseInt(sourceBranchId)))
      .then((res) => Array.isArray(res) ? res[0] : res);

    if (!sourceBranch) {
      return NextResponse.json(
        { error: 'Source branch not found' },
        { status: 404 }
      );
    }

    // Get target branch
    const targetBranch = await db
      .select()
      .from(branches)
      .where(eq(branches.id, parseInt(targetBranchId)))
      .then((res) => Array.isArray(res) ? res[0] : res);

    if (!targetBranch) {
      return NextResponse.json(
        { error: 'Target branch not found' },
        { status: 404 }
      );
    }

    // Get messages from source branch
    const sourceMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.branchId, sourceBranch.id))
      .orderBy(messages.createdAt);

    // Copy messages to target branch
    for (const msg of sourceMessages) {
      await db.insert(messages).values({
        conversationId: targetBranch.conversationId,
        branchId: targetBranch.id,
        sender: msg.sender,
        content: msg.content,
        isVoice: msg.isVoice,
        voiceUrl: msg.voiceUrl,
      });
    }

    // Delete source branch and its messages
    await db.delete(messages).where(eq(messages.branchId, sourceBranch.id));
    await db.delete(branches).where(eq(branches.id, sourceBranch.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error merging branches:', error);
    return NextResponse.json(
      { error: 'Failed to merge branches' },
      { status: 500 }
    );
  }
}