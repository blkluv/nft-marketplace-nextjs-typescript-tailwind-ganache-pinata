import { CryptoHookFactory } from '@_types/hooks'
import { NFT } from '@_types/nft'
import { ethers } from 'ethers'
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import useSWR from 'swr'

type OwnedNFTsHookFactory = CryptoHookFactory<NFT[], UseOwnedNFTsResponse>

export type UseOwnedNFTsHook = ReturnType<OwnedNFTsHookFactory>

type UseOwnedNFTsResponse = {
  ListNFT: (tokenId: number, price: number) => Promise<void>
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

    const _contract = contract
    const ListNFT = useCallback(
      async (tokenId: number, price: number) => {
        try {
          const result = await _contract!.sellNFT(
            tokenId,
            ethers.utils.parseEther(price.toString()),
            { value: ethers.utils.parseEther((0.025).toString()) }
          )

          const res = await toast.promise(result?.wait(), {
            pending: 'Processing Transaction',
            success: 'Item has been listed',
            error: 'Processing error',
          })

        } catch (e: any) {
          console.error(e.message)
        }
      },
      [_contract]
    )

    return { ...swrRes, ListNFT, data: data || [] }
  }
