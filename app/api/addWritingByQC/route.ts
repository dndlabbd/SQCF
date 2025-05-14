import type { NextApiResponse } from 'next';
import prisma from '@/api/prismaClient';

const POST = async (req: Request, res: NextApiResponse) => {
    let body = await req.json()
    try {
        const WBQC = await prisma.writingByQC.create({
          data: {
            title: body.title,
            subtitle: body.subtitle,
            publisher: body.publisher,
            link: body.link,
            category: body.category, //Poem, Prose etc.
            date: body.date,
            date_Bangla: body.date_Bangla,
            text: body.text,
            imageUrl: body.imageUrl,
            imageAlt: body.imageAlt,
            tags: body.tags,
            tags_Bangla: body.tags_Bangla,
          },
        });

        console.log(WBQC);

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