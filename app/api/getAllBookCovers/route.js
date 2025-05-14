import prisma from '@/api/prismaClient';

export async function GET() {
  try {
    const bookCovers = await prisma.bookCover.findMany();
    return new Response(JSON.stringify(bookCovers), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to fetch arts:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch book covers' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}