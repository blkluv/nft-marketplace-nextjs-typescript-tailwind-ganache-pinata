import { type } from 'os'

export type Trait = 'attack' | 'health' | 'speed'

export type NFTAttribute = {
  trait_type: Trait
  value: string
}

export type NFTMetaData = {
  name: string
  description: string
  image: string
  attributes: NFTAttribute[]
}

export type NFTCore = {
  tokenId: number
  price: number
  creator: string
  isListed: boolean
}

export type NFT = {
  meta: NFTMetaData
} & NFTCore
