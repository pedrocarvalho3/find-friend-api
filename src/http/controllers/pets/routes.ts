import { verifyJWT } from '@/http/middlewares/verify-jwt'
import type { FastifyInstance } from 'fastify'
import { create } from './create'
import { getPet } from './get-pet'

export async function petsRoutes(app: FastifyInstance) {
  app.post('/orgs/pets', { onRequest: [verifyJWT] }, create)
  app.get('/orgs/pets/:id', getPet)
}
