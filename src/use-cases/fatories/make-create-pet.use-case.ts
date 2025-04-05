import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets.repository'
import { CreatePetUseCase } from '../create-pet.use-case'
import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs.repository'

export function makeCreatePetUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const orgsRepository = new PrismaOrgsRepository()

  const useCase = new CreatePetUseCase(petsRepository, orgsRepository)

  return useCase
}
