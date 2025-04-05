import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { makePet } from 'tests/factories/make-pet.fatory'

describe('Get Pet (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get a pet', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/orgs/pets')
      .set('Authorization', `Bearer ${token}`)
      .send(makePet())

    const getPetResponse = await request(app.server)
      .get(`/orgs/pets/${response.body.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(getPetResponse.status).toBe(200)
  })
})
