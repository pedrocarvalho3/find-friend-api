import type { Pet, Prisma } from '@prisma/client'
import type { PetsRepository } from '../pets.repository'
import { randomUUID } from 'node:crypto'
import { InMemoryOrgsRepository } from './in-memory-orgs.repository'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  constructor(
    private orgsRepository: InMemoryOrgsRepository = new InMemoryOrgsRepository(),
  ) {}

  async findManyByCity(city: string): Promise<Pet[]> {
    return this.items.filter((pet) => {
      const org = this.orgsRepository.items.find((org) => org.id === pet.org_id)
      return org?.city.toLowerCase() === city.toLowerCase()
    })
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
