import type { OrgsRepository } from '@/repositories/orgs.repository'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import type { Org } from '@prisma/client'

interface GetOrgProfileUseCaseRequest {
  orgId: number
}

interface GetOrgProfileUseCaseResponse {
  org: Org
}

export class GetOrgProfileUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    orgId,
  }: GetOrgProfileUseCaseRequest): Promise<GetOrgProfileUseCaseResponse> {
    const org = await this.orgsRepository.findById(orgId)

    if (!org) {
      throw new ResourceNotFoundError()
    }

    return {
      org,
    }
  }
}
