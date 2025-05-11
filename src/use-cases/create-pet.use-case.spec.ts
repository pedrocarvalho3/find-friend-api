import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets.repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreatePetUseCase } from './create-pet.use-case'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs.repository'
import { Decimal } from '@prisma/client/runtime/library'
import {
  DependencyLevel,
  EnergyLevel,
  Environment,
  PetAge,
  PetSize,
} from '@prisma/client'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: CreatePetUseCase

describe('Create Pet Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new CreatePetUseCase(petsRepository, orgsRepository)
  })

  it('should be able to create a pet', async () => {
    orgsRepository.items.push({
      id: 'org-1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
      author_name: 'John Doe',
      whatsapp: '11999999999',
      cep: '12345678',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Bairro',
      street: 'Rua',
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
    })

    const { pet } = await sut.execute({
      name: 'John Doe',
      about: 'John Doe',
      age: PetAge.ELDERLY,
      size: PetSize.SMALL,
      energy_level: EnergyLevel.VERY_LOW,
      environment: Environment.SMALL_SPACE,
      dependency_level: DependencyLevel.LOW,
      adoption_requirements: ['olá', 'teste', 'cu'],
      photos: ['olá', 'teste', 'cu'],
      orgId: 'org-1',
    })

    expect(pet.id).toEqual(expect.any(String))
  })
})
