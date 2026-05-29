import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Attempt } from '@/models/Attempt';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    const group = searchParams.get('group');
    const limit = parseInt(searchParams.get('limit') ?? '20');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const matchQuery: any = { sessionId, status: { $in: ['round2', 'completed'] } };
    if (group) matchQuery.group = group;

    const leaderboard = await Attempt.aggregate([
      { $match: matchQuery },
      {
        $lookup: {
          from: 'students',
          localField: 'studentId',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $project: {
          _id: 0,
          studentId: 1,
          fullName: '$student.fullName',
          schoolName: '$student.schoolName',
          city: '$student.city',
          group: 1,
          totalScore: 1,
          round1Score: '$round1.score',
          round2Score: '$round2.score',
          status: 1,
          completedAt: 1,
          audienceReactions: 1,
        }
      },
      { $sort: { totalScore: -1, completedAt: 1 } },
      { $limit: limit },
    ]);

    // Attach rank
    const ranked = leaderboard.map((entry, i) => ({ ...entry, rank: i + 1 }));

    // Push leaderboard update via Pusher if configured
    try {
      const { pusherServer } = await import('@/lib/pusher');
      await pusherServer.trigger(`session-${sessionId}`, 'leaderboard-update', { ranked });
    } catch (e) {
      console.warn('Pusher trigger skipped or failed (unconfigured credentials):', e);
    }

    return NextResponse.json({ leaderboard: ranked, updatedAt: new Date() });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
