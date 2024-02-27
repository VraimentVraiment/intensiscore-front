<script setup lang="ts">
import { NuxtLink } from '#components'

const {
  siteTitle,
  siteDescription,
  headerNavItems,
  siteLogo,
} = useAppConfig()

const linkToHome = computed(() => {
  return useRoute().path === '/' ? undefined : '/'
})
</script>

<template>
  <header
    :class="[
      'bg-bg-default border-b border-border-default',
      'relative z-10 flex justify-between items-center flex-wrap md:flex-nowrap p-2',
    ]"
  >
    <component
      :is="linkToHome ? NuxtLink : 'div'"
      :to="linkToHome"
      :class="[
        'site-info',
        { 'home-link default-action-box decoration-none': linkToHome },
        'flex flex-row items-center py-2 px-3 gap-4 basis-100% md:basis-30%',
      ]"
    >
      <NuxtImg
        preload
        class="site-logo w-12 h-12"
        :src="siteLogo.src"
        :alt="siteLogo.alt"
        width="50"
        height="50"
      />
      <div class="site-info__content">
        <p
          :class="[
            'site-title',
            'text-lg m-0 font-700 color-alt_text-default',
          ]"
        >
          {{ siteTitle }}
        </p>
        <p
          :class="[
            'site-description',
            'text-sm m-0 font-400 color-alt_text-default',
          ]"
        >
          {{ siteDescription }}
        </p>
      </div>
    </component>
    <NavMenu
      :class="[
        'main-navigation',
        'basis-100% md:basis-70% px-6',
      ]"
      aria-label="Menu principal du site"
      :items="headerNavItems"
    />
  </header>
</template>

<style scoped lang="scss">
header {
  box-shadow: $shadow--md;

  :deep(.main-navigation>ul) {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem 2rem;

    @include under-md {
      padding: 1rem 0;
      justify-content: flex-start;
    }

    @include over-md {
      justify-content: flex-end;
    }

    .nav-item a,
    .nav-menu__button {
      padding: .25rem .5rem;

      @extend %default-action-box;

      &[aria-current="page"] {
        @extend %alt-box;
      }
    }
  }
}
</style>
