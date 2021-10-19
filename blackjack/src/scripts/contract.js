import { ethers } from 'ethers';
import { Notification } from './notification';
import { Addresses as addy } from './constants';
import Bignumber from 'bignumber.js';
import 'react-notifications-component/dist/theme.css';

const BlackJackABi = require('../contracts/BlackJack.abi.json');

const ERC20_DECIMALS = 18;
const notify = new Notification();


class Contract {

  constructor(network) {
    console.log('network - contract', network);

    // const chain = 3; // wanted to use network but it isnt working with me
    const bjAddress = addy[network].contract;

    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.signer = this.provider.getSigner();
    this.contract = new ethers.Contract(
      bjAddress,
      BlackJackABi,
      this.signer
    );

    this.address = ethers.utils.getAddress(window.ethereum.selectedAddress);
    
  }


  async balance() {
    const test = await this.provider.getNetwork();
    const balance = await this.provider.getBalance(this.address);
    const bn = new Bignumber(balance.toString())
    .shiftedBy(-ERC20_DECIMALS)
    .toFixed(4);
    return { balance: bn, network: test.name }
  }


  async create() {

    console.log('creating')
    try {

      const create = await this.contract.create();
      console.log(create, 'before')
      const hash = await create.hash;
      console.log(create, 'after');

      const title = 'create-'+ String(Date.now());
      const id = String(hash) + String(Date.now());

      notify.add({
        text:'Creating contract\n' + String(hash),
        type:'success',
        id: id,
        title: title,
        timer: true

      });


      console.log('done')

    } catch (e) {      
      notify.error(e);
      console.log(e);
    }
  
  }

  async join(_buyIn) {
    let buyIn = new Bignumber(_buyIn).shiftedBy(ERC20_DECIMALS);

    try {
      
    } catch (e) {
      console.log(e.message);
    }
  }

  async start(_id) {
    
    try {
      const result = await this.contract.methods
      .startGame(_id)
      .send({ from: this.kit.defaultAccount });

      console.log(result);   

    } catch (e) {
      console.log(e.message)
    }

  }

  async status(_id) {
    const statuses = { 
      32: 'OPEN'
    }
    try {
      const response = await this.contract.status(_id);
      const status = statuses[response];
      const hash = await status.hash;

      console.log('status - ', status, ', contract response');  

      const title = 'create-'+ String(Date.now());
      const id = String(hash) + String(Date.now());

      notify.add({
        text:'status contract',
        type:'success',
        id: id,
        title: title,
        timer: true

      });

      return(status);

    } catch (e) {
      console.log(e.message);
      notify.error(e);
    }
  }

  async deal(_id, _size) {

    

    const cards = [];

    let added = 0;
    
    while(added < _size) {

      const random = rng(1,52);

      if (!cards.includes(random)) {
        cards.push(random);
        added++;
      }

    }

    console.log(cards);

    try {

    } catch (e) {
      console.log(e.message);
    }
    
  }

  /**
   * 
   * @param {Game ID} _gameId 
   * @param {Player Index} _playerIdx 
   * @returns Player address at index
   */
  async player(_gameId, _playerIdx) {
    try {
      const result = await this.contract
      .getPlayer(_gameId, _playerIdx);

      return result;
    } catch (e) {
      console.log(e.message);
    }
  }

  async total() {
    try {
      const res = await this.contract.totalGames();
      const t = new Bignumber(String(res)).toNumber();
      return t;
    } catch (e) {
      console.log(e.message);
    }
  }


  async listGames() {
    const totalGames = await this.total();

    const gameInfo = [];

    for (let i = 0; i < totalGames; i++) {
      
      const info = await this.gameInfo(i);
      gameInfo.push(info);
      
    }
    return { gameInfo: gameInfo, totalGames: totalGames };
  }

  async gameInfo(_id) {
    let result = await this.contract.gameInfo(_id);
    console.assert('Game info called', result);
    return {
      totalBets: toToken(result[0]),
      size: toNumber(result[1]),
      minimumBet: toToken(result[2]),
      balance: toNumber(result[3]),
      admin: (result[4]),
      id: _id
    };
  }


}

function rng(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function toNumber(_bignumber) {
  return new Bignumber(String( _bignumber )).toNumber();
}

function toAddress(_bignumber) {
  return new Bignumber(String( _bignumber )).toString();
}

function toToken(_bignumber) {
  return new Bignumber(String( _bignumber))
  .shiftedBy(-ERC20_DECIMALS)
  .toFixed(6);
}

export { Contract };
