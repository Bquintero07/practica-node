import { ticketService } from '../services/ticketService.js'

export const ticketController = {
    getAll:  async (req, res) => { const t = await ticketService.getAll(req.user.id); res.json(t) },
    getById: async (req, res) => { const t = await ticketService.getById(req.params.id); res.json(t) },
    create:  async (req, res) => { const t = await ticketService.create(req.body, req.user.id); res.status(201).json(t) },
    update:  async (req, res) => { const t = await ticketService.update(req.params.id, req.body); res.json(t) },
    remove:  async (req, res) => { await ticketService.remove(req.params.id); res.status(204).end() },
}