import path from 'node:path'
import { fileURLToPath } from 'node:url'
import cors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import Fastify from 'fastify'
import { dietPlanRoutes } from './routes/diet-plan'
import { trainingPlanRoutes } from './routes/training-plan'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const app = Fastify()

await app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST']
})

app.register(dietPlanRoutes)
app.register(trainingPlanRoutes)

app.register(fastifySwagger, {
  mode: 'static',
  specification: {
    path: path.resolve(__dirname, 'docs', 'openapi.yaml'),
    baseDir: path.resolve(__dirname, 'docs')
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
