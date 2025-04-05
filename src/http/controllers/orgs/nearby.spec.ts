import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { Decimal } from '@prisma/client/runtime/library'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

describe('Nearby Orgs (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able list nearby orgs', async () => {
    const token = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/orgs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Jose',
        email: 'contact@petshelter.com',
        password_hash: 'hashed_password',
        author_name: 'Jane Doe',
        whatsapp: '683217673',
        cep: '12345678',
        state: 'SP',
        city: 'São Paulo',
        neighborhood: 'Centro',
        street: 'Avenida Paulista',
        latitude: new Decimal(-27.0610928),
        longitude: new Decimal(-49.5229501),
      })

    const response = await request(app.server)
      .get('/orgs/nearby')
      .query({
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.orgs).toHaveLength(1)
    expect(response.body.orgs).toEqual([
      expect.objectContaining({
        name: 'John Doe',
      }),
    ])
  })
})
