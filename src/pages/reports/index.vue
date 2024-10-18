<script setup lang="ts">
definePageMeta({
  title: 'Mes résultats du diagnostic',
})

const {
  validPreviousReports,
} = storeToRefs(useSurveyReportsStore())

const { data: reports, error, pending } = useAsyncData('previous-reports', async () => {
  if (!validPreviousReports.value?.length) {
    return []
  }
  const data = await $fetch('/api/reports/list', {
    method: 'POST',
    body: {
      reports: validPreviousReports.value,
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
      <template v-if="!validPreviousReports?.length">
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
            <div
              v-for="{ date, id, survey_label }, i in reportCards"
              :key="id"
              class="report-card p-4 bg-white border default-border-box flex flex-col gap-4 justify-between"
            >
              <div>
                <template v-if="survey_label">
                  <p class="text-xs mb-0">
                    Diagnostic <b>n°{{ reportCards.length - i }}</b>
                  </p>
                  <p class="text-lg mt-0 mb-2 font-bold">
                    {{ survey_label }}
                  </p>
                </template>
                <template v-else>
                  <p class="text-lg mb-2">
                    Diagnostic <b>n°{{ reportCards.length - i }}</b>
                  </p>
                </template>
                <p class="mt-1 text-sm text-gray-500">
                  Le {{ date }}
                </p>
              </div>
              <div class="flex self-stretch align-end">
                <PcoLink
                  class="block text-center w-full"
                  :to="`/reports/${id}`"
                >
                  Consulter le résultat
                </PcoLink>
              </div>
            </div>
          </div>
        </template>
      </template>
    </ClientOnly>
  </AppSection>
</template>

<style scoped lang="scss">
.report-card {
  border-radius: $border-radius--md;
  border: solid 1px $border--default;
  box-shadow: $shadow--md;
}
</style>
