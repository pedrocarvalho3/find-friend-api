import type {
  EnergyLevel,
  Environment,
  Pet,
  PetSize,
  Prisma,
} from '@prisma/client'

export interface FindAllParams {
  city: string
  age?: string
  size?: PetSize
  energy_level?: EnergyLevel
  environment?: Environment
}

export interface PetsRepository {
  findAll(params: FindAllParams): Promise<Pet[]>
  findById(id: string): Promise<Pet | null>
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}
