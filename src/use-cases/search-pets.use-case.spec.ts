import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets.repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs.repository'
import { SearchPetsUseCase } from './search-pets.use-case'
import { Decimal } from '@prisma/client/runtime/library'
import { EnergyLevel, Environment, PetSize } from '@prisma/client'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: SearchPetsUseCase

describe('Search Pets Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new SearchPetsUseCase(petsRepository)
  })

  it('should be able to retrieve pets by city', async () => {
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
      latitude: new Decimal(-23.561414),
      longitude: new Decimal(-46.656543),
    })

    petsRepository.items.push({
      id: 'pet-01',
      name: 'Buddy',
      about: 'A friendly golden retriever',
      age: '3 years',
      size: PetSize.MEDIUM,
      energy_level: EnergyLevel.THREE,
      environment: Environment.LARGE_SPACE,
      org_id: 'org-1',
    })

    const { pets } = await sut.execute({ city: 'São Paulo' })

    expect(pets).toHaveLength(1)
    expect(pets[0].name).toBe('Buddy')
    expect(pets[0].org_id).toBe('org-1')
  })

  it('should return an empty array if no pets are found in the city', async () => {
    const { pets } = await sut.execute({ city: 'Rio de Janeiro' })

    expect(pets).toHaveLength(0)
  })
})
