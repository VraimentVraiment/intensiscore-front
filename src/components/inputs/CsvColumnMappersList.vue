<script lang="ts" setup>
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

withDefaults(defineProps<{
  columnsDomain: string[]
  columnsRange: CsvKey[]
  label: string
  secondary?: boolean
  getColumn: (key: CsvKey) => ColumnModel | undefined
}>(), {
  secondary: false,
})
</script>

<template>
  <Popover class="relative">
    <PopoverButton
      :class="[
        'button',
        { 'button--secondary': secondary },
        { 'button--primary': !secondary },
      ]"
    >
      {{ label }}
    </PopoverButton>
    <PopoverPanel class="absolute z-10 mt-2">
      <ul
        role="list"
        :class="[
          'mappers-list',
          'p-4 flex flex-col gap-2',
        ]"
      >
        <li
          v-for="key in columnsRange"
          :key="key"
          :class="[
            'mappers-list__item',
          ]"
        >
          <CsvColumnMapper
            v-model="getColumn(key).columnName"
            :label="getColumn(key)?.label || key"
            :columns-domain="columnsDomain"
            :is-empty="!columnsRange.includes(key)"
          />
        </li>
      </ul>
    </PopoverPanel>
  </Popover>
</template>

<style scoped lang="scss">
.mappers-list {
  border-radius: $border-radius--md;
  box-shadow: $shadow--md;
  background: $background--default;
  border: solid 1px $border--default;
  width: min(90vw, 32rem);
}
</style>
