import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { branches, messages } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// GET - Get a specific branch with messages
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const branch = await db
      .select()
      .from(branches)
      .where(eq(branches.id, parseInt(id)))
      .then((res) => Array.isArray(res) ? res[0] : res);

    if (!branch) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }

    const branchMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.branchId, branch.id))
      .orderBy(messages.createdAt);

    return NextResponse.json({
      ...branch,
      messages: branchMessages,
    });
  } catch (error) {
    console.error('Error fetching branch:', error);
    return NextResponse.json(
      { error: 'Failed to fetch branch' },
      { status: 500 }
    );
  }
}

// PUT - Update a branch
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    await db
      .update(branches)
      .set({ name })
      .where(eq(branches.id, parseInt(id)));

    const updatedBranch = await db
      .select()
      .from(branches)
      .where(eq(branches.id, parseInt(id)))
      .then((res) => Array.isArray(res) ? res[0] : res);

    return NextResponse.json(updatedBranch);
  } catch (error) {
    console.error('Error updating branch:', error);
    return NextResponse.json(
      { error: 'Failed to update branch' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a branch
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete all messages in the branch
    await db.delete(messages).where(eq(messages.branchId, parseInt(id)));

    // Delete the branch
    await db.delete(branches).where(eq(branches.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting branch:', error);
    return NextResponse.json(
      { error: 'Failed to delete branch' },
      { status: 500 }
    );
  }
}