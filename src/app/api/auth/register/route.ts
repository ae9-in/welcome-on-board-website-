// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Student } from '@/models/Student';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password, grade, schoolName, city, parentEmail, parentPhone } = body;

    if (!name || !email || !password || !grade || !schoolName || !city || !parentEmail || !parentPhone) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check duplicate email
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    // Map grade to target division group
    // Grade 1-3 -> group1
    // Grade 4-7 -> group2
    // Grade 8-11 -> group3
    const gradeNum = parseInt(grade, 10);
    let group = 'group2';
    if (gradeNum >= 1 && gradeNum <= 3) group = 'group1';
    else if (gradeNum >= 4 && gradeNum <= 7) group = 'group2';
    else if (gradeNum >= 8 && gradeNum <= 11) group = 'group3';

    // Start session transaction (if database supports, or run sequentially)
    // Create student and user
    const userId = new mongoose.Types.ObjectId();
    const studentProfileId = new mongoose.Types.ObjectId();

    const studentProfile = await Student.create({
      _id: studentProfileId,
      userId: userId,
      fullName: name,
      grade: gradeNum,
      group: group,
      schoolName: schoolName,
      city: city,
      parentEmail: parentEmail,
      parentPhone: parentPhone,
      dateOfBirth: new Date(), // fallback
      totalPoints: 0,
      badges: [],
    });

    const newUser = await User.create({
      _id: userId,
      name: name,
      email: email.toLowerCase(),
      passwordHash: password, // will be auto-hashed by User model pre-save hook
      role: 'student',
      isActive: true,
      isEmailVerified: true,
      studentProfile: studentProfileId,
    });

    return NextResponse.json({
      success: true,
      userId: newUser._id,
      studentId: studentProfile._id,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
