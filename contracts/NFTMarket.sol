// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarket is ERC721URIStorage {

  using Counters for Counters.Counter;

  Counters.Counter private _listedItems; //How many NFTs are listed
  Counters.Counter private _tokenIds; //How many NFTs created in total

  constructor() ERC721("CreaturesNFT", "CNFT") {

  }

  function  mintToken(string memory tokenURI) public payable returns (uint) {
    _tokenIds.increment();
    _listedItems.increment();

    uint newTokenId = _tokenIds.current();

    _safeMint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, tokenURI);

    return newTokenId;
  }
}