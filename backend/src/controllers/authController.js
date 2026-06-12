import { registerUser, loginUser } from '../services/authService.js'

export async function register(req, res) {
    try {
        const { name, email, password } = req.body
        const user = await registerUser(name, email, password)
        res.status(201).json({ id: user.id, email: user.email })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body
        const data = await loginUser(email, password)
        res.json(data)
    } catch (err) {
        res.status(401).json({ error: err.message })
    }
}