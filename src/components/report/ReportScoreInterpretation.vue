<script lang="ts" setup>
const props = withDefaults(defineProps<{
  score: number
  showLink?: boolean
  mainUsages?: UsageIds[]
}>(), {
  mainUsages: () => [],
  showLink: true,
})

const meanUsages = getMeanUsages(props.mainUsages)
  ?.map((usage) => {
    const splitted = usage.split(' ')
    const score = splitted.pop()
    return {
      usage: splitted.join(' '),
      score,
    }
  })
</script>

<template>
  <div class="">
    <h3 class="text-lg mb-0">
      Comment interpréter ce score ?
    </h3>
    <p>
      <Icon
        name="ri:arrow-right-line"
        class="mr-1"
      />
      Ce score reflète un bâtiment avec une <span class="alt-box px-2 font-semibold">
        {{ getScoreInterpretation(score) }}
      </span>
    </p>
    <p>
      <Icon
        name="ri:arrow-right-line"
        class="mr-1"
      />Il révèle un <span class="alt-box px-2 font-semibold">
        {{ getScoreOpportunity(score) }}
      </span>.
      {{ getScoreOpportunityDetails(score) }}
    </p>
    <template
      v-if="meanUsages.length > 0"
    >
      <h3 class="text-lg">
        Comparé aux autres bâtiments :
      </h3>
      <ul>
        <li
          v-for="usage in meanUsages"
          :key="usage.usage"
        >
          <p>
            <Icon
              name="ri:arrow-right-line"
              class="mr-1"
            />
            {{ usage.usage }} <span class="alt-box px-2 font-semibold">{{ usage.score }}
            </span>
          </p>
        </li>
      </ul>
    </template>
    <p class="text-sm leading-loose mt-8 mb-0">
      <Icon
        name="ri:information-line"
        class="mr-1"
      />
      La fiabilité de l'Intensi'Score dépend de celle des données entrées.
    </p>
    <p
      v-if="showLink"
      class="text-sm leading-loose mt-2"
    >
      <PcoLink to="/content/comprendre-score">
        En savoir plus sur le calcul de l’Intensi'Score
      </PcoLink>
    </p>
  </div>
</template>
