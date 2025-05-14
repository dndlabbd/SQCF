import prisma from '@/api/prismaClient';
import { NextRequest, NextResponse } from 'next/server';

const GET = async (req) => {
    const url = new URL(req.url || '', 'http://localhost');
    const title = url.searchParams.get('title').toUpperCase();
    // console.log("title: ", title);

    if (!title) {
        return NextResponse.json({ message: "Invalid title" });
    }

    try {
        const art = await prisma.art.findFirst({
            where: {
                title: title,
            },
        });

        if (art) {
            // console.log("artwork found: ", art)
            return NextResponse.json(art);
        } else {
            return NextResponse.json({ message: "Artwork not found" });
        }
    } catch (error) {
        console.error("Failed to get art:", error);
        return NextResponse.json({ message: "Artwork not found" });
    }
}

export { GET };