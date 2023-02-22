import { CryptoHookFactory } from '@_types/hooks'
import useSWR from 'swr'

type ListedNFTsHookFactory = CryptoHookFactory<any, UseListedNFTsResponse>

export type UseListedNFTsHook = ReturnType<ListedNFTsHookFactory>

type UseListedNFTsResponse = {
  connect: () => void
  isLoading: boolean
  isInstalled: boolean
}
//deps -> provider, ethereum, contract
export const hookFactory: ListedNFTsHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swrRes } = useSWR(
      contract ? 'web3/useListedNFTs' : null,
      async () => {
        const nfts = [] as any 
        return nfts
      },
      {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
      }
    )

    return { ...swrRes, data }
  }
