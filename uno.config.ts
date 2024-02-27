import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetWind,
} from 'unocss'

import transformerDirectives from '@unocss/transformer-directives'

const baseColors = {
  primary: {
    200: '#0B3061',
    300: '#274371',
    400: '#435C89',
    500: '#5E78A1',
    600: '#8394AF',
    700: '#A1B0C4',
    800: '#C0CAD8',
    850: '#D0D8E2',
    900: '#DFE5EC',
    950: '#EEF2F6',
  },
  grey: {
    200: '#333',
    300: '#4D4D4D',
    400: '#666',
    600: '#999',
    800: '#CCC',
    850: '#D9D9D9',
    900: '#E5E5E5',
    950: '#F2F2F2',
    1000: '#FFF',
  },
}

const semanticColors = {
  bg: {
    default: baseColors.grey[1000],
    hover: baseColors.grey[950],
    active: baseColors.primary[950],
  },
  alt_bg: {
    default: baseColors.primary[950],
    hover: baseColors.primary[900],
    active: baseColors.primary[850],
  },
  contrast_bg: {
    default: baseColors.primary[200],
    hover: baseColors.primary[400],
    active: baseColors.primary[500],
  },
  text: {
    default: baseColors.grey[200],
    hover: baseColors.grey[300],
    active: baseColors.primary[300],
  },
  alt_text: {
    default: baseColors.primary[200],
    hover: baseColors.primary[400],
    active: baseColors.primary[300],
  },
  contrast_text: {
    default: baseColors.grey[1000],
    hover: baseColors.primary[900],
    active: baseColors.primary[800],
  },
  border: {
    default: baseColors.grey[600],
    hover: baseColors.grey[200],
    active: baseColors.primary[200],
  },
  alt_border: {
    default: baseColors.primary[200],
    hover: baseColors.primary[400],
    active: baseColors.primary[300],
  },
  contrast_border: {
    default: baseColors.primary[200],
    hover: baseColors.primary[400],
    active: baseColors.primary[500],
  },
}

export default defineConfig({

  presets: [
    presetWind(),
    presetIcons({
    }),
    presetTypography(),
  ],

  theme: {
    breakpoints: {
      sm: '375px',
      md: '767px',
      lg: '991px',
      xl: '1447px',
      xxl: '1919px',
    },
    colors: {
      ...baseColors,
      ...semanticColors,
    },
  },
  transformers: [
    transformerDirectives(),
  ],
})
