import { ticketRepo } from '../repositories/ticketRepository.js'

export const ticketService = {
    getAll:  (userId) => ticketRepo.findAll(userId),
    getById: (id)     => ticketRepo.findById(id),
    create:  (data, userId) => ticketRepo.create({ ...data, userId }),
    update:  (id, data) => ticketRepo.update(id, data),
    remove:  (id)       => ticketRepo.delete(id),
}