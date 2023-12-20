import { useMemo } from 'react'
import { useMedia } from 'react-use'
import { twMerge } from 'tailwind-merge'
import {
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import { constants } from 'ethers'
import { Chain, useAccount } from 'wagmi'

import { Loader } from '../common/atoms/Loader'
import { useAppState } from '../../state'
import {
  listIdsToNames,
  SPECIAL_metachain_TOKEN_TOKEN_LIST_ID
} from '../../util/TokenListUtils'
import { formatAmount } from '../../util/NumberUtils'
import { shortenAddress } from '../../util/CommonUtils'
import {
  isTokenmetachainOneNativeUSDC,
  isTokenmetachainGoerliNativeUSDC,
  sanitizeTokenName,
  sanitizeTokenSymbol
} from '../../util/TokenUtils'
import { SafeImage } from '../common/SafeImage'
import { useNetworksAndSigners } from '../../hooks/useNetworksAndSigners'
import { getExplorerUrl, getNetworkName } from '../../util/networks'
import { Tooltip } from '../common/Tooltip'
import { StatusBadge } from '../common/StatusBadge'
import { useBalance } from '../../hooks/useBalance'
import { ERC20BridgeToken } from '../../hooks/METATokenBridge.types'
import { ExternalLink } from '../common/ExternalLink'
import { useAccountType } from '../../hooks/useAccountType'
import { useNativeCurrency } from '../../hooks/useNativeCurrency'

function tokenListIdsToNames(ids: number[]): string {
  return ids
    .map((tokenListId: number) => listIdsToNames[tokenListId])
    .join(', ')
}

function TokenLogoFallback() {
  return (
    <div className="flex h-8 w-8 min-w-[2rem] items-center justify-center rounded-full bg-ocl-blue text-sm font-medium text-white">
      ?
    </div>
  )
}

function BlockExplorerTokenLink({
  chain,
  address
}: {
  chain: Chain
  address: string | undefined
}) {
  if (typeof address === 'undefined') {
    return null
  }

  return (
    <ExternalLink
      href={`${getExplorerUrl(chain.id)}/token/${address}`}
      className="text-xs text-blue-link underline"
      onClick={e => e.stopPropagation()}
    >
      {shortenAddress(address).toLowerCase()}
    </ExternalLink>
  )
}

interface TokenRowProps {
  style?: React.CSSProperties
  onClick: React.MouseEventHandler<HTMLButtonElement>
  token: ERC20BridgeToken | null
}

export function TokenRow({
  style,
  onClick,
  token
}: TokenRowProps): JSX.Element {
  const { address: walletAddress } = useAccount()
  const {
    app: {
      METATokenBridge: { bridgeTokens },
      isDepositMode
    }
  } = useAppState()
  const { isLoading: isLoadingAccountType } = useAccountType()
  const {
    l1: { network: l1Network, provider: l1Provider },
    l2: { network: l2Network, provider: l2Provider }
  } = useNetworksAndSigners()

  const isSmallScreen = useMedia('(max-width: 419px)')
  const nativeCurrency = useNativeCurrency({ provider: l2Provider })

  const tokenName = useMemo(() => {
    if (token) {
      return sanitizeTokenName(token.name, {
        erc20L1Address: token.address,
        chain: isDepositMode ? l1Network : l2Network
      })
    }

    return nativeCurrency.name
  }, [token, nativeCurrency, isDepositMode, l2Network, l1Network])

  const tokenSymbol = useMemo(() => {
    if (token) {
      return sanitizeTokenSymbol(token.symbol, {
        erc20L1Address: token.address,
        chain: isDepositMode ? l1Network : l2Network
      })
    }

    return nativeCurrency.symbol
  }, [token, nativeCurrency, isDepositMode, l2Network, l1Network])

  const isL2NativeToken = useMemo(() => token?.isL2Native ?? false, [token])
  const tokenIsMETAOneNativeUSDC = useMemo(
    () => isTokenmetachainOneNativeUSDC(token?.address),
    [token]
  )
  const tokenIsMETAGoerliNativeUSDC = useMemo(
    () => isTokenmetachainGoerliNativeUSDC(token?.address),
    [token]
  )

  const {
    eth: [ethL1Balance],
    erc20: [erc20L1Balances]
  } = useBalance({ provider: l1Provider, walletAddress })
  const {
    eth: [ethL2Balance],
    erc20: [erc20L2Balances]
  } = useBalance({ provider: l2Provider, walletAddress })

  const tokenLogoURI = useMemo(() => {
    if (!token) {
      return nativeCurrency.logoUrl
    }

    return token.logoURI
  }, [token, nativeCurrency])

  const tokenBalance = useMemo(() => {
    if (!token) {
      if (nativeCurrency.isCustom) {
        return isDepositMode
          ? erc20L1Balances?.[nativeCurrency.address]
          : ethL2Balance
      }

      return isDepositMode ? ethL1Balance : ethL2Balance
    }

    if (isDepositMode) {
      return erc20L1Balances?.[token.address.toLowerCase()]
    }

    if (!token.l2Address) {
      return constants.Zero
    }

    return erc20L2Balances?.[token.l2Address.toLowerCase()] ?? constants.Zero
  }, [
    ethL1Balance,
    ethL2Balance,
    token,
    nativeCurrency,
    isDepositMode,
    erc20L1Balances,
    erc20L2Balances
  ])

  const ismetachainToken = useMemo(() => {
    if (!token) {
      return false
    }

    return token.listIds.has(SPECIAL_metachain_TOKEN_TOKEN_LIST_ID)
  }, [token])

  const isPotentialFakemetachainToken = useMemo(() => {
    if (!token || ismetachainToken) {
      return false
    }

    return (
      token.name.toLowerCase().startsWith('META') ||
      token.symbol.toLowerCase().startsWith('META')
    )
  }, [token, ismetachainToken])

  const tokenListInfo = useMemo(() => {
    if (!token) {
      return null
    }

    if (tokenIsMETAOneNativeUSDC) {
      return 'Native USDC on metachain One'
    }

    if (tokenIsMETAGoerliNativeUSDC) {
      return 'Native USDC on metachain Goerli'
    }

    const listIds: Set<number> = token.listIds
    const listIdsSize = listIds.size
    if (listIdsSize === 0) {
      return 'Added by User'
    }

    const listIdsArray = Array.from(listIds)
    if (listIdsSize < 2) {
      return tokenListIdsToNames(listIdsArray)
    }

    const firstList = listIdsArray.slice(0, 1)
    const more = listIdsSize - 1

    return (
      tokenListIdsToNames(firstList) +
      ` and ${more} more list${more > 1 ? 's' : ''}`
    )
  }, [token, tokenIsMETAGoerliNativeUSDC, tokenIsMETAOneNativeUSDC])

  const tokenIsAddedToTheBridge = useMemo(() => {
    // Can happen when switching networks.
    if (typeof bridgeTokens === 'undefined') {
      return true
    }

    if (!token) {
      return true
    }

    if (tokenIsMETAOneNativeUSDC || tokenIsMETAGoerliNativeUSDC) {
      return true
    }

    return typeof bridgeTokens[token.address] !== 'undefined'
  }, [bridgeTokens, token, tokenIsMETAOneNativeUSDC, tokenIsMETAGoerliNativeUSDC])

  const tokenHasL2Address = useMemo(() => {
    if (!token) {
      return true
    }

    return typeof token.l2Address !== 'undefined'
  }, [token])

  const tokenIsBridgeable = useMemo(() => {
    if (isL2NativeToken) {
      return false
    }

    if (isDepositMode) {
      return true
    }

    return tokenHasL2Address
  }, [isDepositMode, tokenHasL2Address, isL2NativeToken])

  const isCustomFeeTokenRow = token === null && nativeCurrency.isCustom

  const metachainTokenTooltipContent = useMemo(() => {
    const networkName = getNetworkName(
      isDepositMode ? l1Network.id : l2Network.id
    )

    return (
      <span>
        This is the official metachain token on {networkName}. Please beware of
        fake tokens trying to impersonate it.
      </span>
    )
  }, [isDepositMode, l1Network, l2Network])

  const tokenBalanceContent = useMemo(() => {
    if (!tokenIsAddedToTheBridge) {
      return <span className="text-sm font-medium text-blue-link">Import</span>
    }

    // We don't want users to be able to click on USDC before we know whether or not they are SCW users
    if (
      isLoadingAccountType &&
      (tokenIsMETAGoerliNativeUSDC || tokenIsMETAOneNativeUSDC)
    ) {
      return (
        <div className="mr-2">
          <Loader color="#28A0F0" size="small" />
        </div>
      )
    }

    return (
      <span className="flex items-center whitespace-nowrap text-sm text-gray-500">
        {tokenBalance ? (
          formatAmount(tokenBalance, {
            decimals: token?.decimals,
            symbol: tokenSymbol
          })
        ) : (
          <div className="mr-2">
            <Loader color="#28A0F0" size="small" />
          </div>
        )}
      </span>
    )
  }, [
    isLoadingAccountType,
    token?.decimals,
    tokenBalance,
    tokenIsAddedToTheBridge,
    tokenIsMETAGoerliNativeUSDC,
    tokenIsMETAOneNativeUSDC,
    tokenSymbol
  ])

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ ...style, minHeight: '84px' }}
      disabled={!tokenIsBridgeable}
      className={twMerge(
        'flex w-full flex-row items-center justify-between bg-white px-4 py-3 hover:bg-gray-100',
        tokenIsBridgeable
          ? 'cursor-pointer opacity-100'
          : 'cursor-not-allowed opacity-50'
      )}
    >
      <div className="flex w-full flex-row items-center justify-start space-x-4">
        <SafeImage
          src={tokenLogoURI}
          alt={`${tokenName} logo`}
          className="h-8 w-8 grow-0 rounded-full"
          fallback={<TokenLogoFallback />}
        />

        <div className="flex w-full flex-col items-start truncate">
          <div className="flex w-full items-center space-x-2">
            <span className="text-base font-medium text-gray-900">
              {tokenSymbol}
            </span>
            <span className="text-xs text-gray-500">{tokenName}</span>

            {ismetachainToken && (
              <Tooltip content={metachainTokenTooltipContent}>
                <StatusBadge variant="green">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span className="text-xs">
                    Official{isSmallScreen ? '' : ' META token'}
                  </span>
                </StatusBadge>
              </Tooltip>
            )}

            {!token && (
              <div className="flex w-full justify-end">
                {tokenBalanceContent}
              </div>
            )}

            {isPotentialFakemetachainToken && (
              <Tooltip content="This token is different from the official metachain token (META).">
                <div className="box-border flex w-max flex-nowrap items-center gap-1 rounded-full border-[1px] border-gray-dark px-1 py-[2px] pr-2 text-sm">
                  <ExclamationCircleIcon className="h-4 w-4 text-gray-dark" />
                  <span className="text-xs text-gray-dark">Careful</span>
                </div>
              </Tooltip>
            )}
          </div>

          {token && (
            <div className="flex w-full flex-col items-start space-y-1">
              {/* TODO: anchor shouldn't be nested within a button */}
              <div className="flex w-full justify-between">
                {isDepositMode ? (
                  <>
                    {isL2NativeToken ? (
                      <BlockExplorerTokenLink
                        chain={l2Network}
                        address={token.address}
                      />
                    ) : (
                      <BlockExplorerTokenLink
                        chain={l1Network}
                        address={token.address}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {tokenHasL2Address ? (
                      <BlockExplorerTokenLink
                        chain={l2Network}
                        address={token.l2Address}
                      />
                    ) : (
                      <span className="text-xs text-gray-900">
                        This token hasn&apos;t been bridged to{' '}
                        {getNetworkName(l2Network.id)}.
                      </span>
                    )}
                  </>
                )}
                {tokenIsBridgeable && tokenBalanceContent}
              </div>
              {isL2NativeToken ? (
                <span className="flex gap-1 text-xs font-normal">
                  {`This token is native to ${getNetworkName(
                    l2Network.id
                  )} and can’t be bridged.`}
                </span>
              ) : (
                <span className="flex gap-1 whitespace-normal text-left text-xs font-normal text-gray-500">
                  {tokenListInfo}
                </span>
              )}
            </div>
          )}

          {isCustomFeeTokenRow && (
            <div className="flex w-full flex-col items-start space-y-1">
              <div className="flex w-full justify-between">
                {isDepositMode && (
                  <BlockExplorerTokenLink
                    chain={l1Network}
                    address={nativeCurrency.address}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </button>
  )
}
