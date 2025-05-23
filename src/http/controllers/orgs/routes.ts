import type { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { nearby } from './nearby'
import { refresh } from './refresh'

export async function orgsRoutes(app: FastifyInstance) {
  app.post('/orgs', register)
  app.post('/sessions', authenticate)

  app.get('/orgs/nearby', nearby)

  app.patch('/token/refresh', refresh)

  app.get('/org-profile', { onRequest: [verifyJWT] }, profile)
}
