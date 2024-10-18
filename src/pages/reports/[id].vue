<script setup lang="ts">
definePageMeta({
  title: 'Résultat du diagnostic',
  middleware: [
    function (to) {
      if (import.meta.client) {
        const {
          isValidReport,
        } = useSurveyReportsStore()

        if (!isValidReport(to.params.id)) {
          return navigateTo('/reports/')
        }
      }
    },
  ],
})

const route = useRoute()
const reportId = route.params.id as string

const {
  data,
  error,
  pending,
} = await useFetch(`/api/reports/${reportId}`)
</script>

<template>
  <div>
    <AppSection>
      <h1>
        Vos résultats au diagnostic simple
      </h1>
      <template v-if="pending">
        <p class="text-xl">
          Chargement des résultats
        </p>
      </template>
      <template v-else-if="error">
        <p class="text-xl">
          Une erreur s'est produite pendant le chargement des résultats :
        </p>
        <p>
          {{ error }}
        </p>
      </template>
      <template v-else-if="data?.data?.content">
        <ClientOnly>
          <SurveyResultReport :data="data.data" />
        </ClientOnly>
      </template>
      <template v-else>
        <p>Report not found</p>
      </template>
    </AppSection>
  </div>
</template>
