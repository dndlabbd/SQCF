import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/api/prismaClient';

const POST = async (req: Request, res: NextApiResponse) => {
    let body = await req.json()
    try {
        // console.log("FROM ROUTE", body)
        const art = await prisma.art.create({
          data: {
            title: body.title.toUpperCase(),
            title_Bangla: body.title_Bangla,
            year: body.year,
            year_Bangla: body.year_Bangla,
            type: body.type,
            description: body.description,
            measurement: body.measurement,
            measurement_Bangla: body.measurement_Bangla,
            medium: body.medium,
            medium_Bangla: body.medium_Bangla,
            publication: body.publication,
            imageUrl: body.imageUrl,
            tags: body.tags,
            tags_Bangla: body.tags_Bangla,
          },
        });

        console.log("Response:", art);

        return new Response("Artwork successfully recorded", {
          status: 200
      })

    } catch (error) {
        console.error("Failed to add art:", error);
        return new Response("Artwork not recorded", {
          status: 500
      })
    }
}

export {POST};