import { Chain } from 'wagmi'
import {
  mainnet,
  goerli,
  sepolia,
  metachain as metachainOne,
  metachainGoerli
} from 'wagmi/chains'

import { ChainId, getCustomChainsFromLocalStorage } from '../networks'
import {
  metachainNova,
  metachainSepolia,
  chainToWagmiChain,
  stylusTestnet,
  xaiTestnet
} from './wagmiAdditionalNetworks'

export function getPartnerChainsForChainId(chainId: number): Chain[] {
  const customWagmiChains = getCustomChainsFromLocalStorage()
  const custommetachainGoerliChains = customWagmiChains
    .filter(chain => chain.partnerChainID === ChainId.metachainGoerli)
    .map(chain => chainToWagmiChain(chain))
  const custommetachainSepoliaChains = customWagmiChains
    .filter(chain => chain.partnerChainID === ChainId.metachainSepolia)
    .map(chain => chainToWagmiChain(chain))
  const custommetachainOneChains = customWagmiChains
    .filter(chain => chain.partnerChainID === ChainId.metachainOne)
    .map(chain => chainToWagmiChain(chain))
  const custommetachainNovaChains = customWagmiChains
    .filter(chain => chain.partnerChainID === ChainId.metachainNova)
    .map(chain => chainToWagmiChain(chain))

  switch (chainId) {
    case ChainId.Ethereum:
      return [metachainOne, metachainNova]

    case ChainId.Goerli:
      return [metachainGoerli]

    case ChainId.Sepolia:
      return [metachainSepolia]

    case ChainId.metachainOne:
      return [mainnet, ...custommetachainOneChains]

    case ChainId.metachainNova:
      return [mainnet, ...custommetachainNovaChains]

    case ChainId.metachainGoerli:
      return [goerli, xaiTestnet, ...custommetachainGoerliChains]

    case ChainId.metachainSepolia:
      return [sepolia, stylusTestnet, ...custommetachainSepoliaChains]

    case ChainId.StylusTestnet:
      return [metachainSepolia]

    case ChainId.XaiTestnet:
      return [metachainGoerli]

    default:
      const custommetachainGoerliChainsIds = custommetachainGoerliChains.map(
        chain => chain.id
      )
      const custommetachainSepoliaChainsIds = custommetachainSepoliaChains.map(
        chain => chain.id
      )
      const custommetachainNovaChainsIds = custommetachainNovaChains.map(
        chain => chain.id
      )
      const custommetachainOneChainsIds = custommetachainOneChains.map(
        chain => chain.id
      )

      // Orbit chains
      if (custommetachainGoerliChainsIds.includes(chainId)) {
        return [metachainGoerli]
      }
      if (custommetachainSepoliaChainsIds.includes(chainId)) {
        return [metachainSepolia]
      }
      if (custommetachainNovaChainsIds.includes(chainId)) {
        return [metachainNova]
      }
      if (custommetachainOneChainsIds.includes(chainId)) {
        return [metachainOne]
      }

      throw new Error(
        `[getPartnerChainsForChain] Unexpected chain id: ${chainId}`
      )
  }
}
