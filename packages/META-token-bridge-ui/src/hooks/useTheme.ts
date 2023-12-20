import { useEffect } from 'react'
import useLocalStorage from '@rehooks/local-storage'

export const themeLocalStorageKey = 'metachain:bridge:preferences:theme'

export const classicThemeKey = 'metachain-classic-theme'

export const THEME_CONFIG = [
  {
    id: 'space',
    label: 'Space',
    description:
      'A dark, space-themed UI with a sleek and futuristic aesthetic, featuring METAinaut on a backdrop of shining stars and moon.'
  },
  {
    id: classicThemeKey,
    label: 'metachain Classic',
    description:
      'metachain before it was cool: A reminiscent of the pre-nitro era, with simple, solid buttons, a minimal purple layout and chunky fonts.'
  }
]

export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage<string>(themeLocalStorageKey)

  useEffect(() => {
    if (!theme) return
    document.body.className = theme
  }, [theme])

  return [theme, setTheme] as const
}
