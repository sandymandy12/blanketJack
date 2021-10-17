import { ethers } from 'ethers';
import { notification } from './notification';
import { Addresses as addy } from './constants';
import Bignumber from 'bignumber.js';
import 'react-notifications-component/dist/theme.css';

const BlackJackABi = require('../contracts/BlackJack.abi.json');

//const bjAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138';
const bjAddress = '0x79fA1F10Bc50150f08e86D5E923ee26571935fCA';
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
    const balance = await this.provider.getBalance(this.address);
    console.log('balance', balance)
    return balance;
  }


  async create() {

    console.log('creating')
    try {

      // const create = await this.contract.create();
      // const t = await this.contract.getTotalGames();
      // console.log('are we here')
      console.log(this.contract)
      // console.log(create);
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
      const t = await this.contract.getTotalGames();
      return t;
    } catch (e) {
      console.log(e.message);
    }
  }


  async listGames() {
    const totalGames = await this.contract.getTotalGames();

    const gameInfo = [];

    for (let i = 0; i < totalGames; i++) {
      const info = await this.contract.getGameInfo(i);
      
      gameInfo.push({
        moderator: info[0],
        size: info[1],
        buyIn: info[2],
        active: info[3],
        id: i
      });
    }
    return { gameInfo: gameInfo, totalGames: totalGames };
  }
  async gameInfo(_id) {
    const result = await this.contract.getGameInfo(_id);
    console.debug('Game info called', result);
    return {
      moderator: result[0],
      size: result[1],
      buyIn: result[2],
      active: result[3]
    };
  }


}

function rng(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}


export { Contract };
