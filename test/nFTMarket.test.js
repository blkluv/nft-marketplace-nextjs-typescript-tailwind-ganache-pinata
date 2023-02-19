const { assert } = require('console')
const { before, describe, it } = require('node:test')

const NFTMarket = artifacts.require('NFTMarket')

contract('NFTMarket', (accounts) => {
  let _contract = null

  before(async () => {
    _contract = await NFTMarket.deployed()
    console.log(accounts)
  })

  describe('Mint token', () => {
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
  })
})
