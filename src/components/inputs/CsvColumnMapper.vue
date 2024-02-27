<script lang="ts" setup>
defineProps<{
  modelValue: string | undefined
  columnsDomain: string[]
  label: string
}>()
defineEmits(['update:modelValue'])
</script>

<template>
  <CustomListBox
    :model-value="modelValue"
    :items="[
      {
        key: undefined,
        text: 'Aucune',
      },
      ...columnsDomain
        .filter(isCompatible)
        .map((column) => ({
          key: column,
          text: column,
        })),
    ]"
    :label="label"
    @update:model-value="(e) => {
      $emit('update:modelValue', e.key)
    }"
  />
</template>
