import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Admin } from '@/lib/models/Admin';
import bcrypt from 'bcryptjs';

// Force-reset the admin account with known credentials
export async function GET() {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL || 'admin@manilakshmi.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin@123';
    const hashedPassword = await bcrypt.hash(password, 12);

    // Delete existing admin and recreate
    await Admin.deleteOne({ email });
    const admin = await Admin.create({
      email,
      password: hashedPassword,
    });

    // Verify the password works
    const verifyAdmin = await Admin.findOne({ email });
    const passwordValid = await bcrypt.compare(password, verifyAdmin!.password);

    return NextResponse.json({
      message: 'Admin reset successfully',
      email,
      password,
      passwordValid,
      adminId: admin._id.toString(),
    });
  } catch (error) {
    console.error('Error resetting admin:', error);
    return NextResponse.json({
      error: 'Failed to reset admin: ' + (error as Error).message,
    }, { status: 500 });
  }
}
