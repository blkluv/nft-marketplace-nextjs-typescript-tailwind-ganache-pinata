import { CryptoHookFactory } from '@_types/hooks'
import useSWR from 'swr'

type AccountHookFactory = CryptoHookFactory<string, string>

export type UseAccountHook = ReturnType<AccountHookFactory>

//deps -> provider, ethereum, contract
export const hookFactory: AccountHookFactory = (deps) => (params) => {
  const swrRes = useSWR('web3/useAccount', () => {
    console.log(deps)
    console.log(params)
    return 'This is a test'
  })

  return swrRes
}

export const useAccount = hookFactory({
  ethereum: undefined,
  provider: undefined,
})
