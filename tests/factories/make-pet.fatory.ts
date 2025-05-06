import { faker } from '@faker-js/faker'
import type {
  DependencyLevel,
  EnergyLevel,
  Environment,
  PetAge,
  PetSize,
} from '@prisma/client'

type Overwrite = {
  org_id?: string
  age?: PetAge
  size?: PetSize
  energy_level?: EnergyLevel
  dependency_level?: DependencyLevel
  environment?: Environment
}

export function makePet(overwrite?: Overwrite) {
  return {
    id: crypto.randomUUID(),
    org_id: overwrite?.org_id ?? crypto.randomUUID(),
    name: faker.animal.dog(),
    about: faker.lorem.paragraph(),
    age:
      overwrite?.age ??
      (faker.helpers.arrayElement(['PUPPY', 'ADULT', 'ELDERLY']) as PetAge),
    size:
      overwrite?.size ??
      (faker.helpers.arrayElement(['SMALL', 'MEDIUM', 'LARGE']) as PetSize),
    energy_level:
      overwrite?.energy_level ??
      (faker.helpers.arrayElement([
        'VERY_LOW',
        'LOW',
        'MEDIUM',
        'HIGH',
        'VERY_HIGH',
      ]) as EnergyLevel),
    dependency_level:
      overwrite?.dependency_level ??
      (faker.helpers.arrayElement([
        'VERY_LOW',
        'LOW',
        'MEDIUM',
        'HIGH',
        'VERY_HIGH',
      ]) as DependencyLevel),
    environment:
      overwrite?.environment ??
      (faker.helpers.arrayElement([
        'SMALL_SPACE',
        'MEDIUM_SPACE',
        'LARGE_SPACE',
      ]) as Environment),
    // photos: [
    //   faker.image.urlPicsumPhotos(),
    //   faker.image.urlPicsumPhotos(),
    //   faker.image.urlPicsumPhotos(),
    // ],
    // adoption_requirements: [
    //   faker.lorem.sentence(),
    //   faker.lorem.sentence(),
    //   faker.lorem.sentence(),
    // ],
  }
}
