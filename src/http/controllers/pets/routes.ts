import { verifyJWT } from '@/http/middlewares/verify-jwt'
import type { FastifyInstance } from 'fastify'
import { create } from './create'
import { getPet } from './get-pet'
import { searchPets } from './search-pets'

export async function petsRoutes(app: FastifyInstance) {
  app.post('/pets', { onRequest: [verifyJWT] }, create)
  app.get('/pets', searchPets)
  app.get('/pets/:id', getPet)
}
