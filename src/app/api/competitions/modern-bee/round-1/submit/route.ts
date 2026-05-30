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

    // Evaluate: case-insensitive, trim whitespace
    const isCorrect = word.targetWord.toLowerCase().trim() ===
      body.submittedAnswer.toLowerCase().trim();

    let lifeUsed = false;

    // If answer is incorrect, set livesRemaining to 0 to disable retries.
    if (!isCorrect) {
      attempt.round1.livesRemaining = 0;
    }

    // Points: 10 base, -2 if life used (re-attempt), +bonus for fast answers
    // timeLimit is generally 45s. Fast answers are under 15s (+3 pts) and 30s (+1 pt)
    const timeBonus = isCorrect 
      ? (body.timeTakenMs < 15000 ? 3 : body.timeTakenMs < 30000 ? 1 : 0)
      : 0;
    
    const points = isCorrect ? (10 - (lifeUsed ? 2 : 0) + timeBonus) : 0;

    attempt.round1.answers.push({
      wordId: word._id,
      targetWord: word.targetWord,
      submittedAnswer: body.submittedAnswer.toUpperCase().trim(),
      isCorrect,
      timeTakenMs: body.timeTakenMs,
      lifeUsed,
    });
    attempt.round1.score += points;

    // Update WordBank usage counter
    await WordBank.findByIdAndUpdate(body.wordId, { $inc: { usageCount: 1 } });

    // If student runs out of lives, they can be advanced automatically or marked as finished with R1
    await attempt.save();

    return NextResponse.json({
      isCorrect,
      correctAnswer: isCorrect ? undefined : word.targetWord, // reveal only on wrong
      pointsEarned: points,
      livesRemaining: attempt.round1.livesRemaining,
      totalRound1Score: attempt.round1.score,
    });

  } catch (error: any) {
    console.warn('⚠️ Server-side MongoDB fallback mode activated for submit API:', error.message);

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
    if (body.wordId && body.wordId.startsWith('mock-r1-')) {
      const idx = parseInt(body.wordId.replace('mock-r1-', ''));
      if (!isNaN(idx) && mockWords[idx]) {
        correctWord = mockWords[idx].targetWord;
      }
    }
    
    const submittedStr = (body.submittedAnswer ?? '').toUpperCase().trim();
    const isCorrect = submittedStr === correctWord;
    const timeBonus = isCorrect ? ((body.timeTakenMs ?? 0) < 15000 ? 3 : (body.timeTakenMs ?? 0) < 30000 ? 1 : 0) : 0;
    const points = isCorrect ? (10 + timeBonus) : 0;

    return NextResponse.json({
      isCorrect,
      correctAnswer: isCorrect ? undefined : correctWord,
      pointsEarned: points,
      livesRemaining: 0, // lives system disabled
      totalRound1Score: points, // basic score simulation
    });
  }
}
