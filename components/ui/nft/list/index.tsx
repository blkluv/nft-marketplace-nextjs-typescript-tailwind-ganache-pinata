import { FunctionComponent, PropsWithChildren } from 'react'
import NFTItem from '../item'
import { NFT, NFTAttribute, NFTMetaData } from '../../../../types/nft'
type NFTListProps = {
  nfts: NFT[] | undefined
}
const NFTList: FunctionComponent<NFTListProps> = ({ nfts }) => {
  return (
    <div className='mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none'>
      {nfts &&
        nfts.map((nft) => (
          <div
            key={nft.meta.image}
            className='flex flex-col rounded-lg shadow-lg overflow-hidden'
          >
            <NFTItem item={nft} />
          </div>
        ))}
    </div>
  )
}

export default NFTList
