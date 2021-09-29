// SPDX-License-Identifier: GPL-3.0


pragma solidity >=0.7.0 <0.9.0;

import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.3/contracts/token/ERC721/ERC721.sol';
import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.3/contracts/token/ERC20/ERC20.sol';


interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

/**
 * @title Game
 * @dev Create
 */
contract GameSetup {

    address private moderator;
    
    // event for EVM logging
    event ModSet(address indexed oldMod, address indexed newMod);
    
    modifier isModerator() {

        require(msg.sender == moderator, "Caller is not owner");
        _;
    }

    modifier isActive(uint _gameId) {
        
        require(idToGameInfo[_gameId].active == true, "Must be active game");
        _;
    }
    
    modifier isPending(uint _gameId) {
        require(idToGameInfo[_gameId].active == false, "Game has been started");
        _;
    }
    
    struct Game {
        address moderator;
        mapping(address => bool) exists;
        mapping(uint => address) players;
        mapping(uint => Card) deck;
        uint deckSize;
        uint size;
        bool active;
    }
    
    mapping(uint => Game) idToGameInfo;
    uint totalGames = 0;
    
    
    /**
     * @dev Set contract deployer as owner
     */
    constructor() {
        moderator = msg.sender;
        emit ModSet(address(0), moderator);
    }
    
    function createGame() public {
        
        idToGameInfo[totalGames].moderator = msg.sender; 
        idToGameInfo[totalGames].active = false;
        totalGames++;
    }

    function joinGame(uint _gameId) public isPending(_gameId) {
        require(
            idToGameInfo[_gameId].exists[msg.sender] != true
            ,"Player is already in the game"
        );
        
        uint size = idToGameInfo[_gameId].size;
        
        idToGameInfo[_gameId].exists[msg.sender] = true;
        idToGameInfo[_gameId].players[size] = msg.sender;
        idToGameInfo[_gameId].size++;
    }
    
    function leaveGame(uint _gameId, uint _playerIdx) public isPending(_gameId) {
        require(
            idToGameInfo[_gameId].players[_playerIdx] == msg.sender,
            "invalid player id"
        );
        delete idToGameInfo[_gameId].players[_playerIdx];
        delete idToGameInfo[_gameId].exists[msg.sender];
        idToGameInfo[_gameId].size--;
    }

    /**
     * @dev Change moderator
     * @param newModerator address of new owner
     */
    function changeMod(address newModerator) public isModerator {
        emit ModSet(moderator, newModerator);
        moderator = newModerator;
    }

    /**
     * @dev Return owner address 
     * @return address of owner
     */
    function getModerator() public view returns (address) {
        return moderator;
    }
    
    function getGameInfo(uint256 _gameId) public view returns (
            address,
            uint,
            bool
        ) {
            return (
                idToGameInfo[_gameId].moderator,
                idToGameInfo[_gameId].size,
                idToGameInfo[_gameId].active
            );
    }
    
    function getTotalGames() public view returns(uint) {
        return totalGames;
    }
    
    
    struct Card {
        address holder;
        string suit;
        uint index;
    }
    
    string[] suits = ['spades','hearts','clubs','diamonds'];
    uint[] ids = [1,2,3,4,5,6,7,8,9,10,11,12,13];
    
    mapping(uint => Card) cards;
    uint deckSize = 0;
    
    
    function initializeDeck(uint _gameId) internal {
        idToGameInfo[_gameId].deckSize = 0;
        for(uint i=0; i<suits.length; i++) {
            for(uint j=0; j<ids.length; j++) {
                idToGameInfo[_gameId]
                .deck[idToGameInfo[_gameId]
                .deckSize] = Card (
                    msg.sender,
                    suits[i],
                    ids[j]
                );
                idToGameInfo[totalGames].deckSize++;
            }
        }
    }
    
    event Started(uint _gameId);
    
    function startGame(uint _gameId) public isPending(_gameId) {
        idToGameInfo[_gameId].active = true;
        initializeDeck(_gameId);
        emit Started(_gameId);
    }
    
    // front end will calculate random number within deck size
    function deal(uint _gameId, uint[] memory _cardId) public isActive(_gameId) {
        require(
            idToGameInfo[_gameId].size == _cardId.length
            ,"number of cards must match game size"
        );
        for (uint i=0; i<_cardId.length; i++) {
            address player = idToGameInfo[_gameId].players[i];
            idToGameInfo[_gameId].deck[_cardId[i]].holder = player;
        }
    }

}