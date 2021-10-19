const Addresses = {
  137: {
    contract: '',
    name: 'Matic Mainnet',
    dai: ['0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      18, 'DAI', 'Dai Stable Coin',
    ],
    uni: ['0xb33EaAd8d922B1083446DC23f610c2567fB5180f',
      18, 'UNI', 'Uniswap Coin',
    ],
    usdc: ['0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      6, 'USDC', 'USDC Coin',
    ],
    weth: ['0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      18, 'WMATIC', 'Wrapped MATIC',
    ],
    quick: ['0x831753DD7087CaC61aB5644b308642cc1c33Dc13',
      18, 'QUICK', 'Quick Token',
    ],
    titan: ['0xaAa5B9e6c589642f98a1cDA99B9D024B8407285A',
      18, 'TITAN', 'Iron Finance TITAN',
    ],
    fish: ['0x3a3Df212b7AA91Aa0402B9035b098891d276572B',
      18, 'FISH', 'FISH TOKEN',
    ],
    yeld: ['0xd0f3121A190d85dE0AB6131f2bCEcdbfcfB38891',
      18, 'YELD',
    ],
  },
  1: {
    name: 'Ethereum Mainnet',
    uni: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    usdc: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    busd: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
  },
  3: {
    contract: '0xcE5781BB8a0a9F9693518739d26f489e471cabF8',
  }
};

const Explorer = (network, addr) => {
  const networks = {
    1: `https://etherscan.io/address/${addr}`,
    137: `https://polygonscan.com/address${addr}`,
    3: `https://ropsten.etherscan.io/address/${addr}`,
    80001: `https://mumbai.polygonscan.com/address/${addr}`
  }

  return networks[network];
}

const old_addresses = {
  ropsten: [
    '0x79fA1F10Bc50150f08e86D5E923ee26571935fCA'
  ]
}


export { Addresses, Explorer }