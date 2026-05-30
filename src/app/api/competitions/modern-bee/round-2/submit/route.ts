import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Attempt } from '@/models/Attempt';
import { WordBank } from '@/models/WordBank';
import { Student } from '@/models/Student';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 });
  }

  try {
    await connectDB();
    const auth = await getServerSession(authOptions);
    if (!auth?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const student = await Student.findOne({ userId: (auth.user as any).id });
    if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });

    const attempt = await Attempt.findOne({ studentId: student._id, sessionId: body.sessionId });
    if (!attempt || attempt.status === 'disqualified') {
      return NextResponse.json({ error: 'Invalid attempt' }, { status: 403 });
    }

    const word = await WordBank.findById(body.wordId);
    if (!word) return NextResponse.json({ error: 'Word not found' }, { status: 404 });

    // Evaluate: case-insensitive, trimmed
    const isCorrect = word.targetWord.toLowerCase().trim() ===
      body.submittedAnswer.toLowerCase().trim();

    // Round 2 points: 15 base, +bonus for fast answers
    const timeBonus = isCorrect 
      ? (body.timeTakenMs < 20000 ? 5 : body.timeTakenMs < 40000 ? 2 : 0)
      : 0;
    
    const points = isCorrect ? (15 + timeBonus) : 0;

    attempt.round2.answers.push({
      wordId: word._id,
      clueType: body.clueType,
      targetWord: word.targetWord,
      submittedAnswer: body.submittedAnswer.toUpperCase().trim(),
      isCorrect,
      timeTakenMs: body.timeTakenMs,
    });
    attempt.round2.score += points;

    await WordBank.findByIdAndUpdate(body.wordId, { $inc: { usageCount: 1 } });
    await attempt.save();

    return NextResponse.json({
      isCorrect,
      correctAnswer: isCorrect ? undefined : word.targetWord,
      pointsEarned: points,
      totalRound2Score: attempt.round2.score,
    });

  } catch (error: any) {
    console.warn('⚠️ Server-side MongoDB fallback mode activated for round 2 submit API:', error.message);

    const mockWords = [
      { targetWord: 'UNBOXING' },
      { targetWord: 'EMOTE' },
      { targetWord: 'VIBE' },
      { targetWord: 'RIZZ' },
      { targetWord: 'SUS' },
      { targetWord: 'CHEUGY' },
      { targetWord: 'DELULU' },
      { targetWord: 'GOATED' },
      { targetWord: 'CLOUT' },
    ];
    
    let correctWord = 'RIZZ'; // default fallback
    if (body.wordId && body.wordId.startsWith('mock-r2-')) {
      const idx = parseInt(body.wordId.replace('mock-r2-', ''));
      if (!isNaN(idx) && mockWords[idx]) {
        correctWord = mockWords[idx].targetWord;
      }
    }
    
    const submittedStr = (body.submittedAnswer ?? '').toUpperCase().trim();
    const isCorrect = submittedStr === correctWord;
    const timeBonus = isCorrect ? ((body.timeTakenMs ?? 0) < 20000 ? 5 : (body.timeTakenMs ?? 0) < 40000 ? 2 : 0) : 0;
    const points = isCorrect ? (15 + timeBonus) : 0;

    return NextResponse.json({
      isCorrect,
      correctAnswer: isCorrect ? undefined : correctWord,
      pointsEarned: points,
      totalRound2Score: points, // basic score simulation
    });
  }
}
