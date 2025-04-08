import request from 'supertest'

import { app } from '@/app'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { makeOrg } from 'tests/factories/make-org.factory'
import { makePet } from 'tests/factories/make-pet.fatory'
import { prisma } from '@/lib/prisma'

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

    const pets = await prisma.pet.findMany()
    console.log('Pets encontrados no banco:', pets)

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
      .send(makePet({ age: '1' }))

    await request(app.server)
      .post('/orgs/pets')
      .set('Authorization', `Bearer ${token}`)
      .send(makePet({ age: '2' }))

    const response = await request(app.server)
      .get('/orgs/pets')
      .query({ city: org.city, age: '1' })

    expect(response.status).toBe(200)
    expect(response.body.pets).toHaveLength(1)
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
      .send(makePet({ energy_level: 'ONE' }))

    await request(app.server)
      .post('/orgs/pets')
      .set('Authorization', `Bearer ${token}`)
      .send(makePet({ energy_level: 'TWO' }))

    const response = await request(app.server)
      .get('/orgs/pets')
      .query({ city: org.city, energy_level: 'ONE' })

    expect(response.status).toBe(200)
    expect(response.body.pets).toHaveLength(1)
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
        age: '1',
        size: 'SMALL',
        energy_level: 'ONE',
        environment: 'SMALL_SPACE',
      }),
      makePet({
        age: '2',
        size: 'MEDIUM',
        energy_level: 'THREE',
        environment: 'SMALL_SPACE',
      }),
      makePet({
        age: '1',
        size: 'LARGE',
        energy_level: 'FIVE',
        environment: 'SMALL_SPACE',
      }),
      makePet({
        age: '4',
        size: 'SMALL',
        energy_level: 'ONE',
        environment: 'SMALL_SPACE',
      }),
      makePet({
        age: '5',
        size: 'MEDIUM',
        energy_level: 'ONE',
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
      age: '1',
      size: 'SMALL',
      energy_level: 'ONE',
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
      energy_level: 'ONE',
    })

    expect(response.body.pets).toHaveLength(3)
  })
})
