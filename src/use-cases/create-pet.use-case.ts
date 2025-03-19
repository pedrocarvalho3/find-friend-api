import type { OrgsRepository } from '@/repositories/orgs.repository'
import type { PetsRepository } from '@/repositories/pets.repository'
import type { $Enums, Pet } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

interface CreatePetUseCaseRequest {
  name: string
  about: string
  age: string
  size: $Enums.PetSize
  energy_level: $Enums.EnergyLevel
  environment: $Enums.Environment
  orgId: string
}

interface CreatePetUseCaseResponse {
  pet: Pet
}

export class CreatePetUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
  ) {}

  async execute({
    name,
    about,
    age,
    size,
    energy_level,
    environment,
    orgId,
  }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    const org = await this.orgsRepository.findById(orgId)

    if (!org) {
      throw new ResourceNotFoundError()
    }

    const pet = await this.petsRepository.create({
      name,
      about,
      age,
      size,
      energy_level,
      environment,
      org_id: orgId,
    })

    return { pet }
  }
}
