// SPDX-License-Identifier: GPL-3.0


pragma solidity >=0.7.0 <0.9.0;

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

abstract contract Setup {
    
    address public admin;
    
    address[] public players;
    address[] public winners;
    
    uint public minimumBet;
    
    uint suits = 4;
    uint ids = 13;
    
    struct Card {
        address holder;
        uint suit;
        uint index;
    }
    
    mapping(uint => Card) allCards;
    mapping(address => Card[]) deck;
    mapping(address => uint) bets;
    mapping(address => bool) paid; 
    mapping(bytes32 => bool) used;
    
    event BetPlaced(address _better, uint _value);
    event CardDealt(address _player, Card _card);
    event PlayerPaid(address _player, uint _value);
    
    modifier dealing {
        require(current == Status.DEALING, "not dealing");
        _;
    }
    modifier payout {
        require(current == Status.PAYOUT, "payout not available");
        _;
    }
    modifier open {
        require(current == Status.OPEN, 'game not open');
        _;
    }
    modifier done {
        require(current == Status.DONE, 'game not done');
        _;
    }
    modifier fullyDealt {
        for (uint i=0; i<players.length; i++) {
            address player = players[i];
            require(deck[player].length > 1, 'not fully dealt');
        }
        _;
    }
    
    modifier isMinimum (uint _val) {
        require((bets[msg.sender] + msg.value) >= minimumBet,
        'bet not enough'
        );
        _;
    }
    
    enum Status { OPEN, DEALING, BETTING, PAYOUT, DONE }
    Status current;
    Status previous;

    function addPlayer(address _addr) public{ 
        require(current == Status.OPEN, "game not open");
        players.push(_addr);
    }
    function addCard(address player) public {
        require(deck[player].length < 2, 'hand is full');
        
        bool dealt = true;
        Card memory card;
        
        while(dealt) {
            uint cardIdx = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % 52;
            card = allCards[cardIdx];
            dealt = used[bytes32(abi.encodePacked(card.suit,'-' ,card.index))];
        }
        
        card = Card(player, card.suit, card.index);
        deck[player].push(card);
        used[bytes32(abi.encodePacked(card.suit, card.index))] = true;
        
        emit CardDealt(player, card);
    }
    
    function viewAdmin() external view returns(address _admin) {
        return admin;
    }
    function viewPlayer(uint index) public view returns(address) {
        return players[index];
    }
    function viewPlayers() public view returns(address[]memory) {
        return players;
    }
    
    function getHand(address _addr) public view returns (uint[2] memory) {
        Card[] memory card = deck[_addr];
        return [card[0].suit, card[0].index];
    }
    
    function balance() external view returns(uint _balance) {
        return address(this).balance;
    }
    function getMinimum() external view returns(uint _minimumBet) {
        return minimumBet;
    }
    function size() public view returns(uint _size) {
        return players.length;
    }
    function totalBets() public view returns(uint) {
        uint total = 0;
        for(uint i=0; i<players.length; i++) {
            total += bets[players[i]];
        }
        return total;
    }
    
    function currentStatus() external view returns(Status) {
        return current;
    }
    function setStatus(Status _status) public {
        if (previous != current) {
            previous = current;
        }
        current = _status;
    }
    
    uint needsbet = 0;
    address[] internal needsToRaise;
    function checkBets() public returns (address[] memory){
        needsbet = 0;
        for (uint i=0; i < players.length; i++) {
            
            address player = players[i];
            
            if (bets[player] < minimumBet) {
                needsToRaise[needsbet] = player;
                needsbet ++;
            }
        }
        if (needsbet == 0) {
            current = previous;
        }
        return needsToRaise;
    }
    
}

contract Game is Setup {
    
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
        bool _winner = false;
        for (uint p = 0; p < winners.length; p++) {
            if(winners[p] == msg.sender) {
                _winner = true;
            }
        }
        
        require(_winner == true, 'not a winner');
        _;
    }
    modifier isAdmin {
        require(msg.sender == admin, 'not admin');
        _;
    }
    
    
    constructor(address _creator) {
        admin = _creator;
        
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
        
        current = Status.OPEN;
    }
    
    function setBet(address _addr, uint _bet) external payable isMinimum(_bet) {

        bets[_addr] += _bet;
        minimumBet = bets[_addr];
        emit BetPlaced(_addr, _bet);
    }
    
    function start() public open {
        current = Status.DEALING;
    }

    function escrow() public payout {
        
        require(msg.sender == admin, 'only admin');
        require(current == Status.PAYOUT, 'only during payout');
        uint val = totalBets() / players.length;
        payable(msg.sender).transfer(val);
        
        paid[msg.sender] = true;
        emit PlayerPaid(msg.sender, val);
        
    }
    
    function handValue(Card[] memory hand) internal pure returns (uint[2] memory) {
        require(hand.length > 1, 'not enough cards');
        
        uint suit_value = hand[0].suit;
        
        uint index_value = 0;
        
        if (hand[1].suit > suit_value) {
            suit_value == hand[1].suit;
        }

        for (uint card = 0; card < hand.length; card++) {
            if (hand[card].index > 10) {
                index_value += 11;
            } else {
                index_value += hand[card].index;
            }
        }

        return [suit_value,  index_value];
        
        
    }
    
    
    function winner() public dealing fullyDealt returns(Card[] memory) {
        
        uint highest = 0;
        uint best_suit = 0;
        uint len = 0;
        Card[] memory potential;
        
        for (uint p = 0; p < players.length; p++) {
            
            address player = players[p];
            uint[2] memory hand = handValue( deck[player] );
            
            if (hand[1] >= highest && hand[1] <= 21) {
                
                highest == hand[1];
                
                if (hand[1] > highest) {
                    len == 0;
                    best_suit = 0;
                }
                
                if (hand[0] >= best_suit) {
                    best_suit = hand[0];
                } else {
                    continue;
                }
                
                potential[len] = Card(
                   player,
                   hand[0],
                   hand[1]
                );
                
                winners.push(player);

            }
            
        }
        
        
        current = Status.PAYOUT;
        return potential;
    }
}

contract BlackJack {
    
    mapping(uint => Game) games;
    uint total = 0;
    
    function create() public {
        Game game = new Game(msg.sender);
        games[total] = game;
        total ++;
    }

    function join(uint _gameIdx) public payable {
        Game game = games[_gameIdx];
        
        game.setBet(msg.sender, msg.value);
        game.addPlayer(msg.sender);
        
    }
    
    function players(uint _gameIdx) external view returns(address[] memory _players) {
       return games[_gameIdx].viewPlayers();
    }
    
    function totalGames() external view returns(uint _games) {
        return total;
    }
    
    function gameInfo(uint _gameIdx) external view returns(
        uint _totalBets,
        uint _size,
        uint _minimumBet,
        uint _balance,
        address _admin
        ){
        uint totalBets = games[_gameIdx].totalBets();
        uint size = games[_gameIdx].size();
        uint min = games[_gameIdx].getMinimum();
        uint balance = games[_gameIdx].balance();
        address admin = games[_gameIdx].viewAdmin();
        
        return (totalBets, size, min, balance, admin);
        
    }
    
    function start(uint _gameIdx) public {
        Game game = games[_gameIdx];
        
        require(game.size() > 0, 'not enough players');
        
        for (uint player = 0; player < game.size(); player++) {
            
            address addr =  game.viewPlayer(player);

            game.addCard(addr);
            
        }
        
        game.start();
        
    }
    
    function payout(uint _gameIdx) external {
        Game game = games[_gameIdx];
        
        game.escrow();
    }
    
    function hand(uint _gameIdx) external view returns(uint[2] memory) {
        Game game = games[_gameIdx];
        return game.getHand(msg.sender);
    }
    
    function bet(uint _gameIdx) payable public {
        Game game = games[_gameIdx];
        game.setBet(msg.sender, msg.value);
    }
    
    function status(uint _gameIdx) external view returns(Setup.Status _status) {
        return games[_gameIdx].currentStatus();
    }
   
    function deal(uint _gameIdx) public {
        Game game = games[_gameIdx];
        
        address[] memory needsToRaise = game.checkBets();
        
        if (needsToRaise.length != 0) {
            game.setStatus(Setup.Status.BETTING);
            
            for (uint p=0; p < needsToRaise.length; p++) {
                
               if (needsToRaise[p] == msg.sender) {
                   revert('raise bet first');
               } 
            }
            
        }
        
        require(
            game.currentStatus() == Setup.Status.DEALING,
            'not dealing'
        );
        
        game.addCard(msg.sender);
    }
    
    function winner(uint _gameIdx) public returns(Setup.Card[] memory){
        Game game = games[_gameIdx];
        
        return game.winner();
        
    }
}


