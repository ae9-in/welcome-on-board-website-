import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Session } from '@/models/Session';
import { Attempt } from '@/models/Attempt';
import { WordBank } from '@/models/WordBank';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await getServerSession(authOptions);
    if (!auth?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    const clueIndex = parseInt(searchParams.get('index') ?? '0');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const student = await (await import('@/models/Student')).Student.findOne({ userId: (auth.user as any).id });
    if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });

    const attempt = await Attempt.findOne({ studentId: student._id, sessionId });
    if (!attempt || attempt.status === 'disqualified') {
      return NextResponse.json({ error: 'Invalid attempt' }, { status: 403 });
    }

    const session = await Session.findById(sessionId);
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    const assignment = session.wordAssignments.find(
      (a: any) => a.studentId.toString() === student._id.toString()
    );

    if (!assignment) {
      return NextResponse.json({ error: 'No words assigned for this session' }, { status: 400 });
    }

    if (clueIndex >= assignment.round2Words.length) {
      return NextResponse.json({ done: true, totalClues: assignment.round2Words.length });
    }

    const wordId = assignment.round2Words[clueIndex];
    const word = await WordBank.findById(wordId);

    if (!word) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 });
    }

    const { ensureWordHasRealDetails } = await import('@/lib/dictionary');
    await ensureWordHasRealDetails(word);

    // Set attempt status to round2 if starting
    if (attempt.status === 'round1' && clueIndex === 0) {
      attempt.status = 'round2';
      attempt.round1.completedAt = new Date();
      await attempt.save();
    }

    // Determine clue type from configured types
    const clueTypeOptions = session.round2Config.clueTypes || ['situational', 'synonym', 'millennial'];
    // We can use a deterministic selection based on index so it is stable per student index, or random
    const clueType = clueTypeOptions[clueIndex % clueTypeOptions.length];

    let clueText = '';
    if (clueType === 'situational') clueText = word.situationalPrompt;
    else if (clueType === 'synonym') clueText = word.formalSynonym;
    else clueText = word.millennialCrossRef;

    return NextResponse.json({
      wordId: word._id,
      clueType,
      clueText,
      index: clueIndex,
      total: assignment.round2Words.length,
      timeLimit: session.round2Config.timePerClueSeconds,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
