<script setup lang="ts">
import * as d3 from 'd3'

const props = defineProps<{
  result: SurveyResultModel
  score: number
}>()
const {
  getRelevantSheets,
} = useGetRelevantSheets()
const { data: sheetItems } = getRelevantSheets(props.result, props.score)
const sheetGroups = computed(() => {
  if (!sheetItems.value) return null
  return d3.group(sheetItems.value, d => d.type)
})
</script>

<template>
  <div class="flex flex-col gap-16">
    <section
      v-if="sheetGroups?.has('methodology')"
    >
      <h3>
        Identifier les nouveaux usages à développer dans vos espaces sous-occupés.
      </h3>
      <p class="text-base mb-12">
        Ces fiches vous permettront d’imaginer les nouveaux programmes que vous pourriez développer en
        complémentarité des activités existantes sur cet actif.
      </p>
      <SheetCardGrid
        :class="'mb-12'"
        :sheets="sheetGroups.get('methodology')"
      />
      <PcoLink to="/fiches/">
        Voir toutes les recommandations
      </PcoLink>
    </section>
    <section
      v-if="sheetGroups?.has('typical_space')"
    >
      <h3>
        S'engager dans les premières étapes de mise en œuvre de votre projet d’intensification.
      </h3>
      <p class="text-base mb-12">
        Retrouvez ici des fiches méthologiques qui détaillent chaque étape clé afin de mettre en œuvre
        l'intensité d'usage dans votre bâtiment.
      </p>
      <SheetCardGrid
        :class="'mb-12'"
        :sheets="sheetGroups.get('typical_space')"
      />
      <PcoLink to="/fiches/">
        Voir toutes les recommandations
      </PcoLink>
    </section>
    <section
      v-if="sheetGroups?.has('use-case')"
    >
      <h3>
        S'inspirer de projets existants
      </h3>
      <SheetCardGrid
        :class="'mb-12'"
        :sheets="sheetGroups.get('use-case')"
      />
      <PcoLink to="/fiches/">
        Voir toutes les recommandations
      </PcoLink>
    </section>
  </div>
</template>
