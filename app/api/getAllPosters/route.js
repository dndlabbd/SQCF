import prisma from '@/api/prismaClient';

export async function GET() {
  try {
    const posters = await prisma.poster.findMany();
    return new Response(JSON.stringify(posters), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to fetch arts:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch posters' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}