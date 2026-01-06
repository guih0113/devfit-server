import type { FastifyInstance } from 'fastify'
import { generateTrainingPlan } from '../agent.js'
import { TrainingPlanRequestSchema } from '../types.js'

export function trainingPlanRoutes(app: FastifyInstance) {
  app.post('/training-plan', async (request, reply) => {
    reply.raw.setHeader('Access-Control-Allow-Origin', '*')
    reply.raw.setHeader('Content-Type', 'text/plain; charset=utf-8')
    reply.raw.setHeader('Content-Type', 'text/event-stream')
    reply.raw.setHeader('Cache-Control', 'no-cache')
    reply.raw.setHeader('Connection', 'keep-alive')

    const parse = TrainingPlanRequestSchema.safeParse(request.body)
    if (!parse.success) {
      return reply.status(400).send({
        error: 'Validation Error',
        details: parse.error.flatten((issue) => issue.message)
      })
    }

    try {
      for await (const chunk of await generateTrainingPlan(parse.data)) {
        reply.raw.write(chunk)
      }
      reply.raw.end()
    } catch (error: unknown) {
      request.log.error(error)
      reply.raw.write(
        `Event: error\n ${JSON.stringify(error instanceof Error ? error.message : String(error))}`
      )
      reply.raw.end()
    }

    return reply
  })
}
