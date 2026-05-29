// app/api/student/answer-key/[attemptId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { withPermission } from '@/lib/rbac';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Attempt } from '@/models/Attempt';
import { WordBank } from '@/models/WordBank';
import { Student } from '@/models/Student';

async function handler(req: NextRequest, { params }: { params: { attemptId: string } }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const attempt = await Attempt.findById(params.attemptId).lean();
    if (!attempt) {
      return NextResponse.json({ error: 'Attempt record not found' }, { status: 404 });
    }

    // Verify ownership
    const student = await Student.findOne({ userId: (session?.user as any).id });
    if (!student || attempt.studentId.toString() !== student._id.toString()) {
      return NextResponse.json({ error: 'Forbidden: Access denied' }, { status: 403 });
    }

    // Check if attempt or session is completed
    if (attempt.status !== 'completed') {
      return NextResponse.json({ error: 'Answer key is only available after completing the competition.' }, { status: 400 });
    }

    // Extract word details
    const round1WordIds = attempt.round1?.answers?.map((ans: any) => ans.wordId.toString()) || [];
    const round2WordIds = attempt.round2?.answers?.map((ans: any) => ans.wordId.toString()) || [];
    const allWordIds = Array.from(new Set([...round1WordIds, ...round2WordIds]));

    const words = await WordBank.find({ _id: { $in: allWordIds } })
      .select('targetWord situationalPrompt formalSynonym millennialCrossRef category group')
      .lean();
    const wordMap = Object.fromEntries(words.map(w => [w._id.toString(), w]));

    const round1Answers = (attempt.round1?.answers || []).map((ans: any) => ({
      wordId: ans.wordId.toString(),
      targetWord: wordMap[ans.wordId.toString()]?.targetWord ?? '—',
      situationalPrompt: wordMap[ans.wordId.toString()]?.situationalPrompt,
      formalSynonym: wordMap[ans.wordId.toString()]?.formalSynonym,
      millennialCrossRef: wordMap[ans.wordId.toString()]?.millennialCrossRef,
      category: wordMap[ans.wordId.toString()]?.category,
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

    return NextResponse.json({
      success: true,
      round1Answers,
      round2Answers,
      totalScore: attempt.totalScore,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const GET = withPermission('answer_key:read_own', handler);
