// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarket is ERC721URIStorage {

  using Counters for Counters.Counter;

  Counters.Counter private _listedItems; //How many NFTs are listed
  Counters.Counter private _tokenIds; //How many NFTs created in total

    struct NFTItem {
    uint tokenId;
    uint price;
    address creator;
    bool isListed;
  }

  uint public listingPrice = 0.025 ether;

  mapping(string => bool) private _usedTokenURIs;
  mapping(uint => NFTItem) private _idToNFTItem;

  event NFTItemCreated (
    uint tokenId,
    uint price,
    address creator,
    bool isListed
  );

  constructor() ERC721("CreaturesNFT", "CNFT") {}

  function  mintToken(string memory tokenURI, uint price) public payable returns (uint) {

    require(!tokenURIExists(tokenURI), "Token URI already exists");
    require(msg.value == listingPrice, "Price must be equal to listing price");

    _tokenIds.increment();
    _listedItems.increment();

    uint newTokenId = _tokenIds.current();

    _safeMint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, tokenURI);
    _createNFTItem(newTokenId, price);
    _usedTokenURIs[tokenURI] = true;

    return newTokenId;
  }

  function _createNFTItem(uint tokenId, uint price) private {
    require(price > 0, "Price must be at least 1 wei");
    _idToNFTItem[tokenId] = NFTItem(tokenId, price, msg.sender, true);

    emit NFTItemCreated(tokenId, price, msg.sender, true);
  }

  function getNFTItem(uint tokenId) public view returns (NFTItem memory) {
    return _idToNFTItem[tokenId];
  }

  function getListedItemsCount() public view returns (uint) {
    return _listedItems.current();
  }

  function tokenURIExists(string memory tokenURI) public view returns (bool) {
    return _usedTokenURIs[tokenURI] == true;
  }
}