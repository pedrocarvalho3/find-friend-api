import request from 'supertest'

import { app } from '@/app'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { makeOrg } from 'tests/factories/make-org.factory'
import { makePet } from 'tests/factories/make-pet.fatory'
import { EnergyLevel, PetAge } from '@prisma/client'

describe('Search Pets (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search pets by city', async () => {
    const org = makeOrg()

    await request(app.server).post('/orgs').send(org)

    const authResponse = await request(app.server)
      .post('/sessions')
      .send({ email: org.email, password: org.password })

    const token = authResponse.body.token

    await request(app.server)
      .post('/orgs/pets')
      .set('Authorization', `Bearer ${token}`)
      .send(makePet())

    await request(app.server)
      .post('/orgs/pets')
      .set('Authorization', `Bearer ${token}`)
      .send(makePet())

    const response = await request(app.server)
      .get('/orgs/pets')
      .query({ city: org.city })

    expect(response.status).toBe(200)
    expect(response.body.pets).toHaveLength(2)
  })

  it('should not be able to search pets without city', async () => {
    const response = await request(app.server).get('/orgs/pets')

    expect(response.status).toBe(400)
  })

  it('should be able to search pets by city and age', async () => {
    const org = makeOrg()

    await request(app.server).post('/orgs').send(org)

    const authResponse = await request(app.server)
      .post('/sessions')
      .send({ email: org.email, password: org.password })

    const token = authResponse.body.token

    await request(app.server)
      .post('/orgs/pets')
      .set('Authorization', `Bearer ${token}`)
      .send(makePet({ age: PetAge.PUPPY }))

    await request(app.server)
      .post('/orgs/pets')
      .set('Authorization', `Bearer ${token}`)
      .send(makePet({ age: PetAge.PUPPY }))

    await request(app.server)
      .post('/orgs/pets')
      .set('Authorization', `Bearer ${token}`)
      .send(makePet({ age: PetAge.ADULT }))

    const response = await request(app.server)
      .get('/orgs/pets')
      .query({ city: org.city, age: PetAge.PUPPY })

    expect(response.status).toBe(200)
    expect(response.body.pets).toHaveLength(2)
  })

  it('should be able to search pets by city and size', async () => {
    const org = makeOrg()

    await request(app.server).post('/orgs').send(org)

    const authResponse = await request(app.server)
      .post('/sessions')
      .send({ email: org.email, password: org.password })

    const token = authResponse.body.token

    await request(app.server)
      .post('/orgs/pets')
      .set('Authorization', `Bearer ${token}`)
      .send(makePet({ size: 'SMALL' }))

    await request(app.server)
      .post('/orgs/pets')
      .set('Authorization', `Bearer ${token}`)
      .send(makePet({ size: 'MEDIUM' }))

    await request(app.server)
      .post('/orgs/pets')
      .set('Authorization', `Bearer ${token}`)
      .send(makePet({ size: 'LARGE' }))

    const response = await request(app.server)
      .get('/orgs/pets')
      .query({ city: org.city, size: 'SMALL' })

    expect(response.status).toBe(200)
    expect(response.body.pets).toHaveLength(1)
  })

  it('should be able to search pets by city and energy level', async () => {
    const org = makeOrg()

    await request(app.server).post('/orgs').send(org)

    const authResponse = await request(app.server)
      .post('/sessions')
      .send({ email: org.email, password: org.password })

    const token = authResponse.body.token

    await request(app.server)
      .post('/orgs/pets')
      .set('Authorization', `Bearer ${token}`)
      .send(makePet({ energy_level: EnergyLevel.VERY_LOW }))

    await request(app.server)
      .post('/orgs/pets')
      .set('Authorization', `Bearer ${token}`)
      .send(makePet({ energy_level: EnergyLevel.LOW }))

    await request(app.server)
      .post('/orgs/pets')
      .set('Authorization', `Bearer ${token}`)
      .send(makePet({ energy_level: EnergyLevel.LOW }))

    const response = await request(app.server)
      .get('/orgs/pets')
      .query({ city: org.city, energy_level: EnergyLevel.LOW })

    expect(response.status).toBe(200)
    expect(response.body.pets).toHaveLength(2)
  })

  it('should be able to search pets by city and environment', async () => {
    const org = makeOrg()

    await request(app.server).post('/orgs').send(org)

    const authResponse = await request(app.server)
      .post('/sessions')
      .send({ email: org.email, password: org.password })

    const token = authResponse.body.token

    await request(app.server)
      .post('/orgs/pets')
      .set('Authorization', `Bearer ${token}`)
      .send(makePet({ environment: 'SMALL_SPACE' }))

    const response = await request(app.server)
      .get('/orgs/pets')
      .query({ city: org.city, environment: 'SMALL_SPACE' })

    expect(response.status).toBe(200)
    expect(response.body.pets).toHaveLength(1)
  })

  // create a test with a lot of pets that combines all the filters
  it('should be able to search pets by city and all filters', async () => {
    const org = makeOrg()

    await request(app.server).post('/orgs').send(org)

    const authResponse = await request(app.server)
      .post('/sessions')
      .send({ email: org.email, password: org.password })

    const token = authResponse.body.token

    const pets = [
      makePet({
        age: 'PUPPY',
        size: 'SMALL',
        energy_level: 'VERY_LOW',
        environment: 'SMALL_SPACE',
      }),
      makePet({
        age: 'ADULT',
        size: 'MEDIUM',
        energy_level: 'MEDIUM',
        environment: 'SMALL_SPACE',
      }),
      makePet({
        age: 'PUPPY',
        size: 'LARGE',
        energy_level: 'VERY_HIGH',
        environment: 'SMALL_SPACE',
      }),
      makePet({
        age: 'ELDERLY',
        size: 'SMALL',
        energy_level: 'VERY_LOW',
        environment: 'SMALL_SPACE',
      }),
      makePet({
        age: 'ELDERLY',
        size: 'MEDIUM',
        energy_level: 'VERY_LOW',
        environment: 'SMALL_SPACE',
      }),
    ]

    await Promise.all(
      pets.map((pet) =>
        request(app.server)
          .post('/orgs/pets')
          .set('Authorization', `Bearer ${token}`)
          .send(pet),
      ),
    )

    let response = await request(app.server).get('/orgs/pets').query({
      city: org.city,
      age: 'PUPPY',
      size: 'SMALL',
      energy_level: 'VERY_LOW',
      environment: 'SMALL_SPACE',
    })

    expect(response.body.pets).toHaveLength(1)

    response = await request(app.server).get('/orgs/pets').query({
      city: org.city,
      size: 'MEDIUM',
    })

    expect(response.body.pets).toHaveLength(2)

    response = await request(app.server).get('/orgs/pets').query({
      city: org.city,
      energy_level: 'VERY_LOW',
    })

    expect(response.body.pets).toHaveLength(3)
  })
})
