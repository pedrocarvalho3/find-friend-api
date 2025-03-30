import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets.repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchPetsUseCase } from './search-pets.use-case'

import { makePet } from 'tests/factories/make-pet.fatory'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs.repository'
import { makeOrg } from 'tests/factories/make-org.factory'
import { EnergyLevel, Environment, PetSize } from '@prisma/client'

describe('Search Pets Use Case', () => {
  let orgsRepository: InMemoryOrgsRepository
  let petsRepository: InMemoryPetsRepository
  let sut: SearchPetsUseCase

  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new SearchPetsUseCase(petsRepository)
  })

  it('should be able to search pets by city', async () => {
    const org = await orgsRepository.create(makeOrg())

    await petsRepository.create(makePet({ org_id: org.id }))
    await petsRepository.create(makePet({ org_id: org.id }))

    const org2 = await orgsRepository.create(makeOrg())

    await petsRepository.create(makePet({ org_id: org2.id }))

    const { pets } = await sut.execute({ city: org.city })

    expect(pets).toHaveLength(2)

    const { pets: pets2 } = await sut.execute({ city: org2.city })

    expect(pets2).toHaveLength(1)
  })

  it('should be able to search pets by city and age', async () => {
    const org = await orgsRepository.create(makeOrg())

    await petsRepository.create(makePet({ org_id: org.id, age: '1' }))
    await petsRepository.create(makePet({ org_id: org.id }))

    const { pets } = await sut.execute({ city: org.city, age: '1' })

    expect(pets).toHaveLength(1)
  })

  it('should be able to search pets by city and size', async () => {
    const org = await orgsRepository.create(makeOrg())

    await petsRepository.create(
      makePet({ org_id: org.id, size: PetSize.SMALL }),
    )
    await petsRepository.create(
      makePet({ org_id: org.id, size: PetSize.MEDIUM }),
    )
    await petsRepository.create(
      makePet({ org_id: org.id, size: PetSize.LARGE }),
    )

    const { pets } = await sut.execute({ city: org.city, size: PetSize.SMALL })

    expect(pets).toHaveLength(1)
  })

  it('should be able to search pets by city and energy level', async () => {
    const org = await orgsRepository.create(makeOrg())

    await petsRepository.create(
      makePet({ org_id: org.id, energy_level: EnergyLevel.ONE }),
    )
    await petsRepository.create(
      makePet({ org_id: org.id, energy_level: EnergyLevel.TWO }),
    )
    await petsRepository.create(
      makePet({ org_id: org.id, energy_level: EnergyLevel.THREE }),
    )
    await petsRepository.create(
      makePet({ org_id: org.id, energy_level: EnergyLevel.FOUR }),
    )
    await petsRepository.create(
      makePet({ org_id: org.id, energy_level: EnergyLevel.FIVE }),
    )

    const { pets } = await sut.execute({
      city: org.city,
      energy_level: EnergyLevel.ONE,
    })

    expect(pets).toHaveLength(1)
  })

  it('should be able to search pets by city and environment', async () => {
    const org = await orgsRepository.create(makeOrg())

    await petsRepository.create(
      makePet({ org_id: org.id, environment: Environment.SMALL_SPACE }),
    )
    await petsRepository.create(
      makePet({ org_id: org.id, environment: Environment.SMALL_SPACE }),
    )
    await petsRepository.create(
      makePet({ org_id: org.id, environment: Environment.MEDIUM_SPACE }),
    )
    await petsRepository.create(
      makePet({ org_id: org.id, environment: Environment.LARGE_SPACE }),
    )

    const { pets } = await sut.execute({
      city: org.city,
      environment: Environment.SMALL_SPACE,
    })

    expect(pets).toHaveLength(2)
  })
})
