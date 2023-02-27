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

export type FileRequest = {
  bytes: Uint8Array
  contentType: string
  fileName: string
}

export type PinataResponse = {
  ipfsHash: string
  PinSize: number
  Timestamp: string
  isDuplicate: true
}