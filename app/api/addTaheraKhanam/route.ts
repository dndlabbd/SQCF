import { NextResponse } from 'next/server';
import prisma from '#root/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const taheraKhanam = await prisma.taheraArt.create({
      data: body
    });
    return NextResponse.json(taheraKhanam);
  } catch (error) {
    console.error('Failed to add Tahera Khanam:', error);
    return NextResponse.json(
      { error: 'Failed to add Tahera Khanam' },
      { status: 500 }
    );
  }
}
