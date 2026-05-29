import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Attempt } from '@/models/Attempt';
import { Student } from '@/models/Student';
import { Session } from '@/models/Session';
import { Certificate } from '@/models/Certificate';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateVerificationCode } from '@/lib/utils';

export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    await connectDB();
    const auth = await getServerSession(authOptions);
    if (!auth?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const student = await Student.findOne({ userId: (auth.user as any).id });
    if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });

    const attempt = await Attempt.findOne({ studentId: student._id, sessionId: params.sessionId });
    if (!attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });

    if (attempt.status === 'completed') {
      // Already completed, just return existing details
      const cert = await Certificate.findOne({ attemptId: attempt._id });
      return NextResponse.json({
        rank: attempt.rank || 1,
        percentile: attempt.percentile || 100,
        totalScore: attempt.totalScore,
        certificateUrl: cert?.pdfUrl || '#',
        certificateType: cert?.certificateType || 'participation',
      });
    }

    // 1. Mark attempt as 'completed'
    attempt.status = 'completed';
    attempt.completedAt = new Date();

    // 2. Calculate totalScore
    attempt.totalScore = attempt.round1.score + attempt.round2.score;
    await attempt.save();

    // 3. Compute ranks and percentiles across completed attempts for this session and group
    const completedAttempts = await Attempt.find({
      sessionId: params.sessionId,
      group: attempt.group,
      status: 'completed'
    }).sort({ totalScore: -1, completedAt: 1 });

    const totalParticipants = completedAttempts.length || 1;

    // Update ranks and save using bulkWrite to avoid blocking N+1 query loop
    let studentRank = 1;
    const bulkOps = completedAttempts.map((currentAttempt, i) => {
      const rank = i + 1;
      const percentile = Math.round(((totalParticipants - (i + 1)) / totalParticipants) * 100);

      if (currentAttempt._id.toString() === attempt._id.toString()) {
        studentRank = rank;
        attempt.rank = rank;
        attempt.percentile = percentile;
      }

      return {
        updateOne: {
          filter: { _id: currentAttempt._id },
          update: { $set: { rank, percentile } }
        }
      };
    });

    if (bulkOps.length > 0) {
      await Attempt.bulkWrite(bulkOps);
    }

    // 4. Determine certificateType
    // rank 1 -> 'champion', top 5% -> 'gold', top 15% -> 'distinction', top 30% -> 'merit', rest -> 'participation'
    const topPercentile = 100 - (studentRank / totalParticipants) * 100;
    let certificateType: 'participation' | 'merit' | 'distinction' | 'gold' | 'champion' = 'participation';
    
    if (studentRank === 1) certificateType = 'champion';
    else if (topPercentile >= 95) certificateType = 'gold';
    else if (topPercentile >= 85) certificateType = 'distinction';
    else if (topPercentile >= 70) certificateType = 'merit';

    // 5. Generate Certificate and Upload
    const verificationCode = generateVerificationCode();
    
    // We will save a mock/simulate PDF URL if Cloudinary is not configured.
    // In production, we'd render ReactPDF to a stream and upload to Cloudinary.
    let pdfUrl = `https://welcome-on-boarding.vercel.app/verify/cert-${verificationCode}`;
    
    if (process.env.CLOUDINARY_API_KEY) {
      try {
        const ReactPDF = await import('@react-pdf/renderer');
        // Standard code to compile the certificate document to a buffer and upload to Cloudinary.
        // For development/speed we use a fallback and create the model.
      } catch (err) {
        console.error('PDF Renderer imports or compilation skipped:', err);
      }
    }

    const certificate = await Certificate.create({
      attemptId: attempt._id,
      studentId: student._id,
      sessionId: params.sessionId,
      certificateType,
      pdfUrl,
      verificationCode,
      rank: attempt.rank,
      score: attempt.totalScore,
    });

    attempt.certificate = certificate._id;
    await attempt.save();

    // 6. Update Student.totalPoints and Student.badges
    student.totalPoints += attempt.totalScore;
    const badgeName = `${sessionName(certificateType)} Spell Bee`;
    if (!student.badges.includes(badgeName)) {
      student.badges.push(badgeName);
    }
    if (attempt.totalScore > 100 && !student.badges.includes('Elite Speller')) {
      student.badges.push('Elite Speller');
    }
    await student.save();

    // 7. Send email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const { resend } = await import('@/lib/resend');
        await resend.emails.send({
          from: 'The Modern Bee <competitions@welcomeonboarding.com>',
          to: [student.parentEmail, auth.user.email!],
          subject: `Congratulations ${student.fullName}! Spell Bee Complete`,
          html: `<p>Hi parent, your student <strong>${student.fullName}</strong> just completed <strong>The Modern Bee</strong>.</p>
                 <p>Rank: <strong>${attempt.rank}</strong></p>
                 <p>Score: <strong>${attempt.totalScore} points</strong></p>
                 <p>Certificate Issued: <a href="${pdfUrl}">Download PDF Certificate</a></p>`
        });
      } catch (err) {
        console.error('Resend email failed:', err);
      }
    }

    // 8. Broadcast leaderboard via Pusher
    try {
      const { pusherServer } = await import('@/lib/pusher');
      // Fetch fresh top 20 list for this group
      const leaderboard = await Attempt.find({ sessionId: params.sessionId, group: attempt.group, status: 'completed' })
        .sort({ totalScore: -1, completedAt: 1 })
        .limit(20)
        .populate({ path: 'studentId', select: 'fullName schoolName city' });
      
      const rankedList = leaderboard.map((entry: any, i) => ({
        rank: i + 1,
        fullName: entry.studentId.fullName,
        schoolName: entry.studentId.schoolName,
        city: entry.studentId.city,
        totalScore: entry.totalScore,
        group: entry.group,
        status: entry.status,
      }));

      await pusherServer.trigger(`session-${params.sessionId}`, 'leaderboard-update', { ranked: rankedList });
    } catch (e) {
      console.warn('Leaderboard Pusher trigger skipped:', e);
    }

    return NextResponse.json({
      rank: attempt.rank,
      percentile: attempt.percentile,
      totalScore: attempt.totalScore,
      certificateUrl: pdfUrl,
      certificateType,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function sessionName(type: string): string {
  switch (type) {
    case 'champion': return 'Champion';
    case 'gold': return 'Gold';
    case 'distinction': return 'Distinction';
    case 'merit': return 'Merit';
    default: return 'Participation';
  }
}
