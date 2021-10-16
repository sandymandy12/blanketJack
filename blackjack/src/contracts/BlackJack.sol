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

contract Game {
    
    address admin;
    
    address[] public players;
    address[] public winners;
    
    uint public minimumBet;
    mapping(address => bool) paid; 
    
    modifier isPlayer {
        bool involved = false;
        for (uint p = 0; p < players.length; p++) {
            if(players[p] == msg.sender) {
                involved = true;
            }
        }
        
        require(involved == true, 'address not involved');
        _;
    }
    modifier isWinner {
        bool winner = false;
        for (uint p = 0; p < winners.length; p++) {
            if(winners[p] == msg.sender) {
                winner = true;
            }
        }
        
        require(winner == true, 'not a winner');
        _;
    }
    
    struct Card {
        address holder;
        uint suit;
        uint index;
    }
    
    mapping(address => Card[]) deck;
    mapping(address => uint) bets;
    mapping(string => bool) used;
    

    constructor() {
        admin = msg.sender;
    }
    
    function addPlayer(address _addr) public {
        players.push(_addr);
    }
    
    function size() public view returns(uint) {
        return players.length;
    }
    
    function totalBets() public view returns(uint) {
        uint total = 0;
        for(uint i=0; i<players.length; i++) {
            address player = players[i];
            total += bets[player];
        }
        return total;
    }
    
    function getBet(address _addr) public view returns(uint) {
        return bets[_addr];
    }
    
    function setBet(address _addr, uint _bet) public {
        bets[_addr] = _bet;
    }
    
    function setMinimumBet(uint _amount) public {
        minimumBet = _amount;
    }
    
    function addCard(address player, uint suit, uint index) public {
        Card memory card = Card(player, suit, index);
        require(deck[player].length < 2, 'hand is full');
        deck[player].push(card);
        used[string(abi.encodePacked(suit, index))] = true;
    }
    
    function getPlayer(uint _idx) public view returns(address) {
        return players[_idx];
    }
    
    function isUsed(string memory _card) public view returns(bool) {
        return used[_card];
    }
    
    function getHand(address _addr) public view returns (Card[] memory) {
        return deck[_addr];
    }
    
    function setWinner(address _addr) public {
        bool added = false;
        for (uint w=0; w < winners.length; w++) {
            if(winners[w] == _addr) {
                added = true;
            }
        }
        
        require(added = false, "already added");
        winners.push(_addr);
    }
    
    function getWinner() public view returns(address[] memory) {
        return winners;
    }
    
    function alreadyPaid(address _addr) public view returns(bool) {
        return paid[_addr];
    }
    
    function setPaid() public isWinner {
        paid[msg.sender] = true;
    }
}

/**
 * @title Blackjack
 */
contract Blackjack is Game {
    
    
    uint suits = 4;
    uint ids = 13;
    
    mapping(uint => Game) games;
    mapping(uint => Card) allCards;
    uint totalGames = 0;
    
    constructor() {
    
        
        uint deckSize = 0;
        
        for(uint suit=0; suit<suits; suit++) {
            for(uint id=0; id<ids; id++) {
                allCards[deckSize] = Card(
                    address(0),
                    suit,
                    id
                );
                deckSize++;
            }
        }
    
    }
    
    function getGameInfo(uint _gameIdx) public view returns(uint[3] memory){
        uint total = games[_gameIdx].totalBets();
        uint size = games[_gameIdx].size();
        uint min = games[_gameIdx].minimumBet();
        
        return [total, size, min];
        
    }
    function getTotalGames() public view returns (uint) {
        return totalGames;
    }
    
    function create() public {
        
        games[totalGames] = new Game();
        totalGames++;
    }
    
    function getBet(uint gameIdx, address player) public view returns(uint) {
        return games[gameIdx].getBet(player);
    }
    
    function getBuyIn(uint gameIdx) public view returns(uint) {
        return games[gameIdx].minimumBet();
    }
    
    function join(uint gameIdx) public payable {

        if(games[gameIdx].size() == 0) {
            games[gameIdx].setMinimumBet(msg.value);
        }
        
        require(msg.value >= games[gameIdx].minimumBet(), "bet not enough");
        
        games[gameIdx].addPlayer(msg.sender);
        games[gameIdx].setBet(msg.sender, msg.value);
        
    }
    
    function start(uint gameIdx) public {
        
        require(games[gameIdx].size() > 0, 'not enough players');
        
        for (uint player = 0; player < games[gameIdx].size(); player++) {
            
            address addr = games[gameIdx].getPlayer(player);

            Card memory card = dealCard(gameIdx);
            games[gameIdx].addCard(addr, card.suit, card.index); // 0 is the suit, 1 is the id value
            
            
        }
        
        

    }
    
    function deal(uint gameIdx) public returns(address[] memory) {
    
        Game game = games[gameIdx];
        
        uint highest = 0;
        
        // dealing last card
        for (uint p = 0; p < games[gameIdx].size(); p++) {
    
            address player = game.getPlayer(p);
            Card memory lastCard = dealCard(gameIdx);
            game.addCard(player, lastCard.suit, lastCard.index);
            
            Card[] memory hand = game.getHand(player);
            uint value = handValue(hand);
            
            if (value >= highest) {
                highest = value;
                games[gameIdx].setWinner(player);
            }
            
        }
        
        games[gameIdx] = game;
        
        return(games[gameIdx].getWinner());
        
        
    }
    
    function payout(uint gameIdx) external payable isWinner {
        Game game = games[gameIdx];
        
        require(game.alreadyPaid(msg.sender) == false,
            'player already paid out'
        );
        
        address[] memory w = game.getWinner();
        
        uint amount = game.totalBets() / w.length;
        
        payable(msg.sender).transfer(amount);
        
        game.setPaid();
        
        games[gameIdx] = game;        
    }
    
    function handValue(Card[] memory hand) internal view returns (uint) {
        uint suit_value = 0;
        uint index_value = 0;
        

        for (uint suit = 0; suit < suits; suit++) {
            if ( hand[0].suit == suit || hand[1].suit == suit) {
                suit_value += suit;
            }
        }
        
        for (uint index = 0; index < ids; index++) {
           if (hand[0].index == ids || hand[1].index == ids) {
                index_value += index;
           }
        }
        

        return (suit_value + index_value);
        
        
    }
    
    function dealCard(uint gameIdx) internal view returns (Card memory) {
        
        bool dealt = true;
        Card memory card;

        while(dealt) {
            uint cardIdx = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % 52;
            card = allCards[cardIdx];
            dealt = games[gameIdx].isUsed(string(abi.encodePacked(card.suit, card.index)));
        }
        
        return card;
        
    }
    
    
}
