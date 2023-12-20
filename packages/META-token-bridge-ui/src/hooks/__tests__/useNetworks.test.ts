/**
 * @jest-environment jsdom
 */
import { ChainId, customChainLocalStorageKey } from '../../util/networks'
import { sanitizeQueryParams } from '../useNetworks'

describe('sanitizeQueryParams', () => {
  let localStorageGetItemMock: jest.Mock

  beforeAll(() => {
    localStorageGetItemMock = global.Storage.prototype.getItem = jest.fn(
      key => {
        if (key === customChainLocalStorageKey) {
          return JSON.stringify([
            {
              chainID: '1111',
              partnerChainID: ChainId.metachainGoerli,
              name: 'custom 1111 chain'
            },
            {
              chainID: '2222',
              partnerChainID: ChainId.metachainSepolia,
              name: 'custom 2222 chain'
            },
            {
              chainID: '3333',
              partnerChainID: ChainId.metachainOne,
              name: 'custom 3333 chain'
            },
            {
              chainID: '4444',
              partnerChainID: ChainId.metachainNova,
              name: 'custom 4444 chain'
            }
          ])
        }
        return null
      }
    )
  })

  afterAll(() => {
    localStorageGetItemMock.mockReset()
  })

  describe('when `destinationChainId` is valid and `sourceChainId` is valid', () => {
    it('should not do anything', () => {
      const result = sanitizeQueryParams({
        sourceChainId: ChainId.Sepolia,
        destinationChainId: ChainId.metachainSepolia
      })
      expect(result).toEqual({
        sourceChainId: ChainId.Sepolia,
        destinationChainId: ChainId.metachainSepolia
      })

      // Orbit chains
      const resultWithSepoliaOrbitChain = sanitizeQueryParams({
        sourceChainId: 2222,
        destinationChainId: ChainId.metachainSepolia
      })
      expect(resultWithSepoliaOrbitChain).toEqual({
        sourceChainId: 2222,
        destinationChainId: ChainId.metachainSepolia
      })

      const resultWithGoerliOrbitChain = sanitizeQueryParams({
        sourceChainId: 1111,
        destinationChainId: ChainId.metachainGoerli
      })
      expect(resultWithGoerliOrbitChain).toEqual({
        sourceChainId: 1111,
        destinationChainId: ChainId.metachainGoerli
      })
    })
  })
  describe('when `destinationChainId` is valid and `sourceChainId` is invalid', () => {
    it('should set `sourceChainId`', () => {
      const result = sanitizeQueryParams({
        sourceChainId: 1234,
        destinationChainId: ChainId.metachainSepolia
      })
      expect(result).toEqual({
        sourceChainId: ChainId.Sepolia,
        destinationChainId: ChainId.metachainSepolia
      })

      // Orbit chains
      const resultWithGoerliOrbitChain = sanitizeQueryParams({
        sourceChainId: 1234,
        destinationChainId: 1111
      })
      expect(resultWithGoerliOrbitChain).toEqual({
        sourceChainId: ChainId.metachainGoerli,
        destinationChainId: 1111
      })

      const resultWithSepoliaOrbitChain = sanitizeQueryParams({
        sourceChainId: 1234,
        destinationChainId: 2222
      })
      expect(resultWithSepoliaOrbitChain).toEqual({
        sourceChainId: ChainId.metachainSepolia,
        destinationChainId: 2222
      })

      const resultWithmetachainOneChain = sanitizeQueryParams({
        sourceChainId: 1234,
        destinationChainId: 3333
      })
      expect(resultWithmetachainOneChain).toEqual({
        sourceChainId: ChainId.metachainOne,
        destinationChainId: 3333
      })

      const resultWithmetachainNovaChain = sanitizeQueryParams({
        sourceChainId: 1234,
        destinationChainId: 4444
      })
      expect(resultWithmetachainNovaChain).toEqual({
        sourceChainId: ChainId.metachainNova,
        destinationChainId: 4444
      })
    })
  })
  describe('when `destinationChainId` is valid and `sourceChainId` is undefined', () => {
    it('should set `sourceChainId`', () => {
      const result = sanitizeQueryParams({
        sourceChainId: undefined,
        destinationChainId: ChainId.metachainNova
      })
      expect(result).toEqual({
        sourceChainId: ChainId.Ethereum,
        destinationChainId: ChainId.metachainNova
      })

      const resultWithGoerliOrbitChain = sanitizeQueryParams({
        sourceChainId: undefined,
        destinationChainId: 1111
      })
      expect(resultWithGoerliOrbitChain).toEqual({
        sourceChainId: ChainId.metachainGoerli,
        destinationChainId: 1111
      })
      const resultWithSepoliaOrbitChain = sanitizeQueryParams({
        sourceChainId: undefined,
        destinationChainId: 2222
      })
      expect(resultWithSepoliaOrbitChain).toEqual({
        sourceChainId: ChainId.metachainSepolia,
        destinationChainId: 2222
      })
    })
  })

  describe('when `destinationChainId` is invalid and `sourceChainId` is valid', () => {
    it('should set `destinationChainId`', () => {
      const result = sanitizeQueryParams({
        sourceChainId: ChainId.Sepolia,
        destinationChainId: 12345
      })
      expect(result).toEqual({
        sourceChainId: ChainId.Sepolia,
        destinationChainId: ChainId.metachainSepolia
      })

      // Orbit chains
      const resultWithGoerliOrbitChain = sanitizeQueryParams({
        sourceChainId: 1111,
        destinationChainId: 1234
      })
      expect(resultWithGoerliOrbitChain).toEqual({
        sourceChainId: 1111,
        destinationChainId: ChainId.metachainGoerli
      })

      const resultWithSepoliaOrbitChain = sanitizeQueryParams({
        sourceChainId: 2222,
        destinationChainId: 1234
      })
      expect(resultWithSepoliaOrbitChain).toEqual({
        sourceChainId: 2222,
        destinationChainId: ChainId.metachainSepolia
      })

      const resultWithmetachainOneChain = sanitizeQueryParams({
        sourceChainId: 3333,
        destinationChainId: 1234
      })
      expect(resultWithmetachainOneChain).toEqual({
        sourceChainId: 3333,
        destinationChainId: ChainId.metachainOne
      })

      const resultWithmetachainNovaChain = sanitizeQueryParams({
        sourceChainId: 4444,
        destinationChainId: 1234
      })
      expect(resultWithmetachainNovaChain).toEqual({
        sourceChainId: 4444,
        destinationChainId: ChainId.metachainNova
      })
    })
  })
  describe('when `destinationChainId` is invalid and `sourceChainId` is invalid', () => {
    it('should set both chainId', () => {
      const result = sanitizeQueryParams({
        sourceChainId: 1234,
        destinationChainId: 12345
      })
      expect(result).toEqual({
        sourceChainId: ChainId.Ethereum,
        destinationChainId: ChainId.metachainOne
      })
    })
  })
  describe('when `destinationChainId` is invalid and `sourceChainId` is undefined', () => {
    it('should set both chainId', () => {
      const result = sanitizeQueryParams({
        sourceChainId: undefined,
        destinationChainId: 12345
      })
      expect(result).toEqual({
        sourceChainId: ChainId.Ethereum,
        destinationChainId: ChainId.metachainOne
      })
    })
  })

  describe('when `destinationChainId` is undefined and `sourceChainId` is valid', () => {
    it('should set `destinationChainId`', () => {
      const result = sanitizeQueryParams({
        sourceChainId: ChainId.Sepolia,
        destinationChainId: undefined
      })
      expect(result).toEqual({
        sourceChainId: ChainId.Sepolia,
        destinationChainId: ChainId.metachainSepolia
      })

      // Orbit chains
      const resultWithSepoliaOrbitChain = sanitizeQueryParams({
        sourceChainId: 2222,
        destinationChainId: undefined
      })
      expect(resultWithSepoliaOrbitChain).toEqual({
        sourceChainId: 2222,
        destinationChainId: ChainId.metachainSepolia
      })

      const resultWithGoerliOrbitChain = sanitizeQueryParams({
        sourceChainId: 1111,
        destinationChainId: undefined
      })
      expect(resultWithGoerliOrbitChain).toEqual({
        sourceChainId: 1111,
        destinationChainId: ChainId.metachainGoerli
      })
    })
  })
  describe('when `destinationChainId` is undefined and `sourceChainId` is invalid', () => {
    it('should set both chainId', () => {
      const result = sanitizeQueryParams({
        sourceChainId: 1234,
        destinationChainId: undefined
      })
      expect(result).toEqual({
        sourceChainId: ChainId.Ethereum,
        destinationChainId: ChainId.metachainOne
      })
    })
  })
  describe('when`destinationChainId` is undefined and`sourceChainId` is undefined', () => {
    it('should set both chainId', () => {
      const result = sanitizeQueryParams({
        sourceChainId: undefined,
        destinationChainId: undefined
      })
      expect(result).toEqual({
        sourceChainId: ChainId.Ethereum,
        destinationChainId: ChainId.metachainOne
      })
    })
  })
})
