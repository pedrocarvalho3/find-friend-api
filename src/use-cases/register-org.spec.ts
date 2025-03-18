import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { compare } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterOrgUseCase } from './register-org'
import { OrgAlreadyExistsError } from './errors/org-already-exists-error'

let orgsRepository: InMemoryOrgsRepository
let sut: RegisterOrgUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new RegisterOrgUseCase(orgsRepository)
  })

  it('should to register', async () => {
    const { org } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      author_name: 'John Doe',
      whatsapp: '11999999999',
      cep: '12345678',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Bairro',
      street: 'Rua',
      latitude: 0,
      longitude: 0,
    })

    expect(org.id).toEqual(expect.any(String))
  })

  it('should hash org password upon registration', async () => {
    const { org } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      author_name: 'John Doe',
      whatsapp: '11999999999',
      cep: '12345678',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Bairro',
      street: 'Rua',
      latitude: 0,
      longitude: 0,
    })

    const isPasswordCorrectlyHashed = await compare('123456', org.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'johndoe@example.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
      author_name: 'John Doe',
      whatsapp: '11999999999',
      cep: '12345678',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Bairro',
      street: 'Rua',
      latitude: 0,
      longitude: 0,
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        password: '123456',
        author_name: 'John Doe',
        whatsapp: '11999999999',
        cep: '12345678',
        state: 'SP',
        city: 'São Paulo',
        neighborhood: 'Bairro',
        street: 'Rua',
        latitude: 0,
        longitude: 0,
      }),
    ).rejects.toBeInstanceOf(OrgAlreadyExistsError)
  })
})
