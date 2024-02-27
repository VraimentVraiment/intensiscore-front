<script lang="ts" setup>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

defineProps<{
  fileColumns: string[]
  isCompatible: (fileColumn: string) => boolean
}>()
</script>

<template>
  <Menu>
    <MenuButton>More</MenuButton>
    <MenuItems>
      <MenuItem
        v-for="fileColumn in fileColumns.filter(isCompatible)"
        :key="fileColumn"
        :value="fileColumn"
      >
        <span class="select-column__status-icon">
          {{ fileColumn }}
        </span>
      </MenuItem>
    </MenuItems>
  </Menu>
</template>
