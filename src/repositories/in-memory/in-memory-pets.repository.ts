import type { Pet, Prisma } from '@prisma/client'
import type { FindAllParams, PetsRepository } from '../pets.repository'
import { randomUUID } from 'node:crypto'
import { InMemoryOrgsRepository } from './in-memory-orgs.repository'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  constructor(private orgsRepository: InMemoryOrgsRepository) {}

  async findAll(params: FindAllParams): Promise<Pet[]> {
    const orgsByCity = this.orgsRepository.items.filter(
      (org) => org.city === params.city,
    )

    const pets = this.items
      .filter((item) => orgsByCity.some((org) => org.id === item.org_id))
      .filter((item) => (params.age ? item.age === params.age : true))
      .filter((item) => (params.size ? item.size === params.size : true))
      .filter((item) =>
        params.energy_level ? item.energy_level === params.energy_level : true,
      )
      .filter((item) =>
        params.environment ? item.environment === params.environment : true,
      )
      .filter((item) =>
        params.dependency_level
          ? item.dependency_level === params.dependency_level
          : true,
      )

    return pets
  }

  async findById(id: string): Promise<Pet | null> {
    return this.items.find((pet) => pet.id === id) || null
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet: Pet = {
      id: randomUUID(),
      ...data,
    }

    this.items.push(pet)

    return pet
  }
}
