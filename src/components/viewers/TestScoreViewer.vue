<script setup lang="ts">
withDefaults(defineProps<{
  light: boolean
}>(), {
  light: false,
})
</script>

<template>
  <ScoreViewer
    v-if="!light"
    :score="-1"
  />
  <ScoreViewer
    v-if="!light"
    :score="0"
  />
  <ScoreViewer
    :score="0.1"
  />
  <ScoreViewer
    v-if="!light"
    :score="0.2"
  />
  <ScoreViewer :score="0.3" />
  <ScoreViewer
    v-if="!light"
    :score="0.4"
  />
  <ScoreViewer :score="0.5" />
  <ScoreViewer
    v-if="!light"
    :score="0.6"
  />
  <ScoreViewer :score="0.7" />
  <ScoreViewer
    v-if="!light"
    :score="0.8"
  />
  <ScoreViewer :score="0.9" />
  <ScoreViewer
    v-if="!light"
    :score="1"
  />
  <ScoreViewer
    v-if="!light"
    :score="2"
  />
</template>
