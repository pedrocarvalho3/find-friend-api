import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs.repository'
import { Decimal } from '@prisma/client/runtime/library'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyOrgsUseCase } from './fetch-nearby-orgs.use-case'

let orgsRepository: InMemoryOrgsRepository
let sut: FetchNearbyOrgsUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new FetchNearbyOrgsUseCase(orgsRepository)
  })

  it('should not be able to check in on distant gym', async () => {
    orgsRepository.items.push({
      id: 'org-1',
      name: 'Pet Shelter',
      email: 'contact@petshelter.com',
      password_hash: 'hashed_password',
      author_name: 'Jane Doe',
      whatsapp: '683217673',
      cep: '12345678',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Centro',
      street: 'Avenida Paulista',
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
    })

    orgsRepository.items.push({
      id: 'org-1',
      name: 'Pet Shelter',
      email: 'contact@petshelter.com',
      password_hash: 'hashed_password',
      author_name: 'Jane Doe',
      whatsapp: '683217673',
      cep: '12345678',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Centro',
      street: 'Avenida Paulista',
      latitude: new Decimal(-27.2092052),
      longitude: new Decimal(-49.6401091),
    })

    const { orgs } = await sut.execute({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(orgs.length).toEqual(1)
  })
})
