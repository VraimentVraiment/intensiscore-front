<script setup lang="ts">
definePageMeta({
  title: 'Mes résultats du diagnostic',
})

const {
  validPreviousReports,
} = storeToRefs(useSurveyReportsStore())

const { data: reports, error, pending } = useAsyncData<CmsSurveyRecord[]>('previous-reports', async () => {
  if (!validPreviousReports.value?.length) {
    return []
  }
  const data = await $fetch('/api/reports/list', {
    method: 'POST',
    body: {
      reports: validPreviousReports.value,
      sort: '-date_created',
      fields: ['id', 'date_created', 'survey_label'],
    },
  })
  return data ?? []
}, {
  server: false,
})
const reportCards = computed(() => {
  return reports.value?.map((report) => {
    const date = getReportDate(report.date_created)
    return {
      date,
      id: report.id,
      survey_label: report.survey_label,
    }
  })
})
</script>

<template>
  <AppSection>
    <h1>
      Mes résultats du diagnostic simple
    </h1>
    <ClientOnly>
      <template v-if="!reports?.length">
        <p class="text-xl">
          Vous n'avez pas encore réalisé de diagnostic simple de votre actif. Vous souhaitez mesurer l’usage réel de
          votre actif et évaluer son potentiel d’intensification ? C’est par ici !
        </p>

        <PcoButton
          label="Faire le diagnostic simple"
          icon="ri:arrow-right-line"
          to="/diagnostic-simple"
        />
      </template>
      <template v-else>
        <template v-if="error">
          <p>
            Une erreur est survenue lors de la récupération de vos diagnostics précédents.
          </p>
        </template>
        <template v-else-if="pending">
          <p>
            Chargement en cours...
          </p>
        </template>
        <template v-else-if="reportCards?.length">
          <h2>Vos diagnostics précédents</h2>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ReportCard
              v-for="{ date, id, survey_label }, i in reportCards"
              :key="id"
              :number="reportCards.length - i"
              :date="date"
              :survey-label="survey_label"
              @click="() => navigateTo(`/reports/${id}`)"
            />
          </div>
        </template>
      </template>
    </ClientOnly>
  </AppSection>
</template>
