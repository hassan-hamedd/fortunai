import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // First try to find an existing trial balance
    let trialBalance = await prisma.trialBalance.findFirst({
      where: { clientId: params.id },
      include: {
        accounts: {
          include: {
            transactions: true,
            taxCategory: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // If no trial balance exists, create a new one
    if (!trialBalance) {
      const currentDate = new Date();
      const startOfYear = new Date(currentDate.getFullYear(), 0, 1); // January 1st of current year
      const endOfYear = new Date(currentDate.getFullYear(), 11, 31); // December 31st of current year

      trialBalance = await prisma.trialBalance.create({
        data: {
          clientId: params.id,
          startDate: startOfYear,
          endDate: endOfYear,
          accounts: {
            create: [] // Start with no accounts
          }
        },
        include: {
          accounts: {
            include: {
              transactions: true,
              taxCategory: true,
            },
          },
        },
      });
    }

    return NextResponse.json(trialBalance);
  } catch (error) {
    console.error('Trial balance error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch or create trial balance' },
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