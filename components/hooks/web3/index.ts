import { useHooks } from '@providers/web3'

export const useAccount = () => {
  const hooks = useHooks()
  const swrRes = hooks.useAccount()
  return {
    account: swrRes,
  }
}

export const useNetwork = () => {
  const hooks = useHooks()
  const swrRes = hooks.useNetwork()

  return {
    network: swrRes,
  }
}

export const useListedNFTs = () => {
  const hooks = useHooks()
  const swrRes = hooks.useListedNFTs()

  return {
    nfts: swrRes,
  }
}

export const useOwnedNFTs = () => {
  const hooks = useHooks()
  const swrRes = hooks.useOwnedNFTs()

  return {
    nfts: swrRes,
  }
}
