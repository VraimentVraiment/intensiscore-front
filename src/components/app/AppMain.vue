<template>
  <div
    :class="[
      'main-container',
      'w-full flex justify-center pt-8 pb-16 bg-alt_bg-default min-h-90vh',
    ] "
  >
    <main
      :class="[
        'w-full',
      ]"
    >
      <slot />
    </main>
  </div>
</template>
