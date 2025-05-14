import prisma from '@/api/prismaClient';

export async function GET() {
  try {
    const arts = await prisma.art.findMany();
    return new Response(JSON.stringify(arts), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to fetch arts:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch artworks' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}