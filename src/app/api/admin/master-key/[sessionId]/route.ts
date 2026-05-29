// app/api/admin/master-key/[sessionId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { withPermission } from '@/lib/rbac';
import { Session } from '@/models/Session';
import { WordBank } from '@/models/WordBank';
import { Attempt } from '@/models/Attempt';
import { Student } from '@/models/Student';

async function handler(req: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const groupFilter = searchParams.get('group'); // Optional: filter by group
    const roundFilter = searchParams.get('round'); // '1' | '2' | 'all'

    const session = await Session.findById(params.sessionId).lean();
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    // Get all unique word IDs used in this session
    const round1WordIds = new Set<string>();
    const round2WordIds = new Set<string>();

    (session as any).wordAssignments?.forEach((a: any) => {
      if (!groupFilter || a.group === groupFilter) {
        a.round1Words?.forEach((id: any) => round1WordIds.add(id.toString()));
        a.round2Words?.forEach((id: any) => round2WordIds.add(id.toString()));
      }
    });

    const allWordIds = Array.from(new Set([
      ...(roundFilter === '2' ? [] : [...round1WordIds]),
      ...(roundFilter === '1' ? [] : [...round2WordIds]),
    ]));

    // Fetch full word details — ALL fields for master key
    const words = await WordBank.find({ _id: { $in: allWordIds } })
      .select([
        'targetWord', 'group', 'partOfSpeech',
        'definition', 'exampleSentence1', 'exampleSentence2',
        'situationalPrompt', 'formalSynonym', 'millennialCrossRef',
        'pronunciation', 'stressPattern', 'ttsOverrideText',
        'difficultyScore', 'category',
        'audioUrlHighQuality', 'audioUrl',
      ].join(' '))
      .lean();

    // Get all attempts for this session
    const attempts = await Attempt.find({ sessionId: params.sessionId })
      .populate('studentId', 'fullName registrationNumber schoolName grade')
      .lean();

    // Build per-word submission stats
    const wordMap = new Map(words.map(w => [w._id.toString(), w]));

    const masterKey = allWordIds.map(wordId => {
      const word = wordMap.get(wordId);
      if (!word) return null;

      const isRound1 = round1WordIds.has(wordId);
      const round = isRound1 ? 1 : 2;

      // Collect all student responses for this word
      const responses: {
        studentId: string;
        fullName: string;
        registrationNumber: string;
        schoolName: string;
        grade: number;
        submittedAnswer: string;
        isCorrect: boolean;
        timeTakenMs: number;
        lifeUsed?: boolean;
        clueType?: string;
      }[] = [];

      attempts.forEach(attempt => {
        if (groupFilter && attempt.group !== groupFilter) return;
        const student = attempt.studentId as any;

        const answers = round === 1 ? attempt.round1?.answers : attempt.round2?.answers;
        const ans = answers?.find((a: any) => a.wordId?.toString() === wordId);

        responses.push({
          studentId: student?._id?.toString() ?? '',
          fullName: student?.fullName ?? 'Unknown',
          registrationNumber: student?.registrationNumber ?? '—',
          schoolName: student?.schoolName ?? '—',
          grade: student?.grade ?? 0,
          submittedAnswer: ans?.submittedAnswer ?? '',
          isCorrect: ans?.isCorrect ?? false,
          timeTakenMs: ans?.timeTakenMs ?? 0,
          lifeUsed: ans?.lifeUsed,
          clueType: ans?.clueType,
        });
      });

      const correct = responses.filter(r => r.isCorrect).length;
      const wrong   = responses.filter(r => !r.isCorrect && r.submittedAnswer !== '').length;
      const blank   = responses.filter(r => r.submittedAnswer === '').length;
      const total   = responses.length;
      const avgTime = total > 0
        ? responses.reduce((s, r) => s + r.timeTakenMs, 0) / total
        : 0;

      return {
        wordId,
        round,
        // ─── FULL WORD DATA ──────────────────────────────────────────────────
        targetWord:        (word as any).targetWord,
        group:             (word as any).group,
        partOfSpeech:      (word as any).partOfSpeech,
        definition:        (word as any).definition,
        exampleSentence1:  (word as any).exampleSentence1,
        exampleSentence2:  (word as any).exampleSentence2,
        situationalPrompt: (word as any).situationalPrompt,
        formalSynonym:     (word as any).formalSynonym,
        millennialCrossRef:(word as any).millennialCrossRef,
        pronunciation:     (word as any).pronunciation,
        stressPattern:     (word as any).stressPattern,
        difficultyScore:   (word as any).difficultyScore,
        category:          (word as any).category,
        audioUrlHighQuality: (word as any).audioUrlHighQuality,
        // ─── LIVE STATS ──────────────────────────────────────────────────────
        stats: {
          total, correct, wrong, blank,
          correctPct: total > 0 ? Math.round((correct / total) * 100) : 0,
          avgTimeSec: Math.round(avgTime / 1000),
        },
        // ─── PER-STUDENT RESPONSES ───────────────────────────────────────────
        responses: responses.sort((a, b) =>
          a.isCorrect === b.isCorrect ? 0 : a.isCorrect ? -1 : 1
        ),
      };
    }).filter(Boolean);

    // Session summary
    const sessionSummary = {
      title: (session as any).title,
      status: (session as any).status,
      totalWords: masterKey.length,
      totalStudents: attempts.length,
      round1Words: [...round1WordIds].length,
      round2Words: [...round2WordIds].length,
      hardestWords: [...masterKey]
        .sort((a: any, b: any) => a.stats.correctPct - b.stats.correctPct)
        .slice(0, 3)
        .map((w: any) => ({ word: w.targetWord, correctPct: w.stats.correctPct })),
      easiestWords: [...masterKey]
        .sort((a: any, b: any) => b.stats.correctPct - a.stats.correctPct)
        .slice(0, 3)
        .map((w: any) => ({ word: w.targetWord, correctPct: w.stats.correctPct })),
    };

    return NextResponse.json({ masterKey, sessionSummary });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const GET = withPermission('answer_key:read_all', handler);
