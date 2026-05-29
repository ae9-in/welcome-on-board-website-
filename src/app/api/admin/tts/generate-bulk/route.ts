// app/api/admin/tts/generate-bulk/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Session } from '@/models/Session';
import { WordBank } from '@/models/WordBank';
import { withPermission } from '@/lib/rbac';

async function handler(req: NextRequest) {
  try {
    await connectDB();
    const { sessionId } = await req.json() as { sessionId: string };

    const session = await Session.findById(sessionId);
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    // Collect all word IDs assigned in this session
    const allWordIds = new Set<string>();
    session.wordAssignments?.forEach((a: any) => {
      a.round1Words?.forEach((id: any) => allWordIds.add(id.toString()));
      a.round2Words?.forEach((id: any) => allWordIds.add(id.toString()));
    });

    // Find words that don't yet have high-quality audio
    const words = await WordBank.find({
      _id: { $in: [...allWordIds] },
      $or: [
        { audioUrlHighQuality: { $exists: false } },
        { audioUrlHighQuality: '' },
      ],
    }).select('_id targetWord');

    const results: { wordId: string; targetWord: string; status: string }[] = [];
    const origin = req.nextUrl.origin;

    // Generate audio for each — rate limited to 3 concurrent
    const generateOne = async (wordId: string) => {
      const res = await fetch(`${origin}/api/admin/tts/generate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          cookie: req.headers.get('cookie') ?? '' 
        },
        body: JSON.stringify({ wordId }),
      });
      return res.json();
    };

    // Process in batches of 3 (respect ElevenLabs rate limits)
    for (let i = 0; i < words.length; i += 3) {
      const batch = words.slice(i, i + 3);
      const batchResults = await Promise.all(
        batch.map(w => generateOne(w._id.toString())
          .then(r => ({ 
            wordId: w._id.toString(), 
            targetWord: w.targetWord, 
            status: r.success ? 'done' : 'error' 
          }))
          .catch(() => ({ 
            wordId: w._id.toString(), 
            targetWord: w.targetWord, 
            status: 'error' 
          }))
        )
      );
      results.push(...batchResults);
    }

    return NextResponse.json({
      total: words.length,
      results,
      alreadyHadAudio: allWordIds.size - words.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const POST = withPermission('word_bank:write', handler);
