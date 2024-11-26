import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { lastUpdated: 'desc' },
      include: { status: true },
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

    // Check if the statusId exists in the Status table
    const statusExists = await prisma.status.findUnique({
      where: { id: data.statusId },
    });

    if (!statusExists) {
      return NextResponse.json({ error: 'Invalid statusId' }, { status: 400 });
    }

    const client = await prisma.client.create({
      data: {
        ...data,
        lastUpdated: new Date(),
      },
    });
    return NextResponse.json(client);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}