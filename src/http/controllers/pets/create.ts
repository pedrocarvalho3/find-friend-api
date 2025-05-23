import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found.error'
import { makeCreatePetUseCase } from '@/use-cases/fatories/make-create-pet.use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    name: z.string(),
    about: z.string(),
    age: z.enum(['PUPPY', 'ADULT', 'ELDERLY']),
    size: z.enum(['SMALL', 'MEDIUM', 'LARGE']),
    energy_level: z.enum(['VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH']),
    environment: z.enum(['SMALL_SPACE', 'MEDIUM_SPACE', 'LARGE_SPACE']),
    dependency_level: z.enum([
      'VERY_LOW',
      'LOW',
      'MEDIUM',
      'HIGH',
      'VERY_HIGH',
    ]),
    photos: z.array(z.string()).nonempty(),
    adoption_requirements: z.array(z.string()).nonempty(),
  })

  const body = createBodySchema.parse(request.body)

  const createPetUseCase = makeCreatePetUseCase()

  const orgId = request.user.sub

  try {
    const { pet } = await createPetUseCase.execute({ ...body, orgId })

    return reply.status(201).send(pet)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    console.error(error)

    return reply.status(500).send({ message: 'Internal server error' })
  }
}
