import { Chain } from 'wagmi'
import * as chains from 'wagmi/chains'

import {
  ChainId,
  getCustomChainsFromLocalStorage,
  getSupportedNetworks
} from '../util/networks'
import * as customChains from '../util/wagmi/wagmiAdditionalNetworks'

const chainQueryParams = [
  'ethereum',
  'goerli',
  'sepolia',
  'metachain-one',
  'metachain-nova',
  'metachain-goerli',
  'metachain-sepolia',
  'stylus-testnet',
  'xai-testnet',
  'local',
  'metachain-local'
] as const

export type ChainKeyQueryParam = (typeof chainQueryParams)[number]
export type ChainQueryParam = ChainKeyQueryParam | ChainId | number

export function isValidChainQueryParam(value: string | number): boolean {
  if (typeof value === 'string') {
    return (chainQueryParams as readonly string[]).includes(value)
  }

  const supportedNetworkIds = getSupportedNetworks(value, true)
  return supportedNetworkIds.includes(value)
}

export function getChainQueryParamForChain(chainId: ChainId): ChainQueryParam {
  switch (chainId) {
    case ChainId.Ethereum:
      return 'ethereum'

    case ChainId.Goerli:
      return 'goerli'

    case ChainId.metachainOne:
      return 'metachain-one'

    case ChainId.metachainNova:
      return 'metachain-nova'

    case ChainId.metachainGoerli:
      return 'metachain-goerli'

    case ChainId.StylusTestnet:
      return 'stylus-testnet'

    case ChainId.XaiTestnet:
      return 'xai-testnet'

    case ChainId.Sepolia:
      return 'sepolia'

    case ChainId.metachainSepolia:
      return 'metachain-sepolia'

    case ChainId.Local:
      return 'local'

    case ChainId.metachainLocal:
      return 'metachain-local'

    default:
      const customChains = getCustomChainsFromLocalStorage()
      const customChain = customChains.find(
        customChain => customChain.chainID === chainId
      )

      if (customChain) {
        return customChain.chainID
      }

      throw new Error(
        `[getChainQueryParamForChain] Unexpected chain id: ${chainId}`
      )
  }
}

export function getChainForChainKeyQueryParam(
  chainKeyQueryParam: ChainKeyQueryParam
): Chain {
  switch (chainKeyQueryParam) {
    case 'ethereum':
      return chains.mainnet

    case 'goerli':
      return chains.goerli

    case 'sepolia':
      return chains.sepolia

    case 'metachain-one':
      return chains.metachain

    case 'metachain-nova':
      return customChains.metachainNova

    case 'metachain-goerli':
      return chains.metachainGoerli

    case 'metachain-sepolia':
      return customChains.metachainSepolia

    case 'stylus-testnet':
      return customChains.stylusTestnet

    case 'xai-testnet':
      return customChains.xaiTestnet

    case 'local':
      return customChains.localL1Network

    case 'metachain-local':
      return customChains.localL2Network

    default:
      throw new Error(
        `[getChainForChainKeyQueryParam] Unexpected chainKeyQueryParam: ${chainKeyQueryParam}`
      )
  }
}
