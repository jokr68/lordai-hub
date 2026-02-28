import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { characters, conversations, messages } from '@/db/schema';
import { eq, and, count, gte, sql, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const userId = user.id;
    const period = request.nextUrl.searchParams.get('period') || '30d';

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case 'all':
        startDate = new Date(0);
        break;
    }

    // Get overall stats
    const [totalCharacters] = await db
      .select({ count: count() })
      .from(characters)
      .where(eq(characters.creatorId, userId));

    const [totalConversations] = await db
      .select({ count: count() })
      .from(conversations)
      .innerJoin(characters, eq(conversations.characterId, characters.id))
      .where(
        and(
          eq(characters.creatorId, userId),
          gte(conversations.createdAt, startDate)
        )
      );

    const [totalMessages] = await db
      .select({ count: count() })
      .from(messages)
      .innerJoin(conversations, eq(messages.conversationId, conversations.id))
      .innerJoin(characters, eq(conversations.characterId, characters.id))
      .where(
        and(
          eq(characters.creatorId, userId),
          gte(messages.createdAt, startDate)
        )
      );

    // Calculate growth rate (compare with previous period)
    const previousStartDate = new Date(startDate);
    const periodLength = now.getTime() - startDate.getTime();
    previousStartDate.setTime(previousStartDate.getTime() - periodLength);

    const [previousMessages] = await db
      .select({ count: count() })
      .from(messages)
      .innerJoin(conversations, eq(messages.conversationId, conversations.id))
      .innerJoin(characters, eq(conversations.characterId, characters.id))
      .where(
        and(
          eq(characters.creatorId, userId),
          gte(messages.createdAt, previousStartDate),
          sql`${messages.createdAt} < ${startDate}`
        )
      );

    const growthRate = previousMessages.count > 0
      ? ((totalMessages.count - previousMessages.count) / previousMessages.count) * 100
      : 0;

    const overallStats = {
      totalCharacters: totalCharacters.count,
      totalConversations: totalConversations.count,
      totalMessages: totalMessages.count,
      activeCharacters: totalCharacters.count, // Simplified - could be more sophisticated
      growthRate: Math.round(growthRate * 10) / 10,
    };

    // Get character-specific stats
    const characterList = await db
      .select()
      .from(characters)
      .where(eq(characters.creatorId, userId));

    const characterStats = await Promise.all(
      characterList.map(async (character) => {
        const [convCount] = await db
          .select({ count: count() })
          .from(conversations)
          .where(
            and(
              eq(conversations.characterId, character.id),
              gte(conversations.createdAt, startDate)
            )
          );

        const [msgCount] = await db
          .select({ count: count() })
          .from(messages)
          .innerJoin(conversations, eq(messages.conversationId, conversations.id))
          .where(
            and(
              eq(conversations.characterId, character.id),
              gte(messages.createdAt, startDate)
            )
          );

        // Get last activity
        const [lastMsg] = await db
          .select({ createdAt: messages.createdAt })
          .from(messages)
          .innerJoin(conversations, eq(messages.conversationId, conversations.id))
          .where(eq(conversations.characterId, character.id))
          .orderBy(desc(messages.createdAt))
          .limit(1);

        // Extract top topics (simplified - in production, use NLP)
        const recentMessages = await db
          .select({ content: messages.content })
          .from(messages)
          .innerJoin(conversations, eq(messages.conversationId, conversations.id))
          .where(
            and(
              eq(conversations.characterId, character.id),
              gte(messages.createdAt, startDate)
            )
          )
          .limit(100);

        // Simple keyword extraction
        const wordCount = new Map<string, number>();
        recentMessages.forEach(msg => {
          const words = msg.content.split(/\s+/).filter(w => w.length > 3);
          words.forEach(word => {
            wordCount.set(word, (wordCount.get(word) || 0) + 1);
          });
        });

        const topTopics = Array.from(wordCount.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([word]) => word);

        return {
          id: character.id,
          name: character.name,
          avatar: character.avatar || '',
          totalConversations: convCount.count,
          totalMessages: msgCount.count,
          avgMessagesPerConversation: convCount.count > 0 ? msgCount.count / convCount.count : 0,
          lastActivity: lastMsg?.createdAt || character.createdAt,
          topTopics,
        };
      })
    );

    return NextResponse.json({
      overallStats,
      characterStats,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}