import fs from 'node:fs'
import { GoogleGenAI } from '@google/genai'
import {
  buildSystemPromptForDietPlan,
  buildSystemPromptForTrainingPlan,
  buildUserPromptForDietPlan,
  buildUserPromptForTrainingPlan
} from './prompt.js'
import type { DietPlanRequest, TrainingPlanRequest } from './types.js'

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY as string
})

const model = 'gemini-2.5-flash'

export async function* generateDietPlan(input: DietPlanRequest) {
  const diretrizes = fs.readFileSync('knowledge/diretrizes-dieta.md', 'utf-8')

  const prompt = `
    CONTEXTO: 
    ${buildSystemPromptForDietPlan()}

    PERGUNTA: 
    ${buildUserPromptForDietPlan(input)}

    DIRETRIZES:
    ${diretrizes}
  `

  const response = await gemini.models.generateContentStream({
    model,
    contents: [
      {
        text: prompt
      }
    ]
  })

  for await (const chunk of response) {
    if (chunk.text) yield chunk.text
  }
}

export async function* generateTrainingPlan(input: TrainingPlanRequest) {
  const diretrizes = fs.readFileSync('knowledge/diretrizes-treino.md', 'utf-8')

  const prompt = `
    CONTEXTO: 
    ${buildSystemPromptForTrainingPlan()}

    PERGUNTA: 
    ${buildUserPromptForTrainingPlan(input)}

    DIRETRIZES:
    ${diretrizes}
  `

  const response = await gemini.models.generateContentStream({
    model,
    contents: [
      {
        text: prompt
      }
    ]
  })

  for await (const chunk of response) {
    if (chunk.text) yield chunk.text
  }
}
