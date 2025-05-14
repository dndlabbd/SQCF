import prisma from '@/api/prismaClient';

export async function GET() {
  try {
    const writing = await prisma.writingOnQC.findMany();
    return new Response(JSON.stringify(writing), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to fetch arts:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch writings' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}