import type { RouteLocationRaw } from 'vue-router'

declare global {
  type MenuLinkProps = {
    to?: string | RouteLocationRaw
    text?: string
    icon?: string
    onClick?: ($event: MouseEvent) => void
    class?: string
  }

  type NavMenuProps = {
    title: string
    links?: MenuLinkProps[]
    expandedId?: string
    active?: boolean
  }

  type NavMenuLinks = (
    MenuLinkProps |
    NavMenuProps
  )[]

  type ButtonProps = {
    disabled?: boolean
    label?: string
    secondary?: boolean
    tertiary?: boolean
    noBorder?: boolean
    size?: 'sm' | 'lg' | 'md'
    icon?: string
    iconRight?: boolean
    iconOnly?: boolean
    to?: string | RouteLocationRaw
    target?: string
    href?: string
    download?: string
    type?: 'button' | 'submit' | 'reset' | 'file'
    onClick?: ($event: MouseEvent) => void
  }
}

export {}
