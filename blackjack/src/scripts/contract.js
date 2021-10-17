import { ethers } from 'ethers';
import { notification } from './notification';
import { Addresses as addy, } from './constants';
import Bignumber from 'bignumber.js';
import 'react-notifications-component/dist/theme.css';

const BlackJackABi = require('../contracts/BlackJack.abi.json');

const chain = parseInt(window.ethereum.chainId, 16);
const bjAddress = addy[chain].contract;
const ERC20_DECIMALS = 18;


class Contract {

  constructor() {
    
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
      console.log(this.contract)
      console.log(create);
      console.log('done')

    } catch (e) {      
      
      notification(e.message, "warning",)
      console.log(e.message);
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
