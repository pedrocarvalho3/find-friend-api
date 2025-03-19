import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets.repository'
import { PetNotFoundError } from '@/use-cases/errors/pet-not-found.error'
import { GetPetUseCase } from './get-pet.use-case'
import { beforeEach, describe, expect, it } from 'vitest'
import { EnergyLevel, Environment, PetSize } from '@prisma/client'

describe('Get Pet Use Case', () => {
  let petsRepository: InMemoryPetsRepository
  let sut: GetPetUseCase

  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    sut = new GetPetUseCase(petsRepository)
  })

  it('should be able to get a new pet', async () => {
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
    const { pet } = await sut.execute({ id: 'pet-01' })

    expect(pet).toEqual(pet)
  })

  it('should not be able to get a non-existing pet', async () => {
    await expect(sut.execute({ id: 'invalid' })).rejects.toBeInstanceOf(
      PetNotFoundError,
    )
  })
})
