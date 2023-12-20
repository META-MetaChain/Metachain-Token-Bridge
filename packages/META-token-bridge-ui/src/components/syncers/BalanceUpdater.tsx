import { useEffect } from 'react'
import { useLatest } from 'react-use'

import { useAppState } from '../../state'

// Updates all balances periodically
const BalanceUpdater = (): JSX.Element => {
  const {
    app: { METATokenBridge, selectedToken }
  } = useAppState()
  const latestTokenBridge = useLatest(METATokenBridge)

  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedToken) {
        latestTokenBridge?.current?.token?.updateTokenData(
          selectedToken.address
        )
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [selectedToken])

  return <></>
}

export { BalanceUpdater }
