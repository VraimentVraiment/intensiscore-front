<script lang="ts" setup>
defineProps<{
  score: number
  mainUsages: UsageIds[]
}>()
</script>

<template>
  <div class="flex flex-col md:flex-row gap-8 lg:gap-12  lg:px-6 lg:py-2">
    <div class="md-flex-1 lg:basis-36%">
      <div>
        <h3 class="text-lg mb-0">
          Intensi'Score de votre bâtiment
        </h3>
        <p class="text-sm text-gray-500 mt-2 mb-4">
          sur une année type
        </p>
        <ScoreViewer
          :score="score"
          size="lg"
        />
      </div>
    </div>
    <div class="v-divider basis-1px" />
    <div class="md-flex-1 lg:basis-63%">
      <ReportScoreInterpretation
        :score="score"
        :main-usages="mainUsages"
      />
    </div>
  </div>
</template>
