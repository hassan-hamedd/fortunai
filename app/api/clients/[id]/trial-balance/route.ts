import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const trialBalances = await prisma.trialBalance.findMany({
      where: { clientId: params.id },
      include: {
        accounts: {
          include: {
            transactions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(trialBalances);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch trial balances' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const trialBalance = await prisma.trialBalance.create({
      data: {
        ...data,
        clientId: params.id,
      },
      include: {
        accounts: true,
      },
    });
    return NextResponse.json(trialBalance);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create trial balance' },
      { status: 500 }
    );
  }
}