<script lang="ts" setup>
const props = withDefaults(defineProps<NavMenuProps>(), {
  links: () => [],
  expandedId: '',
})

defineEmits<{ (event: 'toggle-id', id: string): void }>()

const id = useId()

const isExpanded = computed(() => id === props.expandedId)
</script>

<template>
  <div class="nav-menu">
    <PcoButton
      tertiary
      no-border
      class="nav-menu__button alt-action-text"
      :aria-expanded="isExpanded"
      :aria-current="active || undefined"
      :aria-controls="id"
      :icon="isExpanded ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'"
      :label="title"
      @click="$emit('toggle-id', id)"
    />
    <div
      :id="id"
      ref="collapse"
      :class="[
        'nav-menu__collapse',
        'mt-2 absolute z-20 right-0 mr-8',
        { 'nav-menu__collapse--expanded': isExpanded },
        { hidden: !isExpanded },
        { block: isExpanded },
      ]"
    >
      <ul
        role="list"
        :class="[
          'menu__list',
          'px-3 py-4 flex flex-col gap-3',
        ]"
      >
        <li
          v-for="(link, i) of links"
          :key="i"
          :class="[
            'nav-item',
            'text-left',
          ]"
        >
          <NavItemLink
            v-bind="link"
            @toggle-id="$emit('toggle-id', expandedId)"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.nav-menu__collapse {
  box-shadow: $shadow--lg;
  border: solid 1px;

  @extend %default-box;
}
</style>
