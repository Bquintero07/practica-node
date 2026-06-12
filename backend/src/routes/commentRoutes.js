import { Router } from 'express'
import { commentController } from '../controllers/commentController.js'
import { authMiddleware }    from '../middleware/authMiddleware.js'
export const commentRoutes = Router()
commentRoutes.use(authMiddleware)
commentRoutes.get('/:id/comments',  commentController.getByTicket)
commentRoutes.post('/:id/comments', commentController.create)