import { CryptoHookFactory } from '@_types/hooks'
import { NFT } from '@_types/nft'
import { ethers } from 'ethers'
import useSWR from 'swr'

type OwnedNFTsHookFactory = CryptoHookFactory<NFT[], UseOwnedNFTsResponse>

export type UseOwnedNFTsHook = ReturnType<OwnedNFTsHookFactory>

type UseOwnedNFTsResponse = {

}
//deps -> provider, ethereum, contract
export const hookFactory: OwnedNFTsHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swrRes } = useSWR(
      contract ? 'web3/useOwnedNFTs' : null,
      async () => {
        const nfts = [] as NFT[]
        const coreNFTs = await contract!.getOwnedNFTs()

        for (let i = 0; i < coreNFTs.length; i++) {
          const item = coreNFTs[i]
          const tokenURI = await contract!.tokenURI(item.tokenId)
          const metaRes = await fetch(tokenURI)

          const meta = await metaRes.json()

          nfts.push({
            price: parseFloat(ethers.utils.formatEther(item.price)),
            tokenId: item.tokenId.toNumber(),
            creator: item.creator,
            isListed: item.isListed,
            meta,
          })
        }

        return nfts
      }
    )

    return { ...swrRes, data: data || [] }
  }
