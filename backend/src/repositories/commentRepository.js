import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const commentRepo = {
    findByTicket: (ticketId) =>
        prisma.comment.findMany({ where: { ticketId }, include: { user: true }, orderBy: { createdAt: "asc" } }),
    create: (data) => prisma.comment.create({ data, include: { user: true } }),
}