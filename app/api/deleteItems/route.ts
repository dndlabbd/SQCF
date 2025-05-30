import { NextResponse } from 'next/server';
import prisma from '#root/lib/prisma';

export async function POST(request: Request) {
  try {
    const { ids, type } = await request.json();

    switch (type) {
      case 'art':
        await prisma.art.deleteMany({
          where: { id: { in: ids } }
        });
        break;
      case 'bookCover':
        await prisma.bookCover.deleteMany({
          where: { id: { in: ids } }
        });
        break;
      case 'poster':
        await prisma.poster.deleteMany({
          where: { id: { in: ids } }
        });
        break;
      case 'illustration':
        await prisma.illustrationCard.deleteMany({
          where: { id: { in: ids } }
        });
        break;
      default:
        throw new Error('Invalid type');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete operation failed:', error);
    return NextResponse.json(
      { error: 'Failed to delete items' },
      { status: 500 }
    );
  }
}
