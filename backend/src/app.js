import 'dotenv/config'
import express  from 'express'
import cors     from 'cors'

import { authRoutes }    from './routes/authRoutes.js'
import { ticketRoutes }  from './routes/ticketRoutes.js'
import { commentRoutes } from './routes/commentRoutes.js'
// import { swaggerUi, swaggerSpec } from './swagger.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth',    authRoutes)
app.use('/api/tickets', ticketRoutes)
app.use('/api/tickets', commentRoutes)
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`))