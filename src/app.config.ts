/**
 * @see https://nuxt.com/docs/getting-started/configuration
 */

import { customTheme } from '@/config/survey-custom-theme'
import { cssMap } from '@/config/survey-css-map'

export default defineAppConfig({
  surveySchemaId: 3,
  siteTitle: 'Intensi\'Score',
  siteDescription: 'Diagnostiquer l\'intensité d\'usage des bâtiments',
  titleSeparator: '|',
  siteLogo: {
    src: '/img/intensiscore-logo.svg',
    alt: 'Logo du site',
  },
  operatorLogo: {
    width: 800,
    height: 320,
    src: '/img/logos-membres.png',
    alt: 'Logo des membres de l\'action collective',
  },
  headerNavItems: [
    {
      to: '/diagnostic-simple',
      text: 'Le diagnostic',
    },
    {
      to: '/reports/',
      text: 'Mes résultats',
    },
    {
      to: '/fiches/',
      text: 'Le guide',
    },
    {
      title: 'Aller plus loin',
      links: [
        {
          href: 'https://www.m2intenses.com/',
          text: 'Découvrir la démarche',
          target: '_blank',
        },
        {
          to: '/content/comprendre-score',
          text: 'Comprendre le score',
        },
        {
          to: '/content/diagnostic-territoire',
          text: 'Diagnostiquer son territoire',
        },
        // {
        //   to: '/diagnostic-approfondi',
        //   text: 'Approfondir le diagnostic',
        // },
      ],
    },
  ],
  footerNavItems: [
    {
      to: '/content/mentions-legales',
      text: 'Mentions légales',
    },
    {
      to: '/content/politique-de-confidentialite',
      text: 'Politique de confidentialité',
    },
    {
      to: '/plan-du-site',
      text: 'Plan du site',
    },
  ],
  guideFilename: '20241010_Guide intensité d\'usage_Pages.pdf',
  // Directus
  PAGES_COLLECTION_NAME: 'intensiscore__pages',
  SHEETS_COLLECTION_NAME: 'intensiscore__solution_sheets',
  SURVEY_RESULTS_COLLECTION_NAME: 'intensiscore__survey_results',
  SURVEY_RESULTS_SECRETS_COLLECTION_NAME: 'intensiscore__survey_results_secrets',
  // SurveyJS
  cssMap,
  customTheme,
})
