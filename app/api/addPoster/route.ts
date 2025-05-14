import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/api/prismaClient';

const POST = async (req: Request, res: NextApiResponse) => {
    let body = await req.json()
    try {
        const poster = await prisma.poster.create({
          data: {
            title: body.title,
            imageUrl: body.imageUrl,
            category: body.category,
            year: body.year,
            year_Bangla: body.year_Bangla,
            for_whom: body.for_whom,
            measurement: body.measurement,
            measurement_Bangla: body.measurement_Bangla,
            tags: body.tags,
            tags_Bangla: body.tags_Bangla,
          },
        });

        console.log(poster);

        return new Response("Poster successfully recorded", {
          status: 200
      })

    } catch (error) {
        console.error("Failed to add poster:", error);
        return new Response("Poster not recorded", {
          status: 500
      })
    }
}

export {POST};