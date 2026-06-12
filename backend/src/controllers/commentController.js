import { commentService } from '../services/commentService.js'
export const commentController = {
    getByTicket: async (req, res) => {
        const comments = await commentService.getByTicket(req.params.id)
        res.json(comments)
    },
    create: async (req, res) => {
        const comment = await commentService.create(req.params.id, req.body.content, req.user.id)
        res.status(201).json(comment)
    },
}