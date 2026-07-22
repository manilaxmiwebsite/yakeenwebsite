import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Admin } from '@/lib/models/Admin';
import bcrypt from 'bcryptjs';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentEmail, newEmail, password } = await request.json();

    if (!currentEmail || !newEmail || !password) {
      return NextResponse.json({ error: 'Current email, new email, and password are required' }, { status: 400 });
    }

    if (!newEmail.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    await connectDB();

    // Verify current email matches session
    if (session.user?.email !== currentEmail) {
      return NextResponse.json({ error: 'Current email does not match your account' }, { status: 400 });
    }

    // Verify password
    const admin = await Admin.findOne({ email: currentEmail });
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Password is incorrect' }, { status: 400 });
    }

    // Check if new email is already taken
    const existingAdmin = await Admin.findOne({ email: newEmail });
    if (existingAdmin && existingAdmin.email !== currentEmail) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    // Update email
    admin.email = newEmail;
    await admin.save();

    return NextResponse.json({
      message: 'Email updated successfully. Please sign in again with your new email.',
      newEmail,
    });
  } catch (error) {
    console.error('Error updating email:', error);
    return NextResponse.json({ error: 'Failed to update email' }, { status: 500 });
  }
}
