import { commentRepo } from '../repositories/commentRepository.js'
export const commentService = {
    getByTicket: (ticketId) => commentRepo.findByTicket(ticketId),
    create: (ticketId, content, userId) => commentRepo.create({ ticketId, content, userId }),
}