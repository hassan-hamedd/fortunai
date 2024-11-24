import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { lastUpdated: 'desc' },
    });
    return NextResponse.json(clients);
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const client = await prisma.client.create({
      data: {
        ...data,
        lastUpdated: new Date(),
      },
    });
    return NextResponse.json(client);
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}