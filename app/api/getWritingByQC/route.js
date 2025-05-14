import prisma from '@/api/prismaClient';
import { NextRequest, NextResponse } from 'next/server';

const GET = async (req) => {
    const url = new URL(req.url || '', 'http://localhost');
    const id = url.searchParams.get('writingId');
    // console.log("ID: ", id)

    if (!id) {
        return NextResponse.json({ message: "ID Not Found" });
    }

    try {
        const writing = await prisma.writingByQC.findUnique({
            where: {
                id: String(id),
            },
        });

        // console.log("FROM ROUTE:",writing);

        if (writing) {
            return NextResponse.json(writing);
        } else {
            return NextResponse.json({ message: "writing not found" });
        }
    } catch (error) {
        console.error("Failed to get writing:", error);
        return NextResponse.json({ message: "writing not found" });
    }
}

export { GET };