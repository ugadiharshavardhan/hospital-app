import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { connectDB } from '@/lib/db';
import Payment from '@/models/Payment';
import { auth } from '@/lib/auth';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { amount, appointmentId, currency = 'INR' } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const receipt = `rcpt_${Date.now()}`;

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency,
      receipt,
      notes: { appointmentId: appointmentId || '', patientId: session.user.id },
    });

    await connectDB();
    await Payment.create({
      appointmentId: appointmentId || undefined,
      patientId: session.user.id,
      amount,
      currency,
      method: 'razorpay',
      status: 'pending',
      orderId: order.id,
      receipt,
      invoiceNumber: `INV-${Date.now()}`,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Create order error:', err);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
