import axios from 'axios'
import { schema, TokenList } from '@uniswap/token-lists'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { ImageProps } from 'next/image'
import metachainLogo from '@/images/lists/metachain.svg'
import UniswapLogo from '@/images/lists/uniswap.png'
import GeminiLogo from '@/images/lists/gemini.png'
import CMCLogo from '@/images/lists/cmc.png'
import metachainFoundation from '@/images/lists/metachainFoundation.png'
import { METATokenBridge } from '../hooks/METATokenBridge.types'

export const SPECIAL_metachain_TOKEN_TOKEN_LIST_ID = 0

export interface BridgeTokenList {
  id: number
  originChainID: number
  url: string
  name: string
  isDefault: boolean
  ismetachainTokenTokenList?: boolean
  logoURI: ImageProps['src']
}

export const BRIDGE_TOKEN_LISTS: BridgeTokenList[] = [
  {
    id: SPECIAL_metachain_TOKEN_TOKEN_LIST_ID,
    originChainID: 0, // This token list spans all metachain chains and their L1 counterparts
    url: 'https://tokenlist.metachain-i.co/METATokenLists/metachain_token_token_list.json',
    name: 'metachain Token',
    isDefault: true,
    logoURI: metachainFoundation,
    ismetachainTokenTokenList: true
  },
  {
    id: 1,
    originChainID: 42161,
    url: 'https://tokenlist.metachain-i.co/METATokenLists/METAed_META_whitelist_era.json',
    name: 'metachain Whitelist Era',
    isDefault: true,
    logoURI: metachainLogo
  },
  {
    id: 2,
    originChainID: 42161,
    url: 'https://tokenlist.metachain-i.co/METATokenLists/METAed_uniswap_labs_default.json',
    name: 'METAed Uniswap List',
    isDefault: true,
    logoURI: UniswapLogo
  },
  {
    id: 3,
    originChainID: 42161,
    url: 'https://tokenlist.metachain-i.co/METATokenLists/METAed_gemini_token_list.json',
    name: 'METAed Gemini List',
    isDefault: true,
    logoURI: GeminiLogo
  },
  {
    id: 5,
    originChainID: 42161,
    url: 'https://tokenlist.metachain-i.co/METATokenLists/METAed_coinmarketcap.json',
    name: 'METAed CMC List',
    isDefault: false,
    logoURI: CMCLogo
  },
  {
    id: 6,
    originChainID: 42170,
    url: 'https://tokenlist.metachain-i.co/METATokenLists/42170_METAed_uniswap_labs_default.json',
    name: 'METAed Uniswap List',
    isDefault: true,
    logoURI: UniswapLogo
  },
  {
    id: 7,
    originChainID: 42170,
    url: 'https://tokenlist.metachain-i.co/METATokenLists/42170_METAed_gemini_token_list.json',
    name: 'METAed Gemini List',
    isDefault: true,
    logoURI: GeminiLogo
  },
  {
    id: 8,
    originChainID: 421613,
    url: 'https://tokenlist.metachain-i.co/METATokenLists/421613_METAed_coinmarketcap.json',
    name: 'METAed CMC List',
    isDefault: true,
    logoURI: CMCLogo
  },
  // Dummy data required, otherwise useMETATokenBridge will return undefined bridgeTokens
  // This will cause TokenImportDialog to hang and fail E2E
  // TODO: remove list for chain ID 412346 after fix:
  // https://github.com/META-MetaChain/META-token-bridge/issues/564
  {
    id: 9,
    // Local node
    originChainID: 412346,
    url: 'https://tokenlist.metachain-i.co/METATokenLists/421613_METAed_coinmarketcap.json',
    name: 'METAed CMC List',
    isDefault: true,
    logoURI: CMCLogo
  }
]

export const listIdsToNames: { [key: string]: string } = {}

BRIDGE_TOKEN_LISTS.forEach(bridgeTokenList => {
  listIdsToNames[bridgeTokenList.id] = bridgeTokenList.name
})

export interface TokenListWithId extends TokenList {
  l2ChainId: string
  bridgeTokenListId: number
  isValid?: boolean
}

export const validateTokenList = (tokenList: TokenList) => {
  const ajv = new Ajv()
  addFormats(ajv)
  const validate = ajv.compile(schema)

  return validate(tokenList)
}

export const addBridgeTokenListToBridge = (
  bridgeTokenList: BridgeTokenList,
  METATokenBridge: METATokenBridge
) => {
  fetchTokenListFromURL(bridgeTokenList.url).then(
    ({ isValid, data: tokenList }) => {
      if (!isValid) return

      METATokenBridge.token.addTokensFromList(tokenList!, bridgeTokenList.id)
    }
  )
}

export async function fetchTokenListFromURL(tokenListURL: string): Promise<{
  isValid: boolean
  data: TokenList | undefined
}> {
  try {
    const { data } = await axios.get(tokenListURL, {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })

    if (!validateTokenList(data)) {
      console.warn('Token List Invalid', data)
      return { isValid: false, data }
    }

    return { isValid: true, data }
  } catch (error) {
    console.warn('Token List URL Invalid', tokenListURL)
    return { isValid: false, data: undefined }
  }
}
