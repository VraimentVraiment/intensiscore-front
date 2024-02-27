import VueDOMPurifyHTML from 'vue-dompurify-html'

export default defineNuxtPlugin((nuxtApp) => {
  const customConfig = {
    ADD_ATTR: ['target'],
    hooks: {
      afterSanitizeAttributes: function (node) {
        if ('target' in node) {
          node.setAttribute('target', '_blank')
          node.setAttribute('rel', 'noopener noreferrer')
        }
      },
    },
  }

  nuxtApp.vueApp.use(VueDOMPurifyHTML, customConfig)
})
