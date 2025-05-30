import { PrismaClient } from '@prisma/client'
// import prisma from '#root/lib/prisma';

declare global {
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
