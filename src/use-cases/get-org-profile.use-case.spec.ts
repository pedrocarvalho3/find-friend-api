import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs.repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetOrgProfileUseCase } from './get-org-profile.use-case'
import { makeOrg } from 'tests/factories/make-org.factory'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

let orgsRepository: InMemoryOrgsRepository
let sut: GetOrgProfileUseCase

describe('Get Org Profile Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new GetOrgProfileUseCase(orgsRepository)
  })

  it('should be able to get org profile', async () => {
    const createdOrg = await orgsRepository.create(
      makeOrg({ name: 'John Doe' }),
    )
    const { org } = await sut.execute({
      orgId: createdOrg.id,
    })
    expect(org.name).toEqual('John Doe')
  })

  it('should not be able to get org profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        orgId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
