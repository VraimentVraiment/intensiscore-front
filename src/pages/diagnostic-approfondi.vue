<script setup lang="ts">
import type * as d3 from 'd3'
import { Switch } from '@headlessui/vue'

definePageMeta({
  title: 'Le diagnostic approfondi',
})

const csvStore = useCsvStore()
const {
  csv,
  columns: fileColumns,
} = storeToRefs(csvStore)

const rows = computed(() => {
  return (
    csv.value
      ?.map((row, i) => {
        return Object.assign(row, {
          id: i,
        })
      }) ?? []
  ) as unknown as Array<DirectRow | ComputableRow>
})

const useDirectScoreColumn = ref(false)

const {
  getColumn,
  getColumnLabel,
  getColumnModel,
  updateColumnModel,
  groupKey,
  labelKey,
  areaKey,
} = useCsvColumns()

const {
  totalScore,
  getRowScore,
} = useCsvScore(
  rows,
  useDirectScoreColumn,
  getColumnModel,
)

const {
  treemapOptions,
} = useTreemapOptions({
  groupKey,
  labelKey,
  areaKey,
  getRowScore,
})

const isNotId = (fileColumn: string) => {
  return fileColumn !== 'id'
}

const isValidNameColumn = (fileColumn: string) => {
  return isNotId(fileColumn)
}

const hasNumericValues = (fileColumn: string) => {
  return isNotId(fileColumn) && rows.value
    .filter((row) => {
      const value = row[fileColumn]
      return !isNaN(value)
    })
    ?.length > rows.value.length / 2
}

const hasIntValuesBetween0and5 = (fileColumn: string) => {
  return isNotId(fileColumn) && rows.value
    .filter((row) => {
      const value = row[fileColumn]
      return !isNaN(value) && value >= 0 && value <= 5
    })
    ?.length > rows.value.length / 2
}

const isValidGroupColumn = (fileColumn: string) => {
  return isNotId(fileColumn)
}

const tilingMethod = ref<'binary' | 'squarify' | 'slice' | 'dice' | 'slice-dice' | 'resquarify'>('squarify')

const isTooltipVisible = ref(false)
const tooltipContent = ref<{
  key: string
  value: string
}[]>([])
const setTooltipContent = (datum: d3.HierarchyNode<DirectRow | ComputableRow>) => {
  tooltipContent.value = sharedKeys
    .map((key: SharedKey) => {
      return {
        key: getColumnLabel(key),
        value: datum.data?.[getColumnModel(key)],
      }
    })
    .filter(({ value }: { value: unknown }) => !!value)
}

const expandedId = ref<string | null>(null)
const setExpandedId = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id
}

onMounted(() => {
  setExpandedId('summary-0')
})

const exceptionLegend = {
  color: UNKNOWN_CATEGORY.color,
  label: 'Espace non pris en compte',
}
const colorScaleLegend = [exceptionLegend]
// const colorScaleLegend = [...scoreLegendValues, exceptionLegend]

/**
 * Uncomment the following code to generate a random CSV
 */
// onMounted(() => {
//   const N_SPACES = 30
// // Use { buggy: true } to generate a CSV with missing values
//   const randomCsv = getRandomCsvArray(N_SPACES, { buggy: false })
//   csvStore.setCsv(randomCsv)
// })
</script>

<template>
  <div>
    <AppSection>
      <h1>
        Visualiser mes données d'intensité par surfaces
      </h1>
      <p class="text-xl">
        Vous avez plus de 30 minutes devant vous ?
        Où et quand puis-je intensifier les usages dans mon bâtiment ?
        Cette page présente un prototype de diagnostic approfondi, qui permettra à terme d’intégrer des données précises
        sur votre bâtiment
        (liste des espaces, étages, usages, surfaces, capacitaires, types d’accès, utilisateurs…).
        Il propose ainsi de visualiser vos données d’intensité d’usage par espace et de mieux identifier les
        opportunités temporelles et spatiales offertes par votre bâtiment.
      </p>
    </AppSection>
    <AppSectionSeparator />
    <AppSection>
      <h2>Étape 1 : Télécharger les modèles et exemples de fichier</h2>
      <p class="text-lg">
        Téléchargez les modèles qui vous permettront de structurer vos données afin de les visualiser ensuite dans
        l'outil.
        Nous avons joins à ces modèles des exemples pré-remplis pour vous aider à comprendre comment remplir les
        tableaux, et vous
        permettre de tester la visualisation rapidement.
      </p>
      <div class="button-group">
        <PcoButton
          :size="'lg'"
          :class="'md:flex-1'"
          href="/docs/diagnostic_approfondi_002.xlsx"
          download="diagnostic_approfondi_002.xlsx"
          :label="'Télécharger le modèle excel à compléter'"
          icon="ri:download-2-line"
        />
        <PcoButton
          :size="'lg'"
          :class="'md:flex-1'"
          href="/docs/notice_diagnostic_approfondi_002.docx"
          download="notice_diagnostic_approfondi_002.docx"
          secondary
          :label="'Télécharger la notice d\'utilisation'"
          icon="ri:download-2-line"
        />
      </div>
    </AppSection>
    <AppSectionSeparator :size="'sm'" />
    <ClientOnly>
      <AppSection v-if="!!rows">
        <h2>Étape 2 : Visualiser les données</h2>
        <div>
          <p
            v-if="!rows.length"
            class="text-lg"
          >
            Vous n'avez pas encore importé de fichier CSV.
          </p>
          <template v-else>
            <p>Fichier importé : <i>{{ csvStore.fileName }}</i></p>
          </template>
          <FileManagement
            :class="'max-w-lg '"
            :accept-types="['text/csv']"
            :has-file="!!rows.length"
            :filename="csvStore.fileName"
            :size="!!rows ? 'sm' : 'md'"
            :drop-label="'Glissez un fichier CSV ici'"
            :import-label="'Importer un fichier CSV'"
            :replace-label="'Remplacer le fichier CSV actuel'"
            :delete-label="'Supprimer le fichier CSV actuel'"
            @reset="csvStore.$reset"
            @file-read="({ file, content }) => {
              csvStore.setFileName(file.name)
              csvStore.setCsv(csvStore.parseCsv(content))
            }"
          />
        </div>
        <div
          v-if="rows.length"
          class="flex flex-col md:flex-row justify-stretch items-start gap-12 mt-12"
        >
          <div class="chart-configuration p-4 align-self-start w-full basis-100% md:basis-40% lg:basis-30%">
            <h3 class="text-lg mb-4">
              Configuration
            </h3>
            <div class="">
              <PcoAccordion
                id="summary-0"
                :expanded-id="expandedId"
                @toggle-id="setExpandedId"
              >
                <template #summary>
                  <h4 class="mb-3 text-sm">
                    Description des espaces
                  </h4>
                </template>
                <template #content>
                  <div class="flex flex-col gap-2">
                    <CsvColumnMapper
                      :model-value="getColumnModel('name')"
                      :label="getColumnLabel('name')"
                      :columns-domain="fileColumns.filter(isValidNameColumn)"
                      @update:model-value="updateColumnModel('name', $event)"
                    />
                    <CsvColumnMapper
                      :model-value="getColumnModel('area')"
                      :label="getColumnLabel('area')"
                      :columns-domain="fileColumns.filter(hasNumericValues)"
                      @update:model-value="updateColumnModel('area', $event)"
                    />
                  </div>
                </template>
              </PcoAccordion>
              <PcoAccordion
                :expanded-id="expandedId"
                class="flex-1"
                @toggle-id="setExpandedId"
              >
                <template #summary>
                  <h4 class="text-sm mb-2">
                    Grouper les espaces
                  </h4>
                </template>
                <template #content>
                  <div class="flex flex-col gap-2">
                    <CustomListBox
                      :model-value="tilingMethod"
                      :items="[
                        {
                          key: 'binary',
                          text: 'Équilibrée',
                        },
                        {
                          key: 'squarify',
                          text: 'Le plus carré possible',
                        },
                        {
                          key: 'slice-dice',
                          text: 'Tranches',
                        },
                      ]"
                      :label="'Méthode de tuilage'"
                      @update:model-value="(e) => {
                        tilingMethod = e.key
                      }"
                    />
                    <CsvColumnMapper
                      :model-value="getColumnModel('group')"
                      :class="'basis-25% grow-0.15'"
                      :label="getColumnLabel('group')"
                      :columns-domain="fileColumns.filter(isValidGroupColumn)"
                      @update:model-value="getColumn('group').columnName = $event"
                    />
                  </div>
                </template>
              </PcoAccordion>
              <PcoAccordion
                :expanded-id="expandedId"
                @toggle-id="setExpandedId"
              >
                <template #summary>
                  <h4 class="text-sm mb-2">
                    Calcul de l'Intensi'Score
                  </h4>
                </template>
                <template #content>
                  <div class="flex flex-col gap-2">
                    <div class="flex flex-row gap-2 items-center ">
                      <Switch
                        v-slot="{ checked }"
                        v-model="useDirectScoreColumn"
                        as="template"
                      >
                        <button
                          class="switch-button p-0 relative inline-flex h-5 min-w-9 w-9 items-center rounded-full cursor-pointer border-solid border-1"
                          :class="checked ? 'border-border-active bg-alt_bg-active' : 'border-border-default bg-alt_bg-default'"
                        >
                          <span class="sr-only">Lire le score depuis une seule colonne</span>
                          <span
                            :class="checked ? 'translate-x-4.5 bg-contrast_bg-default' : 'translate-x-0.5 bg-border-default'"
                            class="inline-block h-4 w-4 transform rounded-full transition"
                          />
                        </button>
                      </Switch>
                      <p class="text-xs m-0">
                        Lire le score depuis une seule colonne
                      </p>
                    </div>
                    <CsvColumnMapper
                      v-if="useDirectScoreColumn"
                      :model-value="getColumnModel('direct-score')"
                      :label="getColumnLabel('direct-score')"
                      :columns-domain="fileColumns.filter(hasIntValuesBetween0and5)"
                      @update:model-value="updateColumnModel('direct-score', $event)"
                    />
                    <template v-else>
                      <div class="max-h-[min(35vh,450px)] overflow-y-auto flex flex-col p-2 gap-2">
                        <CsvColumnMapper
                          v-for="key in computableKeys"
                          :key="key"
                          :model-value="getColumnModel(key)"
                          :label="getColumnLabel(key)"
                          :columns-domain="fileColumns"
                          @update:model-value="updateColumnModel(key, $event)"
                        />
                      </div>
                    </template>
                  </div>
                </template>
              </PcoAccordion>
              <!-- <PcoAccordion
                :expanded-id="expandedId"
                @toggle-id="setExpandedId"
              >
                <template #summary>
                  <h3 class="text-sm">
                    Informations
                  </h3>
                </template>
                <template #content>
                  <p class="text-sm">
                    <PcoLink to="/diagnostic-actif">
                      En savoir plus sur le calcul de l’intensiscore
                    </PcoLink>
                  </p>
                  <p class="text-sm">
                    Attention : La fiabilité de ce score dépend de celle des données entrées.
                  </p>
                </template>
              </PcoAccordion> -->
            </div>
          </div>
          <div class="basis-100% md:basis-60% lg:basis-70% grow-1 shrink-1">
            <div class="mb-4 mx-3 flex flex-col gap-8 md:gap-12 md:flex-row items-start md:items-end">
              <div v-if="totalScore">
                <h3 class="text-sm">
                  Intensi'Score total
                </h3>
                <ScoreViewer
                  size="lg"
                  :score="totalScore"
                />
              </div>
              <!-- <div>
                <h3 class="text-sm mb-2">
                  Légende de l'Intensi'Score
                </h3>
                <ColorScaleLegend :values="colorScaleLegend" />
                <ScoreLegendRamp />
              </div> -->
            </div>
            <TreemapCharts
              v-if="rows?.length"
              :options="treemapOptions"
              :tiling-method="tilingMethod"
              :data="rows"
              @node:mouseover="datum => {
                isTooltipVisible = true
                setTooltipContent(datum)
              }"
              @node:mouseout="() => {
                isTooltipVisible = false
              }"
            />
            <PcoTooltip :visible="isTooltipVisible && tooltipContent.length > 0">
              <div class="p-4 flex flex-col gap-2">
                <template
                  v-for="{ key, value } in tooltipContent"
                  :key="key"
                >
                  <div v-if="key && value">
                    <h3 class="text-sm m-0">
                      {{ key }}
                    </h3>
                    <p class="text-sm m-0">
                      {{ value }}
                    </p>
                  </div>
                </template>
              </div>
            </PcoTooltip>
          </div>
        </div>
      </AppSection>
    </ClientOnly>
  </div>
</template>

<style scoped lang="scss">
.chart-configuration {
  @extend %default-box-border-md;
}
</style>
