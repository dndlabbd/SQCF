import prisma from '@/api/prismaClient';

export async function GET() {
  try {
    const illustrations = await prisma.illustrationCard.findMany();
    return new Response(JSON.stringify(illustrations), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to fetch arts:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch illustrations' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}