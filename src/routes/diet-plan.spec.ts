import { describe, expect, test, vi, beforeEach } from 'vitest'
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { dietPlanRoutes } from './diet-plan.js'
import * as agent from '../agent.js'

vi.mock('../agent.js')

describe('Diet Plan Routes', () => {
  let mockApp: Partial<FastifyInstance>
  let mockRequest: Partial<FastifyRequest>
  let mockReply: Partial<FastifyReply>
  let registeredRoute: ((request: FastifyRequest, reply: FastifyReply) => Promise<FastifyReply>) | undefined

  beforeEach(() => {
    // Setup mock reply
    mockReply = {
      raw: {
        setHeader: vi.fn(),
        write: vi.fn(),
        end: vi.fn()
      } as any,
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis()
    }

    // Setup mock request
    mockRequest = {
      body: {},
      log: {
        error: vi.fn()
      }
    }

    // Setup mock app and capture the route handler
    mockApp = {
      post: vi.fn((path: string, handler: any) => {
        if (path === '/diet-plan') {
          registeredRoute = handler
        }
      })
    }

    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  test('should register POST /diet-plan route', () => {
    dietPlanRoutes(mockApp as FastifyInstance)
    expect(mockApp.post).toHaveBeenCalledWith('/diet-plan', expect.any(Function))
  })

  test('should return 400 when validation fails - missing required fields', async () => {
    dietPlanRoutes(mockApp as FastifyInstance)

    mockRequest.body = { name: 'Jo' } // name too short, missing other fields

    await registeredRoute!(mockRequest as FastifyRequest, mockReply as FastifyReply)

    expect(mockReply.status).toHaveBeenCalledWith(400)
    expect(mockReply.send).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Validation Error',
        details: expect.any(Object)
      })
    )
  })

  test('should return 400 when age is not positive', async () => {
    dietPlanRoutes(mockApp as FastifyInstance)

    mockRequest.body = {
      name: 'John Doe',
      age: -5,
      height: 180,
      weight: 75,
      activityLevel: 'sedentary',
      gender: 'masculine',
      objective: 'lose_weight'
    }

    await registeredRoute!(mockRequest as FastifyRequest, mockReply as FastifyReply)

    expect(mockReply.status).toHaveBeenCalledWith(400)
  })

  test('should return 400 when height is not positive', async () => {
    dietPlanRoutes(mockApp as FastifyInstance)

    mockRequest.body = {
      name: 'John Doe',
      age: 30,
      height: 0,
      weight: 75,
      activityLevel: 'sedentary',
      gender: 'masculine',
      objective: 'lose_weight'
    }

    await registeredRoute!(mockRequest as FastifyInstance, mockReply as FastifyReply)

    expect(mockReply.status).toHaveBeenCalledWith(400)
  })

  test('should return 400 when weight is not positive', async () => {
    dietPlanRoutes(mockApp as FastifyInstance)

    mockRequest.body = {
      name: 'John Doe',
      age: 30,
      height: 180,
      weight: -75,
      activityLevel: 'sedentary',
      gender: 'masculine',
      objective: 'lose_weight'
    }

    await registeredRoute!(mockRequest as FastifyInstance, mockReply as FastifyReply)

    expect(mockReply.status).toHaveBeenCalledWith(400)
  })

  test('should return 400 when activityLevel is invalid', async () => {
    dietPlanRoutes(mockApp as FastifyInstance)

    mockRequest.body = {
      name: 'John Doe',
      age: 30,
      height: 180,
      weight: 75,
      activityLevel: 'invalid_level',
      gender: 'masculine',
      objective: 'lose_weight'
    }

    await registeredRoute!(mockRequest as FastifyInstance, mockReply as FastifyReply)

    expect(mockReply.status).toHaveBeenCalledWith(400)
  })

  test('should return 400 when gender is invalid', async () => {
    dietPlanRoutes(mockApp as FastifyInstance)

    mockRequest.body = {
      name: 'John Doe',
      age: 30,
      height: 180,
      weight: 75,
      activityLevel: 'sedentary',
      gender: 'other',
      objective: 'lose_weight'
    }

    await registeredRoute!(mockRequest as FastifyInstance, mockReply as FastifyReply)

    expect(mockReply.status).toHaveBeenCalledWith(400)
  })

  test('should return 400 when objective is invalid', async () => {
    dietPlanRoutes(mockApp as FastifyInstance)

    mockRequest.body = {
      name: 'John Doe',
      age: 30,
      height: 180,
      weight: 75,
      activityLevel: 'sedentary',
      gender: 'masculine',
      objective: 'invalid_objective'
    }

    await registeredRoute!(mockRequest as FastifyInstance, mockReply as FastifyReply)

    expect(mockReply.status).toHaveBeenCalledWith(400)
  })

  test('should set correct headers for SSE stream', async () => {
    const mockGenerateDietPlan = vi.fn(async function* () {
      yield 'test chunk'
    })
    vi.mocked(agent.generateDietPlan).mockImplementation(mockGenerateDietPlan)

    dietPlanRoutes(mockApp as FastifyInstance)

    mockRequest.body = {
      name: 'John Doe',
      age: 30,
      height: 180,
      weight: 75,
      activityLevel: '2/3x_week',
      gender: 'masculine',
      objective: 'maintain_weight'
    }

    await registeredRoute!(mockRequest as FastifyRequest, mockReply as FastifyReply)

    expect(mockReply.raw.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*')
    expect(mockReply.raw.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream')
    expect(mockReply.raw.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache')
    expect(mockReply.raw.setHeader).toHaveBeenCalledWith('Connection', 'keep-alive')
  })

  test('should stream chunks from generateDietPlan', async () => {
    const mockGenerateDietPlan = vi.fn(async function* () {
      yield 'chunk1'
      yield 'chunk2'
      yield 'chunk3'
    })
    vi.mocked(agent.generateDietPlan).mockImplementation(mockGenerateDietPlan)

    dietPlanRoutes(mockApp as FastifyInstance)

    mockRequest.body = {
      name: 'John Doe',
      age: 30,
      height: 180,
      weight: 75,
      activityLevel: '4x_week_or_+',
      gender: 'feminine',
      objective: 'gain_weight'
    }

    await registeredRoute!(mockRequest as FastifyRequest, mockReply as FastifyReply)

    expect(mockGenerateDietPlan).toHaveBeenCalledWith(mockRequest.body)
    expect(mockReply.raw.write).toHaveBeenCalledTimes(3)
    expect(mockReply.raw.write).toHaveBeenNthCalledWith(1, 'chunk1')
    expect(mockReply.raw.write).toHaveBeenNthCalledWith(2, 'chunk2')
    expect(mockReply.raw.write).toHaveBeenNthCalledWith(3, 'chunk3')
    expect(mockReply.raw.end).toHaveBeenCalled()
  })

  test('should handle errors from generateDietPlan', async () => {
    const testError = new Error('API Error')
    const mockGenerateDietPlan = vi.fn(async function* () {
      throw testError
    })
    vi.mocked(agent.generateDietPlan).mockImplementation(mockGenerateDietPlan)

    dietPlanRoutes(mockApp as FastifyInstance)

    mockRequest.body = {
      name: 'John Doe',
      age: 30,
      height: 180,
      weight: 75,
      activityLevel: 'sedentary',
      gender: 'masculine',
      objective: 'lose_weight'
    }

    await registeredRoute!(mockRequest as FastifyRequest, mockReply as FastifyReply)

    expect(mockRequest.log.error).toHaveBeenCalledWith(testError)
    expect(mockReply.raw.write).toHaveBeenCalledWith(
      expect.stringContaining('API Error')
    )
    expect(mockReply.raw.end).toHaveBeenCalled()
  })

  test('should handle non-Error objects thrown from generateDietPlan', async () => {
    const mockGenerateDietPlan = vi.fn(async function* () {
      throw 'string error'
    })
    vi.mocked(agent.generateDietPlan).mockImplementation(mockGenerateDietPlan)

    dietPlanRoutes(mockApp as FastifyInstance)

    mockRequest.body = {
      name: 'Jane Doe',
      age: 25,
      height: 165,
      weight: 60,
      activityLevel: '2/3x_week',
      gender: 'feminine',
      objective: 'maintain_weight'
    }

    await registeredRoute!(mockRequest as FastifyRequest, mockReply as FastifyReply)

    expect(mockRequest.log.error).toHaveBeenCalledWith('string error')
    expect(mockReply.raw.write).toHaveBeenCalledWith(
      expect.stringContaining('string error')
    )
  })

  test('should call generateDietPlan with valid parsed data', async () => {
    const mockGenerateDietPlan = vi.fn(async function* () {
      yield 'response'
    })
    vi.mocked(agent.generateDietPlan).mockImplementation(mockGenerateDietPlan)

    dietPlanRoutes(mockApp as FastifyInstance)

    const validRequest = {
      name: 'Jane Doe',
      age: 28,
      height: 170,
      weight: 65,
      activityLevel: '4x_week_or_+',
      gender: 'feminine',
      objective: 'lose_weight'
    }

    mockRequest.body = validRequest

    await registeredRoute!(mockRequest as FastifyRequest, mockReply as FastifyReply)

    expect(mockGenerateDietPlan).toHaveBeenCalledWith(validRequest)
  })

  test('should return the reply object', async () => {
    const mockGenerateDietPlan = vi.fn(async function* () {
      yield 'test'
    })
    vi.mocked(agent.generateDietPlan).mockImplementation(mockGenerateDietPlan)

    dietPlanRoutes(mockApp as FastifyInstance)

    mockRequest.body = {
      name: 'John Doe',
      age: 30,
      height: 180,
      weight: 75,
      activityLevel: 'sedentary',
      gender: 'masculine',
      objective: 'lose_weight'
    }

    const result = await registeredRoute!(mockRequest as FastifyRequest, mockReply as FastifyReply)

    expect(result).toBe(mockReply)
  })
})