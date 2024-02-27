<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'

withDefaults(defineProps<{
  modelValue: (string | number | boolean | object | null | undefined) | (string | number | boolean | object | null | undefined)[]
  buttonLabel?: string
  label: string
  multiple?: boolean
  size?: 'sm' | 'md' | 'lg'
  items: {
    key: string | number | symbol | undefined
    text: string
  }[]
}>(), {
  size: 'sm',
  multiple: false,
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div>
    <p class="text-xs mb-2">
      {{ label }}
    </p>
    <Listbox
      class="listbox"
      as="div"
      :model-value="modelValue"
      :multiple="multiple"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <ListboxButton
        v-slot="{ open }"
        :class="[
          'listbox__button button button--secondary',
          { 'button--xs': size === 'sm' },
          { 'button--sm': size === 'md' },
          { 'button--md': size === 'lg' },
          'w-full',
        ]"
      >
        {{ buttonLabel ? buttonLabel : items
          .find((item) => item.key === modelValue)
          ?.text ?? 'Sélectionner' }}
        <Icon
          :name="open ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'"
          class="ml-2"
        />
      </ListboxButton>
      <ListboxOptions
        :class="[
          'listbox__options',
          'alt-box',
          'z-10 w-full flex flex-col cursor-pointer gap-1 absolute mt-1 border p-2 max-h-60 overflow-y-auto',
        ]"
      >
        <ListboxOption
          v-for="item in items"
          :key="item.key"
          v-slot="{ selected, active: isActive }"
          :value="item"
        >
          <div
            :class="[
              'listbox__option',
              { 'listbox__option--active': isActive },
              { 'listbox__option--selected': selected || modelValue === item.key },
              'alt-action-box',
              { 'contrast-action-box': selected || modelValue === item.key },
              'text-xs flex justify-between items-center pl-2 pr-2 py-1',
            ]"
          >
            <span>
              {{ item.text }}
            </span>
            <Icon
              v-show="selected || modelValue === item.key"
              :name="'ri:check-line'"
              class="ml-2"
            />
          </div>
        </ListboxOption>
      </ListboxOptions>
    </Listbox>
  </div>
</template>

<style scoped lang="scss">
:deep(.listbox) {
  position: relative;
}

.listbox__options {
  box-shadow: $shadow--md;
}
</style>
