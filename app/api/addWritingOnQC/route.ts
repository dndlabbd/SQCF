import type { NextApiResponse } from 'next';
import prisma from '@/api/prismaClient';

const POST = async (req: Request, res: NextApiResponse) => {
    let body = await req.json()
    try {
        const WOQC = await prisma.writingOnQC.create({
          data: {
            title: body.title,
            subtitle: body.subtitle,
            publisher: body.publisher,
            author: body.author,
            link: body.link,
            date: body.date,
            date_Bangla: body.date_Bangla,
            text: body.text,
            imageUrl: body.imageUrl,
            imageAlt: body.imageAlt,
            tags: body.tags,
            tags_Bangla: body.tags_Bangla,
          },
        });

        console.log(WOQC);

        return new Response("Writing successfully recorded", {
          status: 200
      })

    } catch (error) {
        console.error("Failed to add Writing:", error);
        return new Response("Writing not recorded", {
          status: 500
      })
    }
}

export {POST};