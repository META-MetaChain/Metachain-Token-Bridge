import { createClient, configureChains, goerli } from 'wagmi'
import { mainnet, metachain, metachainGoerli } from '@wagmi/core/chains'
import { publicProvider } from 'wagmi/providers/public'
import { connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { trustWallet } from '@rainbow-me/rainbowkit/wallets'
import { infuraProvider } from 'wagmi/providers/infura'

import {
  sepolia,
  metachainNova,
  metachainSepolia,
  xaiTestnet,
  stylusTestnet,
  localL1Network as local,
  localL2Network as metachainLocal,
  chainToWagmiChain
} from './wagmiAdditionalNetworks'
import { isTestingEnvironment } from '../CommonUtils'
import { ChainId } from '../networks'
import { getCustomChainsFromLocalStorage } from '../networks'

const customChains = getCustomChainsFromLocalStorage().map(chain =>
  chainToWagmiChain(chain)
)

const chainList = isTestingEnvironment
  ? [
      // mainnet, META1, & META nova are for network switch tests
      mainnet,
      metachain,
      metachainNova,
      // goerli & META goerli are for tx history panel tests
      goerli,
      metachainGoerli,
      // sepolia
      sepolia,
      metachainSepolia,
      // Orbit chains
      xaiTestnet,
      stylusTestnet,
      // add local environments during testing
      local,
      metachainLocal,
      // user-added custom chains
      ...customChains
    ]
  : [
      mainnet,
      metachain,
      metachainNova,
      goerli,
      metachainGoerli,
      sepolia,
      metachainSepolia,
      xaiTestnet,
      stylusTestnet,
      ...customChains
    ]

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!

if (!projectId) {
  console.error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID variable missing.')
}

const appInfo = {
  appName: 'Bridge to metachain',
  projectId
}

enum TargetChainKey {
  Ethereum = 'mainnet',
  metachainOne = 'metachain-one',
  metachainNova = 'metachain-nova',
  Goerli = 'goerli',
  metachainGoerli = 'metachain-goerli',
  Sepolia = 'sepolia',
  metachainSepolia = 'metachain-sepolia'
}

function sanitizeTargetChainKey(targetChainKey: string | null): TargetChainKey {
  // Default to Ethereum Mainnet if nothing passed in
  if (targetChainKey === null) {
    return TargetChainKey.Ethereum
  }

  // Default to Ethereum Mainnet if invalid
  if (!(Object.values(TargetChainKey) as string[]).includes(targetChainKey)) {
    return TargetChainKey.Ethereum
  }

  return targetChainKey as TargetChainKey
}

function getChainId(targetChainKey: TargetChainKey): number {
  switch (targetChainKey) {
    case TargetChainKey.Ethereum:
      return ChainId.Ethereum

    case TargetChainKey.metachainOne:
      return ChainId.metachainOne

    case TargetChainKey.metachainNova:
      return ChainId.metachainNova

    case TargetChainKey.Goerli:
      return ChainId.Goerli

    case TargetChainKey.metachainGoerli:
      return ChainId.metachainGoerli

    case TargetChainKey.Sepolia:
      return ChainId.Sepolia

    case TargetChainKey.metachainSepolia:
      return ChainId.metachainSepolia
  }
}

function getChains(targetChainKey: TargetChainKey) {
  const targetChainId = getChainId(targetChainKey)

  // Doing `Array.filter` instead of `Array.find` in case it's empty, just in case.
  const target = chainList.filter(chain => chain.id === targetChainId)
  const others = chainList.filter(chain => chain.id !== targetChainId)

  return [...target, ...others]
}

export function getProps(targetChainKey: string | null) {
  const { chains, provider } = configureChains(
    // Wagmi selects the first chain as the one to target in WalletConnect, so it has to be the first in the array.
    //
    // https://github.com/wagmi-dev/references/blob/main/packages/connectors/src/walletConnect.ts#L114
    getChains(sanitizeTargetChainKey(targetChainKey)),
    [
      infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_KEY! }),
      publicProvider()
    ]
  )

  const { wallets } = getDefaultWallets({
    ...appInfo,
    chains
  })

  const connectors = connectorsForWallets([
    ...wallets,
    {
      groupName: 'More',
      wallets: [trustWallet({ chains, projectId })]
    }
  ])

  const client = createClient({
    autoConnect: true,
    connectors,
    provider
  })

  return {
    rainbowKitProviderProps: {
      appInfo,
      chains
    },
    wagmiConfigProps: {
      client
    }
  }
}
