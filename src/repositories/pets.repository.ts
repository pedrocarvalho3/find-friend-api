import type { Pet, Prisma } from '@prisma/client'

export interface PetsRepository {
  findManyByCity(city: string): Promise<Pet[]>
  findById(id: string): Promise<Pet | null>
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}
