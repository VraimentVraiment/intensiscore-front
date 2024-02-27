declare module 'showdown' {
  export class Converter {
    makeHtml: (text: string) => string
  }
}

declare module 'uuid' {
  export const v4: () => string
}

declare module '@headlessui/vue' {
  export const Switch: unknown
  export const Listbox: unknown
  export const ListboxButton: unknown
  export const ListboxOptions: unknown
  export const ListboxOption: unknown
  export const Disclosure: unknown
  export const DisclosureButton: unknown
  export const DisclosurePanel: unknown
  export const Menu: unknown
  export const MenuButton: unknown
  export const MenuItems: unknown
  export const MenuItem: unknown
  export const Popover: unknown
  export const PopoverButton: unknown
  export const PopoverPanel: unknown
}
