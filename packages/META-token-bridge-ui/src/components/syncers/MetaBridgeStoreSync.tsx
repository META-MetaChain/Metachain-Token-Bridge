import { useEffect } from 'react'
import {
  useMETATokenBridge,
  TokenBridgeParams
} from '../../hooks/useMETATokenBridge'

import { useActions } from '../../state'

// Syncs the METATokenBridge data with the global store, so we dont have to drill with props but use store hooks to get data
export function METATokenBridgeStoreSync({
  tokenBridgeParams
}: {
  tokenBridgeParams: TokenBridgeParams
}): JSX.Element {
  const actions = useActions()
  const METATokenBridge = useMETATokenBridge(tokenBridgeParams)

  useEffect(() => {
    actions.app.setMETATokenBridge(METATokenBridge)
  }, [METATokenBridge])

  return <></>
}
