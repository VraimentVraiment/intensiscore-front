<script lang="ts" setup>
const model = defineModel<TagProps[]>()
</script>

<template>
  <div
    class="tags-list"
  >
    <template
      v-for="tag in model"
      :key="tag.name"
    >
      <PcoTag
        v-model:is-active="tag.isActive"
        v-bind="tag"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
