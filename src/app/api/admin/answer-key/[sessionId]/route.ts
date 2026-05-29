// app/api/admin/answer-key/[sessionId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { withPermission } from '@/lib/rbac';
import { Attempt } from '@/models/Attempt';
import { Session } from '@/models/Session';
import { WordBank } from '@/models/WordBank';

async function handler(req: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const groupFilter = searchParams.get('group');
    const studentFilter = searchParams.get('studentId');

    const session = await Session.findById(params.sessionId);
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    // Build attempt query
    const attemptQuery: any = { sessionId: params.sessionId };
    if (groupFilter) attemptQuery.group = groupFilter;
    if (studentFilter) attemptQuery.studentId = studentFilter;

    const attempts = await Attempt.find(attemptQuery)
      .populate('studentId', 'fullName registrationNumber grade schoolName city')
      .lean();

    // Get all word IDs referenced in this session
    const allWordIds = new Set<string>();
    attempts.forEach(a => {
      a.round1?.answers?.forEach((ans: any) => allWordIds.add(ans.wordId.toString()));
      a.round2?.answers?.forEach((ans: any) => allWordIds.add(ans.wordId.toString()));
    });

    const words = await WordBank.find({ _id: { $in: [...allWordIds] } })
      .select('targetWord situationalPrompt formalSynonym millennialCrossRef group category difficultyScore')
      .lean();
    const wordMap = Object.fromEntries(words.map(w => [w._id.toString(), w]));

    // Build answer key structure
    const answerKey = attempts.map(attempt => {
      const student = attempt.studentId as any;

      const round1Answers = (attempt.round1?.answers || []).map((ans: any) => ({
        wordId: ans.wordId.toString(),
        targetWord: wordMap[ans.wordId.toString()]?.targetWord ?? '—',
        situationalPrompt: wordMap[ans.wordId.toString()]?.situationalPrompt,
        formalSynonym: wordMap[ans.wordId.toString()]?.formalSynonym,
        millennialCrossRef: wordMap[ans.wordId.toString()]?.millennialCrossRef,
        category: wordMap[ans.wordId.toString()]?.category,
        difficultyScore: wordMap[ans.wordId.toString()]?.difficultyScore,
        submittedAnswer: ans.submittedAnswer,
        isCorrect: ans.isCorrect,
        timeTakenMs: ans.timeTakenMs,
      }));

      const round2Answers = (attempt.round2?.answers || []).map((ans: any) => ({
        wordId: ans.wordId.toString(),
        targetWord: wordMap[ans.wordId.toString()]?.targetWord ?? '—',
        situationalPrompt: wordMap[ans.wordId.toString()]?.situationalPrompt,
        formalSynonym: wordMap[ans.wordId.toString()]?.formalSynonym,
        millennialCrossRef: wordMap[ans.wordId.toString()]?.millennialCrossRef,
        category: wordMap[ans.wordId.toString()]?.category,
        clueType: ans.clueType,
        submittedAnswer: ans.submittedAnswer,
        isCorrect: ans.isCorrect,
        timeTakenMs: ans.timeTakenMs,
      }));

      const round1Accuracy = round1Answers.length
        ? Math.round((round1Answers.filter((a: any) => a.isCorrect).length / round1Answers.length) * 100)
        : 0;
      const round2Accuracy = round2Answers.length
        ? Math.round((round2Answers.filter((a: any) => a.isCorrect).length / round2Answers.length) * 100)
        : 0;

      return {
        studentId: student?._id || 'guest',
        fullName: student?.fullName || 'Guest Speller',
        registrationNumber: student?.registrationNumber || 'GST-000',
        grade: student?.grade || '5th',
        schoolName: student?.schoolName || 'Guest Academy',
        city: student?.city || 'Sandbox',
        group: attempt.group,
        status: attempt.status,
        totalScore: attempt.totalScore,
        round1Score: attempt.round1?.score || 0,
        round2Score: attempt.round2?.score || 0,
        rank: attempt.rank,
        livesRemaining: attempt.round1?.livesRemaining || 0,
        round1Answers,
        round2Answers,
        round1Accuracy,
        round2Accuracy,
      };
    });

    return NextResponse.json({ success: true, answerKey });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const GET = withPermission('answer_key:read_all', handler);
