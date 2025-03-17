export function makeRegisterOrgUseCase() {
  const orgsRepository = new OrgsRepository()

  const registerUseCase = new RegisterOrgUseCase(orgsRepository)

  return registerUseCase
}
