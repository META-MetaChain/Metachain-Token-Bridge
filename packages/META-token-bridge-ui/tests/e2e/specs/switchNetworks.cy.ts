/**
 * When user wants to bridge ETH from L1 to L2
 */

import { optimism } from 'wagmi/chains'

describe('Switch Networks', () => {
  context('User is on test network L1', () => {
    it('should show L1 and L2 chains correctly', () => {
      cy.login({ networkType: 'L1' })
      cy.findByRole('button', { name: /From: Ethereum/i }).should('be.visible')
      cy.findByRole('button', { name: /To: metachain/i }).should('be.visible')
    })

    context('Test Networks dropdown in Nav bar', () => {
      it('should show and open the networks dropdown', () => {
        // to view the correct list of networks (and not testnets), first navigate to mainnet
        cy.login({
          networkType: 'L1',
          networkName: 'mainnet'
        })
        cy.waitUntil(
          () =>
            cy
              .findByRole('button', { name: /From: Ethereum/i })
              .should('be.visible'),
          {
            errorMsg: "Can't find /From: Ethereum/i",
            timeout: 10000,
            interval: 500
          }
        )
        cy.findByRole('button', { name: /Selected Network : /i })
          .should('be.visible')
          .click()

        cy.findByRole('button', { name: /Switch to metachain One/i }).should(
          'be.visible'
        )

        //close the dropdown
        cy.findByRole('button', { name: /Selected Network : /i })
          .should('be.visible')
          .click()
      })

      // TODO: fix META1 network switch:
      // Disclaimer pops up in the Metamask notification, need to find a way to click it.
      // it('should change network to metachain One successfully', () => {
      //   cy.findByRole('button', { name: /Selected Network : /i })
      //     .should('be.visible')
      //     .click()

      //   cy.findByRole('button', { name: /Switch to metachain One/i })
      //     .should('be.visible')
      //     .click()

      //   cy.allowMetamaskToAddAndSwitchNetwork().then(() => {
      //     cy.findByRole('button', {
      //       name: /Selected Network : metachain One/i
      //     }).should('be.visible')
      //   })
      // })

      it('should change network to metachain Nova successfully', () => {
        cy.login({
          networkType: 'L1'
        })
        cy.waitUntil(
          () =>
            cy
              .findByRole('button', { name: /From: Ethereum/i })
              .should('be.visible'),
          {
            errorMsg: "Can't find /From: Ethereum/i",
            timeout: 10000,
            interval: 500
          }
        )
        cy.findByRole('button', { name: /Selected Network : /i })
          .should('be.visible')
          .click()

        cy.findByRole('button', { name: /Switch to metachain Nova/i }).click()

        cy.allowMetamaskToAddAndSwitchNetwork().then(() => {
          cy.findByRole('button', {
            name: /Selected Network : metachain Nova/i
          }).should('be.visible')
        })
      })

      it('should change network to Ethereum mainnet successfully', () => {
        cy.login({ networkType: 'L1' })
        cy.waitUntil(
          () =>
            cy
              .findByRole('button', { name: /From: metachain Nova/i })
              .should('be.visible'),
          {
            errorMsg: "Can't find /From: metachain Nova/i",
            timeout: 10000,
            interval: 500
          }
        ).then(() => {
          cy.findByRole('button', { name: /Selected Network : /i })
            .should('be.visible')
            .click()

          cy.findByRole('button', { name: /Switch to Ethereum/i }).click()

          cy.allowMetamaskToSwitchNetwork().then(() => {
            cy.findByRole('button', {
              name: /Selected Network : Ethereum/i
            }).should('be.visible')
          })
        })
      })
    })

    context('Test Networks list in Wrong Network UI', () => {
      it('should show wrong network UI', () => {
        cy.login({ networkType: 'L1' })
        // wrong network UI flaky right after login, cy.wait fixes the flaky test
        // eslint-disable-next-line
        cy.wait(5000)
        cy.addMetamaskNetwork({
          networkName: optimism.name,
          rpcUrl: optimism.rpcUrls.default.http[0],
          chainId: String(optimism.id),
          symbol: optimism.nativeCurrency.symbol,
          isTestnet: false
        }).then(() => {
          cy.waitUntil(
            () =>
              cy
                .findByText(/Oops! You’re connected to the wrong network/i)
                .should('be.visible'),
            {
              errorMsg:
                "Can't find /Oops! You’re connected to the wrong network/i",
              timeout: 10000,
              interval: 500
            }
          ).then(() => {
            context('Allow Network change from wrong network UI list', () => {
              cy.findByRole('button', {
                name: /Switch to Ethereum/i
              })
                .should('be.visible')
                .click()

              cy.allowMetamaskToSwitchNetwork().then(() => {
                cy.findByRole('button', {
                  name: /Selected Network : Ethereum/i
                }).should('be.visible')
              })
            })
          })
        })
      })
    })
  })
})
