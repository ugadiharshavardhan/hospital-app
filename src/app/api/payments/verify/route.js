import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/db';
import Payment from '@/models/Payment';
import Appointment from '@/models/Appointment';
import Notification from '@/models/Notification';
import { auth } from '@/lib/auth';

export async function POST(request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } =
      await request.json();

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    await connectDB();

    // Update payment record
    const payment = await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        status: 'success',
        transactionId: razorpay_payment_id,
        paidAt: new Date(),
      },
      { new: true }
    );

    // Update appointment payment status
    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, {
        paymentStatus: 'paid',
        paymentId: payment?._id,
      });
    }

    // Send notification
    await Notification.create({
      recipient: session.user.id,
      title: 'Payment Successful',
      message: `Payment of ₹${payment?.amount || ''} completed successfully. Transaction ID: ${razorpay_payment_id}`,
      type: 'payment',
      link: '/patient/payments',
    });

    return NextResponse.json({
      success: true,
      paymentId: razorpay_payment_id,
      message: 'Payment verified successfully',
    });
  } catch (err) {
    console.error('Verify payment error:', err);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
