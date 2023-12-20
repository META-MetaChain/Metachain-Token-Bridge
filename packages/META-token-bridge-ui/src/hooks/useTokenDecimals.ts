import { useMemo } from 'react'

import { METATokenBridge } from './METATokenBridge.types'
import { defaultErc20Decimals } from '../defaults'

const useTokenDecimals = (
  bridgeTokens: METATokenBridge['bridgeTokens'],
  tokenAddress: string | null
) => {
  return useMemo(() => {
    if (typeof bridgeTokens === 'undefined') {
      return defaultErc20Decimals
    }

    if (!tokenAddress) {
      return defaultErc20Decimals
    }

    return bridgeTokens[tokenAddress]?.decimals ?? defaultErc20Decimals
  }, [bridgeTokens, tokenAddress])
}

export { useTokenDecimals }
