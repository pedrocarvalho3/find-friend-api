import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets.repository'
import { SearchPetsUseCase } from '../search-pets.use-case'

export function makeSearchPetsUseCase() {
  const petsRepository = new PrismaPetsRepository()

  const useCase = new SearchPetsUseCase(petsRepository)

  return useCase
}
