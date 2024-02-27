<script lang="ts" setup>
import * as d3 from 'd3'

definePageMeta({
  title: 'Le guide',
})

const { guideFilename } = useAppConfig()

const {
  tags,
  tagsPending,
  tagsError,
  pages,
  pagesError,
  pagesPending,
  resetFilters,
} = useFilterableSheets()

const sheetGroups = computed(() => {
  if (!pages.value) return null
  return d3.group(pages.value, d => d.type)
})
</script>

<template>
  <div>
    <ClientOnly>
      <AppSection>
        <h1>
          Le guide
        </h1>
        <p class="text-xl">
          Vous souhaitez passer à l’action et mettre en œuvre l’intensification de votre bâtiment ? Quels sont les enjeux réglementaires, juridiques et assurantiels et comment les traiter ? Quels sont les modèles économiques de ce type de projet ? Les solutions de gestion ? Les usages adaptés aux différents types d’espaces ? C’est à ces questions que ce guide opérationnel vise à répondre. Vous y retrouverez les étapes clés à mettre en place, illustrées par des projets inspirants.
        </p>
        <PcoButton
          label="Télécharger le guide au format PDF"
          icon="ri:download-line"
          :href="`/docs/${guideFilename}`"
          :download="guideFilename"
        />
      </AppSection>
      <AppSection>
        <h2>
          Consulter les fiches
        </h2>
        <div class="mt-12 flex flex-col md:flex-row gap-12">
          <div class="flex-1/4">
            <PcoSpinner v-if="tagsPending" />
            <p v-else-if="tagsError">
              Une erreur est survenue lors du chargement des tags : {{ tagsError }}
            </p>
            <div
              v-if="tags && tags.keywords?.length > 0"
            >
              <h3>
                Filtrer
              </h3>
              <div class="flex flex-col gap-8">
                <div>
                  <h4 class="text-base">
                    Par type de fiche
                  </h4>
                  <TagsList
                    v-model="tags.types"
                  />
                </div>
                <div>
                  <h4 class="text-base">
                    Par mot-clé
                  </h4>
                  <TagsList
                    v-model="tags.keywords"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="flex-3/4 h-100vh overflow-auto mr--8 pr-8">
            <PcoSpinner v-if="pagesPending" />
            <p v-else-if="pagesError">
              Une erreur est survenue lors du chargement des fiches : {{ pagesError }}
            </p>
            <template
              v-else-if="pages?.length > 0"
            >
              <div class="flex flex-col gap-16">
                <section
                  v-if="sheetGroups?.has('methodology')"
                >
                  <h3>
                    S'engager dans les premières étapes de mise en œuvre de votre projet d’intensification.
                  </h3>
                  <p class="text-base mb-12">
                    Retrouvez ici des fiches méthologiques qui détaillent chaque étape clé afin de mettre en œuvre l'intensité d'usage dans votre bâtiment.
                  </p>
                  <SheetCardGrid
                    :class="'mb-12'"
                    :sheets="sheetGroups.get('methodology')"
                  />
                </section>
                <section
                  v-if="sheetGroups?.has('typical_space')"
                >
                  <h3>
                    Identifier les nouveaux usages à développer dans vos espaces sous-occupés.
                  </h3>
                  <p class="text-base mb-12">
                    Ces fiches vous permettront d’imaginer les nouveaux programmes que vous pourriez développer en complémentarité des activités existantes sur cet actif.
                  </p>
                  <SheetCardGrid
                    :class="'mb-12'"
                    :sheets="sheetGroups.get('typical_space')"
                  />
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
                </section>
              </div>
            </template>
            <div
              v-else
            >
              <p>
                Aucun résultat trouvé
              </p>
              <PcoButton
                label="Réinitialiser les filtres"
                icon="ri:refresh-line"
                @click="resetFilters"
              />
            </div>
          </div>
        </div>
      </AppSection>
    </ClientOnly>
  </div>
</template>
