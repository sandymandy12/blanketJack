import Web3 from 'web3'
import { newKitFromWeb3 } from '@celo/contractkit'
import BigNumber from "bignumber.js"
import erc20Abi from "../contracts/erc20.abi.json"
import GameSetupAbi from "../contracts/GameSetup.abi.json"

import { store } from 'react-notifications-component';

const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"
const gsContractAddress = '0x35C9e79b16C768aFc2caA78837eAFD2B28Bf0305'; 
const ERC20_DECIMALS = 18;


export default class Contract {

  constructor() {
  
    this.connectWallet = async () => {
      console.log("connecting celo..")
      if (window.celo) {
        try {

          await window.celo.enable()
          notification('Celo enabled','success')
          const web3 = new Web3(window.celo)
          this.kit = newKitFromWeb3(web3)
      
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

  }

  async getBalance() {
    console.log(this.kit);
    const totalBalance = await this.kit.getTotalBalance(this.kit.defaultAccount)
    console.log(totalBalance)
    const cUSDBalance = totalBalance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);
    console.log(cUSDBalance)
    return cUSDBalance;
  }

  async approve(_price) {
    const cUSDContract = new this.kit.web3.eth.Contract(erc20Abi, cUSDContractAddress)
    const result = await cUSDContract.methods
      .approve(gsContractAddress, _price)
      .send({ from: this.kit.defaultAccount })
    console.log(result);
  }

}

function notification(_text, _type, _title="") {
  store.addNotification({
    title: _title,
    message: _text,
    type: _type,
    container: 'top-right',
    insert: 'top',
    animationIn: ['animated', 'fadeIn'],
    animationOut: ['animated', 'fadeOut'],

    dismiss: {
      duration: 4000,
      showIcon: true
    },
    width: 600
  })
}
