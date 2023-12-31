import Image, { ImageProps } from 'next/image'
import ThreeMETAinautsImg from '@/images/three-METAinauts.webp'
import { ExternalLink } from '../common/ExternalLink'
import { WalletConnectWarning } from '../common/WalletConnectWarning'

export function AppConnectionFallbackContainer({
  layout = 'col',
  imgProps = {
    className: 'sm:w-[420px]',
    src: ThreeMETAinautsImg,
    alt: 'Three METAinauts',
    priority: true
  },
  children
}: {
  layout?: 'row' | 'col'
  imgProps?: ImageProps
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col">
      <WalletConnectWarning />

      <div className="my-24 flex items-center justify-center px-8">
        <div
          className={`flex flex-col items-center md:flex-${layout} md:items-${
            layout === 'col' ? 'center' : 'start'
          }`}
        >
          {children}
          <ExternalLink href="https://metamask.io/download">
            <Image {...imgProps} />
          </ExternalLink>
        </div>
      </div>
    </div>
  )
}
