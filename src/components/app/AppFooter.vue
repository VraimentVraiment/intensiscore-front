<script setup lang="ts">
const {
  siteTitle,
  operatorLogo,
  footerNavItems,
} = useAppConfig()
</script>

<template>
  <footer
    :class="[
      'app-footer contrast',
      'site-padding-x py-16 flex flex-col gap-12 md:flex-row justify-between',
    ]"
  >
    <div class="flex flex-col gap-12 <md:mb-12">
      <div>
        <p class="text-lg mb-4">
          {{ siteTitle }}
        </p>
        <NavMenu
          type="secondary"
          aria-label="Menu de navigation secondaire"
          :items="footerNavItems"
        />
      </div>
      <div>
        <p class="text-lg mt-8 mb-2">
          Contactez-nous :
        </p>
        <a
          href="mailto:m2intenses@gmail.com"
          class="mt-4 contrast-action-box"
        >
          m2intenses@gmail.com
        </a>
      </div>
    </div>
    <div
      :class="[
        'flex justify-center md:justify-start',
      ]"
    >
      <NuxtImg
        :width="operatorLogo.width"
        :height="operatorLogo.height"
        :class="[
          'site-logo',
          'object-contain',
          'w-full',
        ]"
        :alt="operatorLogo.alt"
        :src="operatorLogo.src"
      />
    </div>
  </footer>
</template>

<style scoped lang="scss">
.site-logo {
  filter: invert(1);
}

footer {
  :deep(p) {
    color: $contrast-text--default;
  }

  :deep(li + li) {
    margin-top: 1rem;
  }

  :deep(li) {
    color: $contrast-text--default;
  }

  :deep(a) {
    @extend %contrast-action-text;
  }
}
</style>
