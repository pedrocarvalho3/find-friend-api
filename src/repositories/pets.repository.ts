import type {
  DependencyLevel,
  EnergyLevel,
  Environment,
  Pet,
  PetAge,
  PetSize,
  Prisma,
} from '@prisma/client'

export interface FindAllParams {
  city: string
  age?: PetAge
  size?: PetSize
  energy_level?: EnergyLevel
  environment?: Environment
  dependency_level?: DependencyLevel
}

export interface PetsRepository {
  findAll(params: FindAllParams): Promise<Pet[]>
  findById(id: string): Promise<Pet | null>
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}
