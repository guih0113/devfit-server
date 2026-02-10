import { describe, expect, test, vi, beforeEach } from 'vitest'
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { trainingPlanRoutes } from './training-plan.js'
import * as agent from '../agent.js'

vi.mock('../agent.js')

describe('Training Plan Routes', () => {
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
        if (path === '/training-plan') {
          registeredRoute = handler
        }
      })
    }

    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  test('should register POST /training-plan route', () => {
    trainingPlanRoutes(mockApp as FastifyInstance)
    expect(mockApp.post).toHaveBeenCalledWith('/training-plan', expect.any(Function))
  })

  test('should return 400 when validation fails - missing required fields', async () => {
    trainingPlanRoutes(mockApp as FastifyInstance)

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
    trainingPlanRoutes(mockApp as FastifyInstance)

    mockRequest.body = {
      name: 'John Doe',
      age: -5,
      gender: 'masculine',
      height: 180,
      weight: 75,
      trainingGoal: 'muscle_gain',
      experienceLevel: 'beginner',
      trainingFrequency: '3x_week',
      availableEquipment: 'full_gym'
    }

    await registeredRoute!(mockRequest as FastifyRequest, mockReply as FastifyReply)

    expect(mockReply.status).toHaveBeenCalledWith(400)
  })

  test('should return 400 when height is not positive', async () => {
    trainingPlanRoutes(mockApp as FastifyInstance)

    mockRequest.body = {
      name: 'John Doe',
      age: 30,
      gender: 'masculine',
      height: 0,
      weight: 75,
      trainingGoal: 'muscle_gain',
      experienceLevel: 'beginner',
      trainingFrequency: '3x_week',
      availableEquipment: 'full_gym'
    }

    await registeredRoute!(mockRequest as FastifyInstance, mockReply as FastifyReply)

    expect(mockReply.status).toHaveBeenCalledWith(400)
  })

  test('should return 400 when weight is not positive', async () => {
    trainingPlanRoutes(mockApp as FastifyInstance)

    mockRequest.body = {
      name: 'John Doe',
      age: 30,
      gender: 'masculine',
      height: 180,
      weight: -75,
      trainingGoal: 'muscle_gain',
      experienceLevel: 'beginner',
      trainingFrequency: '3x_week',
      availableEquipment: 'full_gym'
    }

    await registeredRoute!(mockRequest as FastifyInstance, mockReply as FastifyReply)

    expect(mockReply.status).toHaveBeenCalledWith(400)
  })

  test('should return 400 when gender is invalid', async () => {
    trainingPlanRoutes(mockApp as FastifyInstance)

    mockRequest.body = {
      name: 'John Doe',
      age: 30,
      gender: 'other',
      height: 180,
      weight: 75,
      trainingGoal: 'muscle_gain',
      experienceLevel: 'beginner',
      trainingFrequency: '3x_week',
      availableEquipment: 'full_gym'
    }

    await registeredRoute!(mockRequest as FastifyInstance, mockReply as FastifyReply)

    expect(mockReply.status).toHaveBeenCalledWith(400)
  })

  test('should return 400 when trainingGoal is invalid', async () => {
    trainingPlanRoutes(mockApp as FastifyInstance)

    mockRequest.body = {
      name: 'John Doe',
      age: 30,
      gender: 'masculine',
      height: 180,
      weight: 75,
      trainingGoal: 'invalid_goal',
      experienceLevel: 'beginner',
      trainingFrequency: '3x_week',
      availableEquipment: 'full_gym'
    }

    await registeredRoute!(mockRequest as FastifyInstance, mockReply as FastifyReply)

    expect(mockReply.status).toHaveBeenCalledWith(400)
  })

  test('should return 400 when experienceLevel is invalid', async () => {
    trainingPlanRoutes(mockApp as FastifyInstance)

    mockRequest.body = {
      name: 'John Doe',
      age: 30,
      gender: 'masculine',
      height: 180,
      weight: 75,
      trainingGoal: 'muscle_gain',
      experienceLevel: 'expert',
      trainingFrequency: '3x_week',
      availableEquipment: 'full_gym'
    }

    await registeredRoute!(mockRequest as FastifyInstance, mockReply as FastifyReply)

    expect(mockReply.status).toHaveBeenCalledWith(400)
  })

  test('should return 400 when trainingFrequency is invalid', async () => {
    trainingPlanRoutes(mockApp as FastifyInstance)

    mockRequest.body = {
      name: 'John Doe',
      age: 30,
      gender: 'masculine',
      height: 180,
      weight: 75,
      trainingGoal: 'muscle_gain',
      experienceLevel: 'beginner',
      trainingFrequency: '6x_week',
      availableEquipment: 'full_gym'
    }

    await registeredRoute!(mockRequest as FastifyInstance, mockReply as FastifyReply)

    expect(mockReply.status).toHaveBeenCalledWith(400)
  })

  test('should return 400 when availableEquipment is invalid', async () => {
    trainingPlanRoutes(mockApp as FastifyInstance)

    mockRequest.body = {
      name: 'John Doe',
      age: 30,
      gender: 'masculine',
      height: 180,
      weight: 75,
      trainingGoal: 'muscle_gain',
      experienceLevel: 'beginner',
      trainingFrequency: '3x_week',
      availableEquipment: 'partial_gym'
    }

    await registeredRoute!(mockRequest as FastifyInstance, mockReply as FastifyReply)

    expect(mockReply.status).toHaveBeenCalledWith(400)
  })

  test('should set correct headers for SSE stream', async () => {
    const mockGenerateTrainingPlan = vi.fn(async function* () {
      yield 'test chunk'
    })
    vi.mocked(agent.generateTrainingPlan).mockImplementation(mockGenerateTrainingPlan)

    trainingPlanRoutes(mockApp as FastifyInstance)

    mockRequest.body = {
      name: 'John Doe',
      age: 30,
      gender: 'masculine',
      height: 180,
      weight: 75,
      trainingGoal: 'fat_loss',
      experienceLevel: 'intermediate',
      trainingFrequency: '4x_week',
      availableEquipment: 'full_gym'
    }

    await registeredRoute!(mockRequest as FastifyRequest, mockReply as FastifyReply)

    expect(mockReply.raw.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*')
    expect(mockReply.raw.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream')
    expect(mockReply.raw.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache')
    expect(mockReply.raw.setHeader).toHaveBeenCalledWith('Connection', 'keep-alive')
  })

  test('should stream chunks from generateTrainingPlan', async () => {
    const mockGenerateTrainingPlan = vi.fn(async function* () {
      yield 'chunk1'
      yield 'chunk2'
      yield 'chunk3'
    })
    vi.mocked(agent.generateTrainingPlan).mockImplementation(mockGenerateTrainingPlan)

    trainingPlanRoutes(mockApp as FastifyInstance)

    mockRequest.body = {
      name: 'Jane Doe',
      age: 28,
      gender: 'feminine',
      height: 165,
      weight: 60,
      trainingGoal: 'maintenance',
      experienceLevel: 'advanced',
      trainingFrequency: '5x_week',
      availableEquipment: 'full_gym'
    }

    await registeredRoute!(mockRequest as FastifyRequest, mockReply as FastifyReply)

    expect(mockGenerateTrainingPlan).toHaveBeenCalledWith(mockRequest.body)
    expect(mockReply.raw.write).toHaveBeenCalledTimes(3)
    expect(mockReply.raw.write).toHaveBeenNthCalledWith(1, 'chunk1')
    expect(mockReply.raw.write).toHaveBeenNthCalledWith(2, 'chunk2')
    expect(mockReply.raw.write).toHaveBeenNthCalledWith(3, 'chunk3')
    expect(mockReply.raw.end).toHaveBeenCalled()
  })

  test('should handle errors from generateTrainingPlan', async () => {
    const testError = new Error('API Error')
    const mockGenerateTrainingPlan = vi.fn(async function* () {
      throw testError
    })
    vi.mocked(agent.generateTrainingPlan).mockImplementation(mockGenerateTrainingPlan)

    trainingPlanRoutes(mockApp as FastifyInstance)

    mockRequest.body = {
      name: 'John Doe',
      age: 30,
      gender: 'masculine',
      height: 180,
      weight: 75,
      trainingGoal: 'muscle_gain',
      experienceLevel: 'beginner',
      trainingFrequency: '3x_week',
      availableEquipment: 'none'
    }

    await registeredRoute!(mockRequest as FastifyRequest, mockReply as FastifyReply)

    expect(mockRequest.log.error).toHaveBeenCalledWith(testError)
    expect(mockReply.raw.write).toHaveBeenCalledWith(
      expect.stringContaining('API Error')
    )
    expect(mockReply.raw.end).toHaveBeenCalled()
  })

  test('should handle non-Error objects thrown from generateTrainingPlan', async () => {
    const mockGenerateTrainingPlan = vi.fn(async function* () {
      throw 'string error'
    })
    vi.mocked(agent.generateTrainingPlan).mockImplementation(mockGenerateTrainingPlan)

    trainingPlanRoutes(mockApp as FastifyInstance)

    mockRequest.body = {
      name: 'Jane Doe',
      age: 25,
      gender: 'feminine',
      height: 165,
      weight: 60,
      trainingGoal: 'fat_loss',
      experienceLevel: 'beginner',
      trainingFrequency: '3x_week',
      availableEquipment: 'basic'
    }

    await registeredRoute!(mockRequest as FastifyRequest, mockReply as FastifyReply)

    expect(mockRequest.log.error).toHaveBeenCalledWith('string error')
    expect(mockReply.raw.write).toHaveBeenCalledWith(
      expect.stringContaining('string error')
    )
  })

  test('should call generateTrainingPlan with valid parsed data', async () => {
    const mockGenerateTrainingPlan = vi.fn(async function* () {
      yield 'response'
    })
    vi.mocked(agent.generateTrainingPlan).mockImplementation(mockGenerateTrainingPlan)

    trainingPlanRoutes(mockApp as FastifyInstance)

    const validRequest = {
      name: 'Alex Smith',
      age: 35,
      gender: 'masculine',
      height: 185,
      weight: 85,
      trainingGoal: 'muscle_gain',
      experienceLevel: 'intermediate',
      trainingFrequency: '4x_week',
      availableEquipment: 'full_gym'
    }

    mockRequest.body = validRequest

    await registeredRoute!(mockRequest as FastifyRequest, mockReply as FastifyReply)

    expect(mockGenerateTrainingPlan).toHaveBeenCalledWith(validRequest)
  })

  test('should return the reply object', async () => {
    const mockGenerateTrainingPlan = vi.fn(async function* () {
      yield 'test'
    })
    vi.mocked(agent.generateTrainingPlan).mockImplementation(mockGenerateTrainingPlan)

    trainingPlanRoutes(mockApp as FastifyInstance)

    mockRequest.body = {
      name: 'John Doe',
      age: 30,
      gender: 'masculine',
      height: 180,
      weight: 75,
      trainingGoal: 'muscle_gain',
      experienceLevel: 'beginner',
      trainingFrequency: '3x_week',
      availableEquipment: 'full_gym'
    }

    const result = await registeredRoute!(mockRequest as FastifyRequest, mockReply as FastifyReply)

    expect(result).toBe(mockReply)
  })

  test('should handle all valid trainingGoal options', async () => {
    const mockGenerateTrainingPlan = vi.fn(async function* () {
      yield 'test'
    })
    vi.mocked(agent.generateTrainingPlan).mockImplementation(mockGenerateTrainingPlan)

    trainingPlanRoutes(mockApp as FastifyInstance)

    const validGoals = ['muscle_gain', 'fat_loss', 'maintenance']

    for (const goal of validGoals) {
      vi.clearAllMocks()

      mockRequest.body = {
        name: 'John Doe',
        age: 30,
        gender: 'masculine',
        height: 180,
        weight: 75,
        trainingGoal: goal as any,
        experienceLevel: 'beginner',
        trainingFrequency: '3x_week',
        availableEquipment: 'full_gym'
      }

      await registeredRoute!(mockRequest as FastifyRequest, mockReply as FastifyReply)

      expect(mockReply.status).not.toHaveBeenCalledWith(400)
    }
  })

  test('should handle all valid experienceLevel options', async () => {
    const mockGenerateTrainingPlan = vi.fn(async function* () {
      yield 'test'
    })
    vi.mocked(agent.generateTrainingPlan).mockImplementation(mockGenerateTrainingPlan)

    trainingPlanRoutes(mockApp as FastifyInstance)

    const validLevels = ['beginner', 'intermediate', 'advanced']

    for (const level of validLevels) {
      vi.clearAllMocks()

      mockRequest.body = {
        name: 'John Doe',
        age: 30,
        gender: 'masculine',
        height: 180,
        weight: 75,
        trainingGoal: 'muscle_gain',
        experienceLevel: level as any,
        trainingFrequency: '3x_week',
        availableEquipment: 'full_gym'
      }

      await registeredRoute!(mockRequest as FastifyRequest, mockReply as FastifyReply)

      expect(mockReply.status).not.toHaveBeenCalledWith(400)
    }
  })

  test('should handle all valid trainingFrequency options', async () => {
    const mockGenerateTrainingPlan = vi.fn(async function* () {
      yield 'test'
    })
    vi.mocked(agent.generateTrainingPlan).mockImplementation(mockGenerateTrainingPlan)

    trainingPlanRoutes(mockApp as FastifyInstance)

    const validFrequencies = ['3x_week', '4x_week', '5x_week']

    for (const frequency of validFrequencies) {
      vi.clearAllMocks()

      mockRequest.body = {
        name: 'John Doe',
        age: 30,
        gender: 'masculine',
        height: 180,
        weight: 75,
        trainingGoal: 'muscle_gain',
        experienceLevel: 'beginner',
        trainingFrequency: frequency as any,
        availableEquipment: 'full_gym'
      }

      await registeredRoute!(mockRequest as FastifyRequest, mockReply as FastifyReply)

      expect(mockReply.status).not.toHaveBeenCalledWith(400)
    }
  })

  test('should handle all valid availableEquipment options', async () => {
    const mockGenerateTrainingPlan = vi.fn(async function* () {
      yield 'test'
    })
    vi.mocked(agent.generateTrainingPlan).mockImplementation(mockGenerateTrainingPlan)

    trainingPlanRoutes(mockApp as FastifyInstance)

    const validEquipment = ['none', 'basic', 'full_gym']

    for (const equipment of validEquipment) {
      vi.clearAllMocks()

      mockRequest.body = {
        name: 'John Doe',
        age: 30,
        gender: 'masculine',
        height: 180,
        weight: 75,
        trainingGoal: 'muscle_gain',
        experienceLevel: 'beginner',
        trainingFrequency: '3x_week',
        availableEquipment: equipment as any
      }

      await registeredRoute!(mockRequest as FastifyRequest, mockReply as FastifyReply)

      expect(mockReply.status).not.toHaveBeenCalledWith(400)
    }
  })
})