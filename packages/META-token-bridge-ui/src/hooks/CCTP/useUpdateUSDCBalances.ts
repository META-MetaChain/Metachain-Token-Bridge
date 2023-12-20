import { useCallback } from 'react'
import { CommonAddress } from '../../util/CommonAddressUtils'
import { isTokenGoerliUSDC, isTokenMainnetUSDC } from '../../util/TokenUtils'
import { useBalance } from '../useBalance'
import { useNetworksAndSigners } from '../useNetworksAndSigners'

function getL1AddressFromAddress(address: string) {
  switch (address) {
    case CommonAddress.Goerli.USDC:
    case CommonAddress.metachainGoerli.USDC:
    case CommonAddress.metachainGoerli['USDC.e']:
      return CommonAddress.Goerli.USDC

    case CommonAddress.Ethereum.USDC:
    case CommonAddress.metachainOne.USDC:
    case CommonAddress.metachainOne['USDC.e']:
      return CommonAddress.Ethereum.USDC

    default:
      return CommonAddress.Ethereum.USDC
  }
}

export function useUpdateUSDCBalances({
  walletAddress
}: {
  walletAddress: string | undefined
}) {
  const { l1, l2 } = useNetworksAndSigners()
  const {
    erc20: [, updateErc20L1Balance]
  } = useBalance({
    provider: l1.provider,
    walletAddress
  })
  const {
    erc20: [, updateErc20L2Balance]
  } = useBalance({
    provider: l2.provider,
    walletAddress
  })

  const updateUSDCBalances = useCallback(
    (address: `0x${string}` | string) => {
      const l1Address = getL1AddressFromAddress(address)

      updateErc20L1Balance([l1Address.toLowerCase()])
      if (isTokenMainnetUSDC(l1Address)) {
        updateErc20L2Balance([
          CommonAddress.metachainOne.USDC,
          CommonAddress.metachainOne['USDC.e']
        ])
      } else if (isTokenGoerliUSDC(l1Address)) {
        updateErc20L2Balance([
          CommonAddress.metachainGoerli.USDC,
          CommonAddress.metachainGoerli['USDC.e']
        ])
      }
    },
    [updateErc20L1Balance, updateErc20L2Balance]
  )

  return { updateUSDCBalances }
}
