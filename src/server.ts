import path from 'node:path'
import { fileURLToPath } from 'node:url'
import cors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import Fastify from 'fastify'
import { dietPlanRoutes } from './routes/diet-plan.js'
import { trainingPlanRoutes } from './routes/training-plan.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const app = Fastify()

await app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})

app.register(dietPlanRoutes)
app.register(trainingPlanRoutes)

app.register(fastifySwagger, {
  mode: 'static',
  specification: {
    path: path.resolve(process.cwd(), 'src/docs/openapi.yaml'),
    baseDir: path.resolve(process.cwd(), 'src/docs')
  }
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list'
  },
  staticCSP: true
})

app.get('/test', (_req, res) => {
  res.send('Hello World')
})

app.listen({ port: Number(process.env.PORT) || 3333, host: '0.0.0.0' }).then(() => {
  console.log('🚀 HTTP server running! 📚 Docs available at http://localhost:3333/docs')
})
