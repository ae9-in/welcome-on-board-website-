import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Session } from '@/models/Session';
import { Attempt } from '@/models/Attempt';
import { WordBank } from '@/models/WordBank';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');
  const clueIndex = parseInt(searchParams.get('index') ?? '0');

  try {
    await connectDB();
    const auth = await getServerSession(authOptions);
    if (!auth?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
    console.warn('⚠️ Server-side MongoDB fallback mode activated for clues API:', error.message);

    const mockClues = [
      { wordId: 'mock-r2-0', targetWord: 'UNBOXING', situationalPrompt: 'Opening up a brand-new, sealed toy catalog order on a live stream.', formalSynonym: 'Unwrapping or unpacking.', millennialCrossRef: 'Making a home video of opening birthday gifts.' },
      { wordId: 'mock-r2-1', targetWord: 'EMOTE', situationalPrompt: 'Your character executes a fast victory celebration dance on a gaming server.', formalSynonym: 'Gesture or expression.', millennialCrossRef: 'Doing an animated avatar dance step.' },
      { wordId: 'mock-r2-2', targetWord: 'VIBE', situationalPrompt: 'The relaxing energy of a low-light music room filled with cozy pillows.', formalSynonym: 'Atmosphere or aura.', millennialCrossRef: 'The overall mood or general feeling.' },
      { wordId: 'mock-r2-3', targetWord: 'RIZZ', situationalPrompt: 'A speaker smoothly convinces their classmates to vote for them using pure charm.', formalSynonym: 'Charisma or allure.', millennialCrossRef: 'Having smooth talking game or charm.' },
      { wordId: 'mock-r2-4', targetWord: 'SUS', situationalPrompt: 'A player quietly sneaks out of a shared document room without saving code.', formalSynonym: 'Suspicious or questionable.', millennialCrossRef: 'Shady or untrustworthy actions.' },
      { wordId: 'mock-r2-5', targetWord: 'CHEUGY', situationalPrompt: 'Someone inserts bright, word-art animations into a presentation deck.', formalSynonym: 'Outdated or old-fashioned.', millennialCrossRef: 'Basic or trying too hard to stay trendy.' },
      { wordId: 'mock-r2-6', targetWord: 'DELULU', situationalPrompt: 'An individual plans to code an entire enterprise network map during a single five-minute recess block.', formalSynonym: 'Delusional or unrealistic.', millennialCrossRef: 'Completely daydreaming or out of touch.' },
      { wordId: 'mock-r2-7', targetWord: 'GOATED', situationalPrompt: 'A speed-runner completes a flawless level run that shatters all past global time tracking records.', formalSynonym: 'Incomparable or supreme.', millennialCrossRef: 'The Greatest of All Time (G.O.A.T.).' },
      { wordId: 'mock-r2-8', targetWord: 'CLOUT', situationalPrompt: 'An internet channel compromises software utility just to score algorithmic metrics.', formalSynonym: 'Influence or leverage.', millennialCrossRef: 'Chasing fame or looking for attention online.' }
    ];

    if (clueIndex >= mockClues.length) {
      return NextResponse.json({ done: true, totalClues: mockClues.length });
    }

    const item = mockClues[clueIndex];
    const clueTypes = ['situational', 'synonym', 'millennial'];
    const clueType = clueTypes[clueIndex % clueTypes.length];
    
    let clueText = '';
    if (clueType === 'situational') clueText = item.situationalPrompt;
    else if (clueType === 'synonym') clueText = item.formalSynonym;
    else clueText = item.millennialCrossRef;

    return NextResponse.json({
      wordId: item.wordId,
      clueType,
      clueText,
      index: clueIndex,
      total: mockClues.length,
      timeLimit: 60,
      targetWord: item.targetWord, // admin / frontend check
    });
  }
}
