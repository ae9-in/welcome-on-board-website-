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

    const userRole = (auth.user as any).role;
    const isAdmin = userRole === 'admin';

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    const wordIndex = parseInt(searchParams.get('index') ?? '0');
    const targetStudentId = searchParams.get('studentId'); // admin can pass this

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const { Student } = await import('@/models/Student');
    let student;
    if (isAdmin && targetStudentId) {
      student = await Student.findById(targetStudentId);
    } else {
      student = await Student.findOne({ userId: (auth.user as any).id });
    }
    if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });

    // Students need a valid attempt; admins can skip this
    let attempt = null;
    if (!isAdmin) {
      attempt = await Attempt.findOne({ studentId: student._id, sessionId });
      if (!attempt || attempt.status === 'disqualified') {
        return NextResponse.json({ error: 'Invalid attempt' }, { status: 403 });
      }
      if (attempt.status === 'registered' && wordIndex === 0) {
        attempt.status = 'round1';
        attempt.startedAt = new Date();
        await attempt.save();
      }
    }

    const session = await Session.findById(sessionId);
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    const assignment = session.wordAssignments.find(
      (a: any) => a.studentId.toString() === student._id.toString()
    );

    if (!assignment) {
      return NextResponse.json({ error: 'No words assigned for this session' }, { status: 400 });
    }

    if (wordIndex >= assignment.round1Words.length) {
      return NextResponse.json({ done: true, totalWords: assignment.round1Words.length });
    }

    const wordId = assignment.round1Words[wordIndex];

    const word = await WordBank.findById(wordId);
    if (!word) return NextResponse.json({ error: 'Word not found' }, { status: 404 });

    const { ensureWordHasRealDetails } = await import('@/lib/dictionary');
    await ensureWordHasRealDetails(word);

    return NextResponse.json({
      wordId: word._id,
      index: wordIndex,
      total: assignment.round1Words.length,
      pronunciation: word.pronunciation,
      audioUrl: word.audioUrl,
      difficultyScore: word.difficultyScore,
      category: word.category,
      timeLimit: session.round1Config.timePerWordSeconds,
      livesRemaining: attempt?.round1?.livesRemaining ?? 2,
      // New TTS fields
      definition: word.definition,
      exampleSentence1: word.exampleSentence1,
      exampleSentence2: word.exampleSentence2,
      partOfSpeech: word.partOfSpeech,
      stressPattern: word.stressPattern,
      ttsOverrideText: word.ttsOverrideText,
      audioUrlHighQuality: word.audioUrlHighQuality,
      // Admin-only answer key fields
      ...(isAdmin && {
        targetWord: word.targetWord,
        situationalPrompt: word.situationalPrompt,
        formalSynonym: word.formalSynonym,
        partnerWords: word.partnerWords,
        isAdmin: true,
      }),
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
