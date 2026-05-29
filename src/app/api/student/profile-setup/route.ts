// app/api/student/profile-setup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Student } from '@/models/Student';
import { User } from '@/models/User';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { grade, schoolName, city, parentEmail, parentPhone } = body;

    if (!grade || !schoolName || !city || !parentEmail || !parentPhone) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Map grade to target division group
    const gradeNum = parseInt(grade, 10);
    let group = 'group2';
    if (gradeNum >= 1 && gradeNum <= 3) group = 'group1';
    else if (gradeNum >= 4 && gradeNum <= 7) group = 'group2';
    else if (gradeNum >= 8 && gradeNum <= 11) group = 'group3';

    // Check if profile already exists
    let studentProfile = await Student.findOne({ userId: (session?.user as any).id });
    if (studentProfile) {
      return NextResponse.json({ error: 'Profile already setup' }, { status: 400 });
    }

    const studentProfileId = new mongoose.Types.ObjectId();
    studentProfile = await Student.create({
      _id: studentProfileId,
      userId: (session?.user as any).id,
      fullName: session?.user?.name || 'Student Challenger',
      grade: gradeNum,
      group: group,
      schoolName: schoolName,
      city: city,
      parentEmail: parentEmail,
      parentPhone: parentPhone,
      dateOfBirth: new Date(),
      totalPoints: 0,
      badges: [],
    });

    await User.findByIdAndUpdate((session?.user as any).id, {
      studentProfile: studentProfileId,
    });

    return NextResponse.json({
      success: true,
      studentId: studentProfileId.toString(),
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
