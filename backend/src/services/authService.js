import bcrypt from 'bcryptjs'
import jwt    from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function registerUser(name, email, password) {
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) throw new Error('Email ya registrado')
    const hash = await bcrypt.hash(password, 10)
    return prisma.user.create({ data: { name, email, password: hash } })
}

export async function loginUser(email, password) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new Error('Usuario no encontrado')
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw new Error('Contraseña incorrecta')
    const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    )
    return { token }
}