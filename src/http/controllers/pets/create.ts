import type { FastifyReply, FastifyRequest } from 'fastify'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createPetBodySchema = z.object({})
}
