<script lang="ts" setup>
const props = withDefaults(defineProps<SheetProps>(), {
  tags: () => [],
  actionText: 'Voir la fiche',
  actionIcon: 'ri:arrow-right-s-line',
})

const getTagsProps = computed(() => {
  return props.tags.map(tag => ({
    name: tag,
    size: 'sm',
  })) as TagProps[]
})

const hasImage = computed(() => {
  return props.image?.split('/').pop() !== 'null'
})
</script>

<template>
  <div
    :class="[
      'card',
      'flex flex-col overflow-hidden border default-box',
    ]"
  >
    <div
      v-if="hasImage"
      :class="[
        'card__image',
      ]"
    >
      <img
        :src="image"
        alt="Image de la fiche"
        class="object-cover w-full h-full h-24 lg:h-32"
        crossorigin="anonymous"
      >
    </div>
    <section
      :class="[
        'card__content',
        'p-4 flex flex-col gap-2 flex-1 gap-4 self-stretch',
      ]"
    >
      <h3 class="card__title m-0 text-base leading-tight">
        {{ title }}
      </h3>
      <p class="card__description text-sm m-0">
        {{ description }}
      </p>
      <!-- <TagsList
        v-if="tags.length > 0"
        :model-value="getTagsProps"
      /> -->
    </section>
    <div
      :class="
        [
          'card__action',
          'p-2px border-t border-alt_border-default',
        ]"
    >
      <PcoButton
        :style="{
          height: '2.5rem',
        }"
        secondary
        size="sm"
        :to="`/fiches/${id}`"
        :label="actionText"
        :icon="actionIcon"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  box-shadow: $shadow--md;
background: white;

  // &__image {
    // background-color: $contrast-background--default;
  // }

  &__action {
    :deep(.button) {
      width: 100%;
      border: none !important;
      border-radius: 0 0 calc($border-radius--sm - 4px) calc($border-radius--sm - 4px);
    }
  }
}
</style>
