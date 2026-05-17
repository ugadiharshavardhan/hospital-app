import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { auth } from '@/lib/auth';

export async function POST(request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    const folder = formData.get('folder') || 'hospital';
    const result = await uploadImage(file, folder);
    return NextResponse.json({ url: result.url, publicId: result.publicId });
  } catch (err) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
