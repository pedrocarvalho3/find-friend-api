import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs.repository'
import { CreateOrgUseCase } from '../create-org.use-case'

export function makeCreateOrgUseCase() {
  const orgsRepository = new PrismaOrgsRepository()

  const useCase = new CreateOrgUseCase(orgsRepository)

  return useCase
}
