import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const ticketRepo = {
    findAll: (userId) =>
        prisma.ticket.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, include: { user: true } }),
    findById: (id) =>
        prisma.ticket.findUnique({ where: { id }, include: { comments: true, user: true } }),
    create: (data) => prisma.ticket.create({ data }),
    update: (id, data) => prisma.ticket.update({ where: { id }, data }),
    delete: (id) => prisma.ticket.delete({ where: { id } }),
}