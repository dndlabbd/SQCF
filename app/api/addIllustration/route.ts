import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/api/prismaClient';

const POST = async (req: Request, res: NextApiResponse) => {
    let item = await req.json()
    try {
        const illustration = await prisma.illustrationCard.create({
          data: {
            title: item.title,
            subtitle: item.subtitle,
            publisher: item.publisher,
            year: item.year,
            year_Bangla: item.year_Bangla,
            imageUrl: item.imageUrl,
            tags: item.tags,
            tags_Bangla: item.tags_Bangla,
          },
        });

        console.log(illustration);

        return new Response("Illustration successfully recorded", {
          status: 200
      })

    } catch (error) {
        console.error("Failed to add Illustration:", error);
        return new Response("Illustration not recorded", {
          status: 500
      })
    }
}

export {POST};