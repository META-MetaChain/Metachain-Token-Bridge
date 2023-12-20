import { useMemo } from 'react'
import { BigNumber, utils } from 'ethers'

import { useAppState } from '../../state'
import { useNetworksAndSigners } from '../../hooks/useNetworksAndSigners'
import { useMETAQueryParams } from '../../hooks/useMETAQueryParams'
import { useIsConnectedTometachain } from '../../hooks/useIsConnectedTometachain'

export function calculateEstimatedL1GasFees(
  estimatedL1Gas: BigNumber,
  l1GasPrice: BigNumber
) {
  return parseFloat(utils.formatEther(estimatedL1Gas.mul(l1GasPrice)))
}

export function calculateEstimatedL2GasFees(
  estimatedL2Gas: BigNumber,
  l2GasPrice: BigNumber,
  estimatedL2SubmissionCost: BigNumber
) {
  return parseFloat(
    utils.formatEther(
      estimatedL2Gas.mul(l2GasPrice).add(estimatedL2SubmissionCost)
    )
  )
}

// TODO: These could be useful in the rest of the app
export function useIsSwitchingL2Chain() {
  const { app } = useAppState()
  const { isDepositMode } = app

  const { l2 } = useNetworksAndSigners()
  const isConnectedTometachain = useIsConnectedTometachain()
  const [{ l2ChainId: l2ChainIdSearchParam }] = useMETAQueryParams()

  return useMemo(() => {
    if (typeof isConnectedTometachain === 'undefined') {
      return false
    }

    if (isConnectedTometachain || !isDepositMode) {
      return false
    }

    // if l2ChainId url param is either null, undefined, blank, 0 or invalid number
    if (!l2ChainIdSearchParam || isNaN(l2ChainIdSearchParam)) {
      return false
    }

    return l2.network.id !== l2ChainIdSearchParam
  }, [isConnectedTometachain, isDepositMode, l2, l2ChainIdSearchParam])
}
