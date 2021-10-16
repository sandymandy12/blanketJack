import Web3 from 'web3'
import { newKitFromWeb3 } from '@celo/contractkit'
import erc20Abi from "../contracts/erc20.abi.json"
import GameSetupAbi from "../contracts/GameSetup.abi.json"
import { notification } from './notification';
import Bignumber from 'bignumber.js';
import 'react-notifications-component/dist/theme.css';

const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"
// const gsContractAddress = '0x35C9e79b16C768aFc2caA78837eAFD2B28Bf0305'; 

const gsContractAddress = '0xc9a8568c355223d9dEB15b850379C5934606a6FA';
const ERC20_DECIMALS = 18;



class Contract {

  constructor() {
    
    const web3 = new Web3(window.celo);
    this.kit = newKitFromWeb3(web3);

    window.celo.enable();

    const accounts = this.kit.web3.eth.getAccounts();
    this.kit.defaultAccount = accounts[0];

    this.contract = new this.kit.web3.eth.Contract(GameSetupAbi, gsContractAddress);
  }

  async connectWallet() {
    console.log("connecting celo..")
    if (window.celo) {
      try {
        
        await window.celo.enable();
        // notification('Celo enabled','success');

        const accounts = await this.kit.web3.eth.getAccounts();
        this.kit.defaultAccount = accounts[0];
    
        this.contract = new this.kit.web3.eth.Contract(GameSetupAbi, gsContractAddress);
      } catch (error) {
        notification(`⚠️ ${error}.`,'danger')
      }
    } else {
      notification("⚠️ Please install the CeloExtensionWallet.", "warning")
    }
  }

  async balance() {
    const totalBalance = await this.kit.getTotalBalance(this.kit.defaultAccount)
    const cUSDBalance = totalBalance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);
    console.log( 'Balance:', cUSDBalance)
    return cUSDBalance;
  }

  async approve(_price) {
    const price = new Bignumber(_price).shiftedBy(ERC20_DECIMALS);
    const cUSDContract = new this.kit.web3.eth.Contract(erc20Abi, cUSDContractAddress)
    const result = await cUSDContract.methods
      .approve(gsContractAddress, price)
      .send({ from: this.kit.defaultAccount })
    console.log(result);
  }

  async create(_buyIn) {
    let buyIn = new Bignumber(_buyIn).shiftedBy(ERC20_DECIMALS);

    console.log(buyIn);
    try {
      const create = await this.contract.methods
      .createGame()
      .send({ from: this.kit.defaultAccount })
  
      console.log(create);
    } catch (e) {      
      notification(e.message, "warning",)
      console.log(e.message);
    }
  
  }

  async join(_id) {


    try {

      const result = await this.contract.methods
      .joinGame(_id)
      .send({ from: this.kit.defaultAccount })

      console.log(result)
      
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
      const result = await this.contract.methods
      .getPlayer(_gameId, _playerIdx)

      return result;
    } catch (e) {
      console.log(e.message);
    }
  }

}

const gameInfo = async (_contract,_id) => {
  const result = await _contract.methods
  .getGameInfo(_id).call();
  console.debug('Game info called', result);
  return {
    moderator: result[0],
    size: result[1],
    buyIn: result[2],
    active: result[3]
  };
}


const listGames = async (_contract) => {
  const totalGames = await _contract.methods
    .getTotalGames().call();

    const gameInfo = [];
    for (let i = 0; i < totalGames; i++) {
      const info = await _contract.methods
      .getGameInfo(i).call();
      
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

function rng(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}


export { Contract, listGames, gameInfo };
