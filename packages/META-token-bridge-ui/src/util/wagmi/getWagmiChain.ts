import { Chain } from 'wagmi'
import { mainnet, goerli, metachain, metachainGoerli } from 'wagmi/chains'

import {
  chainToWagmiChain,
  sepolia,
  metachainNova,
  metachainSepolia,
  xaiTestnet,
  stylusTestnet,
  localL1Network,
  localL2Network
} from './wagmiAdditionalNetworks'
import { ChainId } from '../networks'
import { getCustomChainFromLocalStorageById } from '../networks'

export function getWagmiChain(chainId: number): Chain {
  const customChain = getCustomChainFromLocalStorageById(chainId)

  if (customChain) {
    return chainToWagmiChain(customChain)
  }

  switch (chainId) {
    case ChainId.Ethereum:
      return mainnet

    case ChainId.metachainOne:
      return metachain

    case ChainId.metachainNova:
      return metachainNova

    // Testnets
    case ChainId.Goerli:
      return goerli

    case ChainId.metachainGoerli:
      return metachainGoerli

    case ChainId.Sepolia:
      return sepolia

    case ChainId.metachainSepolia:
      return metachainSepolia

    case ChainId.XaiTestnet:
      return xaiTestnet

    case ChainId.StylusTestnet:
      return stylusTestnet

    // Local networks
    case ChainId.Local:
      return localL1Network

    case ChainId.metachainLocal:
      return localL2Network

    default:
      throw new Error(`[getWagmiChain] Unexpected chain id: ${chainId}`)
  }
}
