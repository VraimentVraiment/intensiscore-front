<script lang="ts" setup>
import { NuxtLink } from '#components'

const props = withDefaults(defineProps<MenuLinkProps>(), {
  icon: undefined,
  onClick: () => undefined,
  text: '',
  to: '#',
})

defineEmits<{ (event: 'toggle-id', id: string): void }>()

const id = useId()

const isExternal = computed(() => typeof props.to === 'string' && props.to.startsWith('http'))
</script>

<template>
  <component
    :is="!isExternal ? NuxtLink : 'a'"
    :href="!isExternal ? (props.to as string) : undefined"
    :to="!isExternal ? undefined : props.to"
    @click="$emit('toggle-id', id)"
  >
    {{ text }}
  </component>
</template>
