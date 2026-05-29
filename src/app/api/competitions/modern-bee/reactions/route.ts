import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Attempt } from '@/models/Attempt';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { sessionId, type, studentId } = await req.json() as {
      sessionId: string;
      type: 'fire' | 'clap' | 'trophy';
      studentId?: string; // Optional: targeting a specific student's attempt
    };

    if (!sessionId || !type) {
      return NextResponse.json({ error: 'Session ID and Reaction Type are required' }, { status: 400 });
    }

    // Increment reaction count if targeting a student attempt
    if (studentId) {
      await Attempt.findOneAndUpdate(
        { studentId, sessionId },
        { $inc: { [`audienceReactions.${type}`]: 1 } }
      );
    }

    // Broadcast live reaction to channel
    try {
      const { pusherServer } = await import('@/lib/pusher');
      await pusherServer.trigger(`session-${sessionId}`, 'audience-reaction', {
        type,
        count: 1
      });
    } catch (e) {
      console.warn('Pusher reaction broadcast skipped (unconfigured credentials)');
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
