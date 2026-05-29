// app/api/admin/master-key/[sessionId]/export/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { withPermission } from '@/lib/rbac';
import { Session } from '@/models/Session';
import { WordBank } from '@/models/WordBank';
import { Attempt } from '@/models/Attempt';
import React from 'react';
import ReactPDF, { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Helper to escape CSV fields
function escapeCSV(str: string | undefined | null): string {
  if (!str) return '""';
  return `"${String(str).replace(/"/g, '""')}"`;
}

// React-PDF Document Component styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#333333',
    backgroundColor: '#ffffff',
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: '#fbbf24',
    paddingBottom: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 4,
    marginTop: 10,
  },
  statCell: {
    fontSize: 9,
    color: '#334155',
  },
  wordContainer: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  wordText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  wordMeta: {
    fontSize: 9,
    color: '#7c3aed',
    fontWeight: 'bold',
  },
  fieldBlock: {
    marginTop: 4,
    marginBottom: 2,
  },
  fieldLabel: {
    fontWeight: 'bold',
    color: '#475569',
  },
  fieldValue: {
    color: '#0f172a',
    lineHeight: 1.3,
  },
  cluesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    backgroundColor: '#fafafa',
    padding: 6,
    borderRadius: 2,
  },
  clueCol: {
    flex: 1,
    marginRight: 10,
  },
  wordStats: {
    marginTop: 6,
    flexDirection: 'row',
    color: '#475569',
    fontSize: 8,
  },
});

interface PDFProps {
  sessionTitle: string;
  masterKey: any[];
}

const MasterKeyPDFDocument = ({ sessionTitle, masterKey }: PDFProps) => {
  return React.createElement(Document, {}, 
    React.createElement(Page, { size: 'A4', style: styles.page },
      // Header
      React.createElement(View, { style: styles.header },
        React.createElement(Text, { style: styles.title }, 'Modern Bee Master Answer Key'),
        React.createElement(Text, { style: styles.subtitle }, `Session: ${sessionTitle} | Generated: ${new Date().toLocaleDateString()}`),
        React.createElement(View, { style: styles.statsRow },
          React.createElement(Text, { style: styles.statCell }, `Total Words: ${masterKey.length}`),
          React.createElement(Text, { style: styles.statCell }, `Round 1 Words: ${masterKey.filter((w: any) => w.round === 1).length}`),
          React.createElement(Text, { style: styles.statCell }, `Round 2 Words: ${masterKey.filter((w: any) => w.round === 2).length}`)
        )
      ),
      // Words List
      ...masterKey.map((entry: any, idx: number) => 
        React.createElement(View, { key: entry.wordId, style: styles.wordContainer, wrap: false },
          React.createElement(View, { style: styles.wordHeader },
            React.createElement(Text, { style: styles.wordText }, `${idx + 1}. ${entry.targetWord}`),
            React.createElement(Text, { style: styles.wordMeta }, `[${entry.partOfSpeech}] [Round ${entry.round}] [${entry.group}]`)
          ),
          React.createElement(View, { style: styles.fieldBlock },
            React.createElement(Text, { style: styles.fieldValue },
              React.createElement(Text, { style: styles.fieldLabel }, 'Definition: '),
              entry.definition
            )
          ),
          React.createElement(View, { style: styles.fieldBlock },
            React.createElement(Text, { style: styles.fieldValue },
              React.createElement(Text, { style: styles.fieldLabel }, 'Example 1: '),
              `"${entry.exampleSentence1}"`
            )
          ),
          React.createElement(View, { style: styles.fieldBlock },
            React.createElement(Text, { style: styles.fieldValue },
              React.createElement(Text, { style: styles.fieldLabel }, 'Example 2: '),
              `"${entry.exampleSentence2}"`
            )
          ),
          React.createElement(View, { style: styles.cluesGrid },
            React.createElement(View, { style: styles.clueCol },
              React.createElement(Text, { style: styles.fieldLabel }, 'Situational Prompt'),
              React.createElement(Text, { style: { fontSize: 8, color: '#0f172a' } }, entry.situationalPrompt)
            ),
            React.createElement(View, { style: styles.clueCol },
              React.createElement(Text, { style: styles.fieldLabel }, 'Synonym'),
              React.createElement(Text, { style: { fontSize: 8, color: '#0f172a' } }, entry.formalSynonym)
            ),
            React.createElement(View, { style: styles.clueCol },
              React.createElement(Text, { style: styles.fieldLabel }, 'Millennial Cross-ref'),
              React.createElement(Text, { style: { fontSize: 8, color: '#0f172a' } }, entry.millennialCrossRef)
            )
          ),
          React.createElement(View, { style: styles.wordStats },
            React.createElement(Text, { style: { marginRight: 15 } }, `Difficulty: ${entry.difficultyScore}/10`),
            React.createElement(Text, { style: { marginRight: 15 } }, `Accuracy: ${entry.stats.correctPct}%`),
            React.createElement(Text, {}, `Correct: ${entry.stats.correct} | Wrong: ${entry.stats.wrong} | Blank: ${entry.stats.blank}`)
          )
        )
      )
    )
  );
};

async function handler(req: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'csv';

    const session = await Session.findById(params.sessionId).lean();
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    // Collect all unique word IDs
    const round1WordIds = new Set<string>();
    const round2WordIds = new Set<string>();
    (session as any).wordAssignments?.forEach((a: any) => {
      a.round1Words?.forEach((id: any) => round1WordIds.add(id.toString()));
      a.round2Words?.forEach((id: any) => round2WordIds.add(id.toString()));
    });

    const allWordIds = Array.from(new Set([...round1WordIds, ...round2WordIds]));

    const words = await WordBank.find({ _id: { $in: allWordIds } }).lean();
    const attempts = await Attempt.find({ sessionId: params.sessionId }).lean();
    const wordMap = new Map(words.map(w => [w._id.toString(), w]));

    const masterKeyData = allWordIds.map(wordId => {
      const word = wordMap.get(wordId);
      if (!word) return null;

      const isRound1 = round1WordIds.has(wordId);
      const round = isRound1 ? 1 : 2;

      const responses: any[] = [];
      attempts.forEach(attempt => {
        const answers = round === 1 ? attempt.round1?.answers : attempt.round2?.answers;
        const ans = answers?.find((a: any) => a.wordId?.toString() === wordId);
        responses.push({
          submittedAnswer: ans?.submittedAnswer ?? '',
          isCorrect: ans?.isCorrect ?? false,
        });
      });

      const correct = responses.filter(r => r.isCorrect).length;
      const wrong = responses.filter(r => !r.isCorrect && r.submittedAnswer !== '').length;
      const blank = responses.filter(r => r.submittedAnswer === '').length;
      const total = responses.length;

      return {
        wordId,
        round,
        targetWord: (word as any).targetWord,
        group: (word as any).group,
        partOfSpeech: (word as any).partOfSpeech || 'noun',
        definition: (word as any).definition,
        exampleSentence1: (word as any).exampleSentence1,
        exampleSentence2: (word as any).exampleSentence2,
        situationalPrompt: (word as any).situationalPrompt,
        formalSynonym: (word as any).formalSynonym,
        millennialCrossRef: (word as any).millennialCrossRef,
        difficultyScore: (word as any).difficultyScore,
        stats: {
          total, correct, wrong, blank,
          correctPct: total > 0 ? Math.round((correct / total) * 100) : 0,
        }
      };
    }).filter(Boolean);

    // CSV format handler
    if (format === 'csv') {
      const csvHeaders = [
        'Word', 'Round', 'Group', 'Part of Speech', 'Definition',
        'Example Sentence 1', 'Example Sentence 2', 'Situational Clue',
        'Formal Synonym', 'Millennial Cross-ref', 'Difficulty',
        'Attempts Count', 'Correct', 'Wrong', 'Blank', 'Accuracy (%)'
      ];

      const csvRows = masterKeyData.map((w: any) => [
        escapeCSV(w.targetWord),
        w.round,
        escapeCSV(w.group),
        escapeCSV(w.partOfSpeech),
        escapeCSV(w.definition),
        escapeCSV(w.exampleSentence1),
        escapeCSV(w.exampleSentence2),
        escapeCSV(w.situationalPrompt),
        escapeCSV(w.formalSynonym),
        escapeCSV(w.millennialCrossRef),
        w.difficultyScore,
        w.stats.total,
        w.stats.correct,
        w.stats.wrong,
        w.stats.blank,
        w.stats.correctPct
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.join(','))
      ].join('\n');

      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="master-key-${params.sessionId}.csv"`,
        },
      });
    }

    // PDF format handler
    if (format === 'pdf') {
      const doc = React.createElement(MasterKeyPDFDocument, { sessionTitle: (session as any).title, masterKey: masterKeyData }) as any;
      const buffer = await ReactPDF.renderToBuffer(doc);

      return new Response(buffer as any, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="master-key-${params.sessionId}.pdf"`,
        },
      });
    }

    return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const GET = withPermission('answer_key:read_all', handler);
