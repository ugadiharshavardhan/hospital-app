import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Department from '@/models/Department';

export async function GET() {
  try {
    await connectDB();
    const departments = await Department.find({ isActive: true }).sort({ order: 1 }).lean();
    return NextResponse.json({ data: departments });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 });
  }
}
