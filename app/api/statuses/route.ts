import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const statuses = await prisma.status.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(statuses);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch statuses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const status = await prisma.status.create({
      data: {
        title: data.title,
      },
    });
    return NextResponse.json(status);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create status' }, { status: 500 });
  }
}