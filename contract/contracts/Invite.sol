// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";


contract Invite is ERC721, ERC721Enumerable, Ownable, IERC2981 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    event TokenMinted(address indexed recipient, uint256 tokenId);


    string public INVITE_PROVENANCE = "";
    string public LICENSE_TEXT = "";

    uint256 public constant MAX_INVITES = 300;
    bool public saleIsActive = true;
    bool public transfersAllowed = false;

    string private _baseTokenURI;
    address royaltyReceiver = owner();
    uint256 royaltyPercentage = 10;

    constructor(string memory baseTokenURI) ERC721("Invite", "INV") {
        _baseTokenURI = baseTokenURI;
    }
    function totalSupply() public view virtual override returns (uint256) {
    return _tokenIdCounter.current();
    }

    function mintTo(address recipient) public onlyOwner {
    require(_tokenIdCounter.current() < MAX_INVITES, "Max invites reached");
    uint256 newTokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(recipient, newTokenId);
    emit TokenMinted(recipient, newTokenId);  // Emitting the event
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return string(abi.encodePacked(_baseTokenURI, uintToString(tokenId)));
    }
    function royaltyInfo(uint256 _tokenId, uint256 salePrice) external view override returns (address receiver, uint256 royaltyAmount) {
        return (royaltyReceiver, (salePrice * royaltyPercentage) / 100);
    }
    function withdraw() public onlyOwner {
        require(address(this).balance > 0, "Balance is 0");
        payable(owner()).transfer(address(this).balance);
    }

    function setProvenanceHash(string memory provenanceHash) public onlyOwner {
        INVITE_PROVENANCE = provenanceHash;
    }

    function flipSaleState() public onlyOwner {
        saleIsActive = !saleIsActive;
    }

    function flipTransferState() public onlyOwner {
        transfersAllowed = !transfersAllowed;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        require(transfersAllowed || from == address(0), "Transfers are not allowed yet");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable,IERC165)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // Helper function to convert uint to string
    function uintToString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 tempValue = value;
        uint256 length = 0;
        while (tempValue != 0) {
            length++;
            tempValue /= 10;
        }
        bytes memory buffer = new bytes(length);
        while (value != 0) {
            length--;
            buffer[length] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
