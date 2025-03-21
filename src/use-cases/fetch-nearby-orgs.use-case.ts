import type { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs.repository'
import type { Org } from '@prisma/client'

interface FetchNearbyOrgsUseCaseRequest {
  userLatitude: number
  userLongitude: number
}

interface FetchNearbyOrgsUseCaseResponse {
  orgs: Org[]
}

export class FetchNearbyOrgsUseCase {
  constructor(private orgsRepository: InMemoryOrgsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyOrgsUseCaseRequest): Promise<FetchNearbyOrgsUseCaseResponse> {
    const orgs = await this.orgsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return {
      orgs,
    }
  }
}
