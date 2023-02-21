const { assert } = require('console')
const { before, describe, it } = require('node:test')
const { ethers } = require('ethers')
const truffleAssert = require('truffle-assertions')

const NFTMarket = artifacts.require('NFTMarket')

contract('NFTMarket', (accounts) => {
  let _contract = null
  let _nftPrice = ethers.utils.parseEther('0.3').toString()

  before(async () => {
    _contract = await NFTMarket.deployed()
    console.log(accounts)
  })

  describe('Mint token', { concurrency: 2 }, async () => {
    const tokenURI = 'https://test.com'
    before(async () => {
      await _contract.mintToken(tokenURI, {
        from: accounts[0],
      })
    })

    it('Owner of first token should be address [0]', async () => {
      const owner = await _contract.ownerOf(1)
      assert(
        owner == '0xB4a8A32aF2Fb76894A0551836894E556d4aae9c2',
        'Owner of token does not match address[0]'
      )
    })

    it('First token should point to the next tokenUri', async () => {
      const actualTokenURI = await _contract.tokenURI(1)
      assert.equal(actualTokenURI, tokenURI, 'TokenURI is not correctly set')
    })

    it('Should not be possible to create a NFT with used tokenURI', async () => {
      await _contract.mintToken(tokenURI, {
        from: accounts[0],
      })
      //assert.equal(actualTokenURI, tokenURI, 'TokenURI is not correctly set')

      await truffleAssert.fails(
        _contract.mintToken(tokenURI),
        truffleAssert.ErrorType.REVERT,
        'Token URI already exists'
      )
    })

    it('should have one listed item', async () => {
      const listedItemCount = await _contract.getListedItemsCount()
      assert.equal(listedItemCount.toNumber(), 1, 'Listem items count is not 1')
    })

    it('should have create NFT item', async () => {
      const listedItemCount = await _contract.getNFTItem(1)

      assert.equal(nftItem.tokenId, 1, 'TokenId is not one 1')
      assert.equal(nftItem.price, _nftPrice, 'NFTPrice is not correct')
      assert.equal(nftItem.creator, accounts[0], 'Creator is not account[0]')
      assert.equal(nftItem.isListed, true, 'Token is not listed')
    })
  })

  describe('Buy NFT', { concurrency: 2 }, () => {
    before(async () => {
      await _contract.buyNFT(1, {
        from: accounts[1],
        value: _nftPrice,
      })
    })

    it('Should unlist the item', async () => {
      const listedItem = await _contract.getNFTItem(1)
      assert.equal(listedItem.isListed, false, 'Item is still listed')
    })

    it('Should decrease listed item count', async () => {
      const listedItemsCount = await _contract.getListedItemsCount()
      assert.equal(
        listedItemsCount.toNumber(),
        0,
        'Count has not ben decremeented'
      )
    })

    it('Should change the owner', async () => {
      const currentOwner = await _contract.ownerOf(1)
      assert.equal(currentOwner, accounts[1], 'Owner not changing')
    })
  })

  describe('token transfers', () => {
    const tokenURI = 'https://test-json-2.com'
    before(async () => {
      await _contract.mintToken(tokenURI, _nftPrice, {
        from: [accounts[0]],
        value: _listingPrice,
      })
    })

    it('Should have two NFTs created', async () => {
      const totalSupply = await _contract.totalSupply()
      assert.equal(
        totalSupply.toNumber(),
        2,
        'Total supply of token is not correct'
      )
    })

    it('Should be able to retrieve NFTs by index', async () => {
      const nftId1 = await _contract.tokenByIndex(0)
      const nftId2 = await _contract.tokenByIndex(1)
      assert.equal(nftId1.toNumber(), 1, 'NFTId is wrong')
      assert.equal(nftId2.toNumber(), 2, 'NFTId is wrong')
    })

    it('Should have one listed NFT', async () => {
      const allNFTs = await _contract.getAllNFTsOnSale()
      assert.equal(allNFTs[0].tokenId, 2, 'NFTId has a wrong Id')
    })

    it('Account[1] should have one owned NFT', async () => {
      const ownedNFTs = await _contract.getOwnedNFTs({ from: accounts[1] })
      assert.equal(ownedNFTs[0].tokenId, 1, 'NFTId has a wrong Id')
    })

    it('Account[0] should have one owned NFT', async () => {
      const ownedNFTs = await _contract.getOwnedNFTs({ from: accounts[0] })
      assert.equal(ownedNFTs[0].tokenId, 2, 'NFTId has a wrong Id')
    })
  })

  describe('Token transfer to new owner', async () => {
    before(async () => {
      await _contract.transferFrom(accounts[0], accounts[1], 2)
    })

    it('accounts[0] should own 0 tokens', async () => {
      const ownedNFTs = await _contract.getOwnedNFTs({
        from: accounts[0],
      })
      assert.equal(ownedNFTs.length, 0, 'Invalid length of tokens')
    })

    it('accounts[0] should own 2 tokens', async () => {
      const ownedNFTs = await _contract.getOwnedNFTs({
        from: accounts[1],
      })
      assert.equal(ownedNFTs.length, 1, 'Invalid length of tokens')
    })
  })
})
