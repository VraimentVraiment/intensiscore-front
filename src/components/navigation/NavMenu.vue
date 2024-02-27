<script lang="ts" setup>
withDefaults(defineProps<{
  items: NavMenuLinks
}>(), {
  items: () => [],
})

const id = useId()

const expandedId = ref<string | undefined>(undefined)

const toggle = (id: string | undefined) => {
  if (id === expandedId.value) {
    expandedId.value = undefined
    return
  }
  expandedId.value = id
}

const onDocumentClick = (e: MouseEvent) => {
  handleElementClick(e.target as HTMLElement)
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    toggle(expandedId.value)
  }
}

const handleElementClick = (el: HTMLElement) => {
  if (el === document.getElementById(id)) {
    return
  }

  if (!el?.parentNode) {
    toggle(expandedId.value)
    return
  }

  handleElementClick(el.parentNode as HTMLElement)
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeyDown)
})
onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <nav
    :id="id"
    role="navigation"
  >
    <ul>
      <li
        v-for="(item, i) of items"
        :key="i"
        :class="[
          { 'nav-item': (item as MenuLinkProps).to && (item as MenuLinkProps).text },
        ]"
      >
        <NavItemLink
          v-if="(item as MenuLinkProps).to && (item as MenuLinkProps).text"
          v-bind="item"
          :expanded-id="expandedId"
          @toggle-id="toggle($event)"
        />
        <NavItemMenu
          v-else-if="(item as NavMenuProps).title && (item as NavMenuProps).links"
          v-bind="(item as NavMenuProps)"
          :expanded-id="expandedId"
          @toggle-id="toggle($event)"
        />
      </li>
    </ul>
  </nav>
</template>
