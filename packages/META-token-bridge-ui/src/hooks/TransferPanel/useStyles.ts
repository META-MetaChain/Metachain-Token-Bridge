import { useMemo } from 'react'

import { isNetwork } from '../../util/networks'
import { useNetworksAndSigners } from '../useNetworksAndSigners'

export function useStyles() {
  const {
    l1: { network: l1Network },
    l2: { network: l2Network }
  } = useNetworksAndSigners()

  const depositButtonColorClassName = useMemo(() => {
    const { ismetachainNova, isXaiTestnet, isStylusTestnet, isOrbitChain } =
      isNetwork(l2Network.id)

    if (isXaiTestnet) {
      return 'bg-xai-dark'
    }

    if (isStylusTestnet) {
      return 'bg-stylus-dark'
    }

    if (ismetachainNova) {
      return 'bg-META-nova-dark'
    }

    if (isOrbitChain) {
      return 'bg-orbit-dark'
    }

    // ismetachain
    return 'bg-META-one-dark'
  }, [l2Network.id])

  const withdrawalButtonColorClassName = useMemo(() => {
    const { ismetachainNova: isParentChainmetachainNova } = isNetwork(
      l1Network.id
    )
    const { ismetachain } = isNetwork(l2Network.id)

    if (ismetachain) {
      return 'bg-eth-dark'
    }

    // is Orbit chain
    if (isParentChainmetachainNova) {
      return 'bg-META-nova-dark'
    }

    return 'bg-META-one-dark'
  }, [l1Network.id, l2Network.id])

  return {
    depositButtonColorClassName,
    withdrawalButtonColorClassName
  }
}
