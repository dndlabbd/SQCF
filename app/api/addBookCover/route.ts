import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/api/prismaClient';

const POST = async (req: Request, res: NextApiResponse) => {
    let body = await req.json()
    try {
        // console.log("FROM ROUTE", body)
        const bookcover = await prisma.bookCover.create({
          data: {
            title: body.title,
            author: body.author,
            publisher: body.publisher,
            date: body.date,
            imageUrl: body.imageUrl,
            type: body.type,
            type_Bangla: body.type_Bangla,
            tags: body.tags,
            tags_Bangla: body.tags_Bangla,
          },
        });

        console.log(bookcover);

        return new Response("Book Cover successfully recorded", {
          status: 200
      })

    } catch (error) {
        console.error("Failed to add Book Cover:", error);
        return new Response("Book Cover not recorded", {
          status: 500
      })
    }
}

export {POST};