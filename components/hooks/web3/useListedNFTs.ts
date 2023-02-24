import { CryptoHookFactory } from '@_types/hooks'
import { NFT } from '@_types/nft'
import { ethers } from 'ethers'
import { useCallback } from 'react'
import useSWR from 'swr'

type ListedNFTsHookFactory = CryptoHookFactory<NFT[], UseListedNFTsResponse>

export type UseListedNFTsHook = ReturnType<ListedNFTsHookFactory>

type UseListedNFTsResponse = {
  BuyNFT: (tokenId: number, value: number) => Promise<void>
}
//deps -> provider, ethereum, contract
export const hookFactory: ListedNFTsHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swrRes } = useSWR(
      contract ? 'web3/useListedNFTs' : null,
      async () => {
        const nfts = [] as NFT[]
        const coreNFTs = await contract!.getAllNFTsOnSale()

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

    const _contract = contract
    const BuyNFT = useCallback(
      async (tokenId: number, value: number) => {
        try {
          const result = await _contract!.buyNFT(tokenId, {
            value: ethers.utils.parseEther(value.toString()),
          })

          await result?.wait()
          alert('You have bought the NFT. See Profile Page')
        } catch (e: any) {
          console.error(e.message)
        }
      },
      [_contract]
    )

    return { ...swrRes, BuyNFT, data: data || [] }
  }
