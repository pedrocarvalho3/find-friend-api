import type { PetsRepository } from '@/repositories/pets.repository'
import type { EnergyLevel, Environment, Pet, PetSize } from '@prisma/client'

interface SearchPetsUseCaseRequest {
  city: string
  age?: string
  size?: PetSize
  energy_level?: EnergyLevel
  environment?: Environment
}

interface SearchPetsUseCaseResponse {
  pets: Pet[]
}

export class SearchPetsUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    city,
    age,
    size,
    energy_level,
    environment,
  }: SearchPetsUseCaseRequest): Promise<SearchPetsUseCaseResponse> {
    const pets = await this.petsRepository.findAll({
      city,
      age,
      size,
      energy_level,
      environment,
    })

    return { pets }
  }
}
