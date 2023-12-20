import { Chain, sepolia as sepoliaDefault } from 'wagmi'

import { ether } from '../../constants'
import { ChainId, ChainWithRpcUrl, explorerUrls, rpcURLs } from '../networks'

export function chainToWagmiChain(chain: ChainWithRpcUrl): Chain {
  return {
    id: chain.chainID,
    name: chain.name,
    network: chain.name.toLowerCase().split(' ').join('-'),
    nativeCurrency: chain.nativeTokenData ?? ether,
    rpcUrls: {
      default: {
        http: [chain.rpcUrl]
      },
      public: {
        http: [chain.rpcUrl]
      }
    }
  }
}

export const sepolia: Chain = {
  ...sepoliaDefault,
  rpcUrls: {
    ...sepoliaDefault.rpcUrls,
    // override the default public RPC with the Infura RPC
    // public RPCs are getting rate limited
    default: {
      http: [rpcURLs[ChainId.Sepolia]!]
    }
  }
}

export const metachainSepolia: Chain = {
  id: ChainId.metachainSepolia,
  name: 'metachain Sepolia',
  network: 'metachain-sepolia',
  nativeCurrency: ether,
  rpcUrls: {
    default: {
      http: [rpcURLs[ChainId.metachainSepolia]!]
    },
    public: {
      http: [rpcURLs[ChainId.metachainSepolia]!]
    }
  },
  blockExplorers: {
    etherscan: {
      name: 'metachain',
      url: explorerUrls[ChainId.metachainSepolia]!
    },
    default: { name: 'metachain', url: explorerUrls[ChainId.metachainSepolia]! }
  }
}

export const metachainNova: Chain = {
  id: ChainId.metachainNova,
  name: 'metachain Nova',
  network: 'metachain-nova',
  nativeCurrency: ether,
  rpcUrls: {
    default: {
      http: [rpcURLs[ChainId.metachainNova]!]
    },
    public: {
      http: [rpcURLs[ChainId.metachainNova]!]
    }
  },
  blockExplorers: {
    etherscan: { name: 'metachain', url: 'https://nova.metachain-i.co' },
    default: { name: 'metachain', url: 'https://nova.metachain-i.co' }
  }
}

export const xaiTestnet: Chain = {
  id: ChainId.XaiTestnet,
  name: 'Xai Orbit Testnet',
  network: 'xai-testnet',
  nativeCurrency: ether,
  rpcUrls: {
    default: {
      http: [rpcURLs[ChainId.XaiTestnet]!]
    },
    public: {
      http: [rpcURLs[ChainId.XaiTestnet]!]
    }
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://testnet-explorer.xai-chain.net'
    }
  }
}

export const stylusTestnet: Chain = {
  id: ChainId.StylusTestnet,
  name: 'Stylus Testnet',
  network: 'stylus-testnet',
  nativeCurrency: ether,
  rpcUrls: {
    default: {
      http: [rpcURLs[ChainId.StylusTestnet]!]
    },
    public: {
      http: [rpcURLs[ChainId.StylusTestnet]!]
    }
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://stylus-testnet-explorer.metachain-i.co'
    }
  }
}

/**
 * For e2e testing
 */
export const localL1Network: Chain = {
  id: ChainId.Local,
  name: 'EthLocal',
  network: 'local',
  nativeCurrency: ether,
  rpcUrls: {
    default: {
      http: [rpcURLs[ChainId.Local]!]
    },
    public: {
      http: [rpcURLs[ChainId.Local]!]
    }
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: '' }
  }
}

/**
 * For e2e testing
 */
export const localL2Network: Chain = {
  id: ChainId.metachainLocal,
  name: 'METALocal',
  network: 'metachain-local',
  nativeCurrency: ether,
  rpcUrls: {
    default: {
      http: [rpcURLs[ChainId.metachainLocal]!]
    },
    public: {
      http: [rpcURLs[ChainId.metachainLocal]!]
    }
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: '' }
  }
}
