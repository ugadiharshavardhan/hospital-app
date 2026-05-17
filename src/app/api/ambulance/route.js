import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import AmbulanceRequest from '@/models/AmbulanceRequest';

export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();
    const req = await AmbulanceRequest.create(body);
    return NextResponse.json({ data: req, message: 'Ambulance dispatched! ETA: 8-12 minutes.' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 });
  }
}
