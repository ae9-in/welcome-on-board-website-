// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      // Generate password reset token, save reset fields
      const resetToken = user.generatePasswordResetToken();
      await user.save();
      
      // In production, we would email this to the user.
      // For development, we print to console.
      console.log(`🔑 PASSWORD RESET TOKEN FOR ${email}: ${resetToken}`);
      console.log(`🔗 Link: http://localhost:3000/reset-password/${resetToken}`);
    }

    // Always return success to prevent email enumeration attacks
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
