import { Router } from 'express'
import { ticketController } from '../controllers/ticketController.js'
import { authMiddleware }   from '../middleware/authMiddleware.js'
export const ticketRoutes = Router()
ticketRoutes.use(authMiddleware)
ticketRoutes.get('/',      ticketController.getAll)
ticketRoutes.get('/:id',   ticketController.getById)
ticketRoutes.post('/',     ticketController.create)
ticketRoutes.put('/:id',   ticketController.update)
ticketRoutes.delete('/:id', ticketController.remove)