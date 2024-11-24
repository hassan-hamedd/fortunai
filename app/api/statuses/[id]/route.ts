import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const status = await prisma.status.update({
      where: { id: params.id },
      data: {
        title: data.title,
      },
    });
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.status.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'Status deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete status' }, { status: 500 });
  }
} 