import { faker } from '@faker-js/faker'
import type { EnergyLevel, Environment, PetSize } from '@prisma/client'

type Overwrite = {
  org_id?: string
  age?: string
  size?: PetSize
  energy_level?: EnergyLevel
  environment?: Environment
}

export function makePet(overwrite?: Overwrite) {
  return {
    id: crypto.randomUUID(),
    org_id: overwrite?.org_id ?? crypto.randomUUID(),
    name: faker.animal.dog(),
    about: faker.lorem.paragraph(),
    age: overwrite?.age ?? faker.number.int().toString(),
    size:
      overwrite?.size ??
      (faker.helpers.arrayElement(['SMALL', 'MEDIUM', 'LARGE']) as PetSize),
    energy_level:
      overwrite?.energy_level ??
      (faker.helpers.arrayElement([
        'ONE',
        'TWO',
        'THREE',
        'FOUR',
        'FIVE',
      ]) as EnergyLevel),

    environment:
      overwrite?.environment ??
      (faker.helpers.arrayElement([
        'SMALL_SPACE',
        'MEDIUM_SPACE',
        'LARGE_SPACE',
      ]) as Environment),
  }
}
