import { FunctionComponent, PropsWithChildren } from 'react'
import NFTItem from '../item'
import { useListedNFTs } from '@hooks/web3'
const NFTList: FunctionComponent = () => {
  const { nfts } = useListedNFTs()
  return (
    <div className='mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none'>
      {nfts.data &&
        nfts.data.map((nft) => (
          <div
            key={nft.meta.image}
            className='flex flex-col rounded-lg shadow-lg overflow-hidden'
          >
            <NFTItem item={nft} BuyNFT={nfts.BuyNFT} />
          </div>
        ))}
    </div>
  )
}

export default NFTList
