<template>
  <source
    :media="media"
    :srcset="cSizes.srcset"
    :sizes="cSizes.sizes"
  >
</template>

<script>
export default {
  props: {
    src: { type: String },
    media: { type: String },
    sizes: { type: String },
  },
  computed: {
    cSizes() {
      const img = useImage()
      return img.getSizes(this.src, {
        sizes:
          this.sizes
          || 'xs:320px sm:640px md:768px lg:1024px xl:1280px xxl: 1536px 2xl:1536px',
      })
    },
  },
}
</script>
