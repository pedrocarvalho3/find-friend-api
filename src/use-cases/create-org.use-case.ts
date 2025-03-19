import bcrypt from 'bcryptjs'
import type { Org } from '@prisma/client'
import type { OrgsRepository } from '@/repositories/orgs-repository'
import { OrgAlreadyExistsError } from './errors/org-already-exists-error'

interface CreateOrgUseCaseRequest {
  name: string
  email: string
  author_name: string
  whatsapp: string
  password: string

  cep: string
  state: string
  city: string
  neighborhood: string
  street: string
  latitude: number
  longitude: number
}

interface CreateOrgUseCaseResponse {
  org: Org
}

export class CreateOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    name,
    email,
    password,
    author_name,
    whatsapp,
    cep,
    state,
    city,
    neighborhood,
    street,
    latitude,
    longitude,
  }: CreateOrgUseCaseRequest): Promise<CreateOrgUseCaseResponse> {
    const password_hash = await bcrypt.hash(password, 6)

    const userWithSameEmail = await this.orgsRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new OrgAlreadyExistsError()
    }

    const org = await this.orgsRepository.create({
      name,
      email,
      password_hash,
      author_name,
      whatsapp,
      cep,
      state,
      city,
      neighborhood,
      street,
      latitude,
      longitude,
    })

    return { org }
  }
}
