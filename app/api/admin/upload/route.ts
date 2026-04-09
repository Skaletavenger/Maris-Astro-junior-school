export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'image' or 'document'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Sanitize filename
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const timestamp = Date.now();
    const filename = `${timestamp}-${sanitizedName}`;

    // Determine path based on type
    const folder = type === 'document' ? 'documents' : 'gallery';
    const path = `public/${folder}/${filename}`;

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    // GitHub API details
    const repo = 'Skaletavenger/Maris-Astro-junior-school';
    const url = `https://api.github.com/repos/${repo}/contents/${path}`;
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 });
    }

    // Upload to GitHub
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Add ${filename}`,
        content: base64,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: `GitHub upload failed: ${error}` }, { status: response.status });
    }

    // Get the raw URL
    const rawUrl = `https://raw.githubusercontent.com/${repo}/main/${path}`;

    // Save to database based on type
    if (type === 'document') {
      const document = await prisma.schoolDocument.create({
        data: {
          url: rawUrl,
          name: file.name,
        },
      });
      return NextResponse.json({
        success: true,
        url: rawUrl,
        id: document.id,
        type: 'document',
      });
    } else {
      const galleryImage = await prisma.galleryImage.create({
        data: {
          url: rawUrl,
          name: file.name,
        },
      });
      return NextResponse.json({
        success: true,
        url: rawUrl,
        id: galleryImage.id,
        type: 'image',
      });
    }

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}