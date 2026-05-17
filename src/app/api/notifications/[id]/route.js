import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Notification from '@/models/Notification';
import { auth } from '@/lib/auth';

export async function PATCH(request, context) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;
  try {
    await connectDB();
    await Notification.findOneAndUpdate(
      { _id: id, recipient: session.user.id },
      { isRead: true, readAt: new Date() }
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
