const instance = await NFTMarket.deployed()

instance.mintToken('https://gateway.pinata.cloud/ipfs/QmSkCTwqaLR6WPfV9WgC3EN1pQJhdWZy8dV48eX8yqWUE6?_gl=1*pkkm3y*_ga*ODMwNzE0NTg2LjE2NzcxNzE2NjM.*_ga_5RMPXG14TE*MTY3NzE4MjY3OC4yLjEuMTY3NzE4MzEwMS42MC4wLjA.','50000000000000000',{ value: '25000000000000000', from: accounts[0]})

instance.mintToken('https://gateway.pinata.cloud/ipfs/QmXSXKA2pqsEEEMACejUKdNHakrxNTguz3pi9Nrabx8itf?_gl=1*pkkm3y*_ga*ODMwNzE0NTg2LjE2NzcxNzE2NjM.*_ga_5RMPXG14TE*MTY3NzE4MjY3OC4yLjEuMTY3NzE4MzEwMS42MC4wLjA.',
'50000000000000000',{ value: '25000000000000000', from: accounts[0]})
