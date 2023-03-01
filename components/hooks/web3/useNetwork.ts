import { CryptoHookFactory } from '@_types/hooks'
import useSWR from 'swr'

type NetworkHookFactory = CryptoHookFactory<string, UseNetworkResponse>

export type UseNetworkHook = ReturnType<NetworkHookFactory>

type UseNetworkResponse = {
  isLoading: boolean
  isSurpported: boolean
  targetNetwork: string
  isConnectedToNetwork: boolean
}

const NETWORKS: { [k: string]: string } = {
  1: 'Ethereum Mainnet',
  3: 'Ropstein Testnet',
  4: 'Rinkeby Testnet',
  5: 'Goerli Testnet',
  42: 'Koven TestNet',
  56: 'Binance Smart Chain',
  1337: 'Ganache',
}

const targetId = process.env.NEXT_PUBLIC_TARGET_CHAIN_ID as string
const targetNetwork = NETWORKS[targetId]

//deps -> provider, ethereum, contract
export const hookFactory: NetworkHookFactory =
  ({ provider, isLoading }) =>
  () => {
    const { data, isValidating, ...swrRes } = useSWR(
      provider ? 'web3/useNetwork' : null,
      async () => {
        const chainId = (await provider?.getNetwork())!.chainId
        if (!chainId) {
          throw 'Cannot retrieve network. Please refresh browser.'
        }
        return NETWORKS[chainId]
      },
      {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
      }
    )

    const isSupported = data === targetNetwork

    return {
      ...swrRes,
      data,
      isValidating,
      targetNetwork,
      isSurpported: isSupported,
      isConnectedToNetwork: !isLoading && isSupported,
      isLoading: isLoading as boolean,
    }
  }
