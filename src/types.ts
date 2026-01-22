import z from 'zod'

export const DietPlanRequestSchema = z.object({
  name: z.string().min(3),
  age: z.number().positive(),
  height: z.number().positive(),
  weight: z.number().positive(),
  activityLevel: z.enum(['sedentary', '2/3x_week', '4x_week_or_+']),
  gender: z.enum(['masculine', 'feminine']),
  objective: z.enum(['lose_weight', 'maintain_weight', 'gain_weight'])
})

export const TrainingPlanRequestSchema = z.object({
  name: z.string().min(3),
  age: z.number().positive(),
  gender: z.enum(['masculine', 'feminine']),
  height: z.number().positive(),
  weight: z.number().positive(),
  trainingGoal: z.enum(['muscle_gain', 'fat_loss', 'maintenance']),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  trainingFrequency: z.enum(['3x_week', '4x_week', '5x_week']),
  availableEquipment: z.enum(['none', 'basic', 'full_gym'])
})

export type DietPlanRequest = z.infer<typeof DietPlanRequestSchema>
export type TrainingPlanRequest = z.infer<typeof TrainingPlanRequestSchema>
