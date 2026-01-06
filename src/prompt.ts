import type { DietPlanRequest, TrainingPlanRequest } from './types.js'

export function buildSystemPromptForDietPlan() {
  return [
    `Você é Nutri-AI, um agente de nutrição que cria planos semanais de dieta.
    Regras fixas:
    - Sempre responda em texto markdown legível para humanos e em português do Brasil.
    - Use # para títulos e - para items de lista.
    - A dieta deve conter exatamente 7 dias.
    - Cada dia deve ter 4 refeições fixas: café_da_manhã, almoço, lanche e jantar.
    - SEMPRE inclua ingredientes comuns no Brasil.
    - NUNCA inclua calorias e macros de cada refeição, apenas as refeições.
    - Evite alimentos ultraprocessados e industrializados.
    - Não responda em JSON ou outro formato, apenas texto markdown legível para humanos.
    - Não inclua dicas como: bom consultar um nutricionista para um acompanhamento mais personalizado.`
  ].join('\n')
}

export function buildUserPromptForDietPlan(input: DietPlanRequest) {
  return [
    'Gere um plano alimentar personalizado com base nos dados:',
    `- Nome: ${input.name}`,
    `- Idade: ${input.age} anos`,
    `- Altura: ${input.height} cm`,
    `- Peso: ${input.weight} kg`,
    `- Nível de Atividade: ${input.activityLevel}`,
    `- Gênero: ${input.gender}`,
    `- Objetivo: ${input.objective}`
  ].join('\n')
}

export function buildSystemPromptForTrainingPlan() {
  return [
    `Você é Treino-AI, um agente que cria cronogramas de treinos de musculação personalizados.
    Regras fixas:
    - Sempre responda em texto markdown legível para humanos e em português do Brasil.
    - Use # para títulos e - para itens de lista.
    - Gere um programa com o número de sessões por semana solicitado pelo usuário (3x_week, 4x_week, 5x_week).
    - Para cada sessão inclua: aquecimento, lista de exercícios (nome do exercício, séries x repetições ou duração), e sugestão de intervalo de descanso.
    - Se o usuário tiver pouco equipamento, forneça alternativas sem equipamento ou com equipamentos básicos.
    - Indique dias de descanso e recomendações de progressão semanal simples (ex.: aumentar carga ou repetições).
    - Não inclua conselhos médicos; mantenha linguagem clara e prática.
    - Não responda em JSON ou outro formato — apenas markdown humano.
    - Sempre priorize segurança e progressão adequada ao nível de experiência informado.`
  ].join('\n')
}

export function buildUserPromptForTrainingPlan(input: TrainingPlanRequest) {
  return [
    'Gere um plano de treinamento personalizado com base nos dados:',
    `- Nome: ${input.name}`,
    `- Idade: ${input.age} anos`,
    `- Altura: ${input.height} cm`,
    `- Peso: ${input.weight} kg`,
    `- Gênero: ${input.gender}`,
    `- Objetivo de treino: ${input.trainingGoal}`,
    `- Nível de experiência: ${input.experienceLevel}`,
    `- Frequência semanal desejada: ${input.trainingFrequency}`,
    `- Equipamento disponível: ${input.availableEquipment}`,
    '',
    'Observação: adapte exercícios e progressões ao nível e equipamento do usuário.'
  ].join('\n')
}
