<script lang="ts" setup>
defineProps<{
  sheets: SheetProps[]
}>()
</script>

<template>
  <div
    :class="[
      'card-grid',
      'grid gap-8',
    ]"
  >
    <template v-if="sheets">
      <SheetCard
        v-for="sheet in sheets"
        :key="sheet.id"
        v-bind="sheet"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.card-grid {
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
}
</style>
