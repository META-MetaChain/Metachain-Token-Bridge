import { Html, Head, Main, NextScript } from 'next/document'

export const siteTitle = 'Bridge to metachain'
const siteDomain = 'https://bridge.metachain-i.co'
const siteDescription =
  'Built to scale Ethereum, metachain brings you 10x lower costs while inheriting Ethereum’s security model. metachain is a Layer 2 Optimistic Rollup.'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/logo.png" />

        <meta name="theme-color" content="#000000" />
        <meta name="description" content={siteDescription} />
        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content={siteDomain} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:image" content={`${siteDomain}/og-image.jpg`} />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="bridge.metachain-i.co" />
        <meta property="twitter:url" content={siteDomain} />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={`${siteDomain}/og-image.jpg`} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
