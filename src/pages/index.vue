<script setup lang="ts">
const { guideFilename } = useAppConfig()
</script>

<template>
  <div>
    <div class="cover site-padding-x w-full">
      <picture>
        <NuxtSource
          media="(orientation: landscape)"
          :src="'/img/banner-md@2x.png'"
        />
        <NuxtSource
          media="(orientation: portrait)"
          :src="'/img/banner-sm@2x.png'"
        />
        <NuxtImg
          preload
          alt="Bannière du site"
          :class="'w-full'"
          width="800"
          height="400"
          format="webp"
          :src="'/img/banner-sm@2x.png'"
          sizes:="400px sm:100vw lg:1000px xl:1200px"
        />
      </picture>
    </div>
    <AppSection>
      <h1>
        Connaître et améliorer l’intensité d’usage de mon bâtiment
      </h1>
      <p class="text-xl">
        Les bâtiments et les espaces, qu’ils soient publics ou privés, sont largement sous-utilisés.
        Pourtant, une meilleure exploitation offrirait des bénéfices écologiques, économiques et sociaux potentiellement colossaux.
        Comment maximiser l’usage des bâtiments ?
      </p>
      <p class="text-xl">
        C'est toute l'ambition de cet outil, l'« Intensi'Score »,
        qui vise à évaluer le potentiel d’intensification des espaces et
        propose des mesures concrètes afin de mieux utiliser le bâti existant.
      </p>
      <p class="text-xl">
        À travers un court questionnaire, diagnostiquez votre bâtiment et découvrez les solutions pour l’intensifier.
      </p>
      <br>
      <div class="button-group">
        <PcoButton
          size="lg"
          :class="'md:basis-50%! md:grow-0!'"
          :to="'/diagnostic-simple'"
          :label="'Je fais le diagnostic'"
          icon="ri:arrow-right-line"
        />
        <!-- <PcoButton
          size="lg"
          to="/diagnostic-approfondi"
          secondary
          :label="'Je fais le diagnostic approfondi'"
          icon="ri:arrow-right-line"
        /> -->
      </div>
    </AppSection>
    <AppSection
      :is-contrast="true"
    >
      <h2>Le guide</h2>
      <p class="text-xl">
        Vous souhaitez passer à l’action et mettre en œuvre l’intensification de votre bâtiment ?
      </p>
      <!-- <p class="text-xl">
        <ul class="list-disc pl-8 flex flex-col gap-2">
          <li>
            Quels sont les enjeux réglementaires, juridiques et assurantiels et comment les traiter ?
          </li>
          <li>
            Quels sont les modèles économiques de ce type de projet ?
          </li>

          <li>
            Les solutions de gestion ?
          </li>
          <li>
            Les usages adaptés aux différents types d’espaces ?
          </li>
          <li>
            C’est à ces questions que ce guide opérationnel vise à répondre.
          </li>
        </ul>
      </p> -->
      <p class="text-xl">
        Découvrez notre guide opérationnel de mise en œuvre de l’intensité d’usage.
        Vous y retrouverez les étapes clés à mettre en place, illustrées par des cas d'usage inspirants, afin de vous emparer concrètement de concepts tels que la chronotopie, la mutualisation, l’hybridation et la réversibilité du bâti.
      </p>
      <div class="button-group">
        <PcoButton
          size="lg"
          label="Télécharger le guide au format PDF"
          :class="'md:basis-50%! md:grow-0!'"
          icon="ri:download-2-line"
          :href="`/docs/${guideFilename}`"
          :download="guideFilename"
        />
        <PcoButton
          size="lg"
          to="/fiches/"
          secondary
          :class="'md:basis-50%! md:grow-0!'"
          label="Consulter les fiches en ligne"
          icon="ri:arrow-right-line"
        />
      </div>
    </AppSection>
    <AppSection
      id="about"
    >
      <h2>
        Aller plus loin
      </h2>
      <p class="text-xl">
        Pour aller plus loin et comprendre la démarche derrière cette outil,
        vous pouvez explorer les enjeux de l’intensification de l’usage des bâtiments,
        les objectifs de l’Intensi’Score ainsi que ses modalités de calcul.
      </p>
      <div class="button-group">
        <PcoButton
          size="lg"
          :to="'https://m2intenses.com/'"
          target="_blank"
          :label="'Découvrir la démarche'"
          icon="ri:arrow-right-line"
        />
        <PcoButton
          size="lg"
          secondary
          to="/content/comprendre-score"
          :label="'Comprendre le score'"
          icon="ri:arrow-right-line"
        />
      </div>
    </AppSection>
  </div>
</template>
