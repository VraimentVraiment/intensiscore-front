export const sharedKeys = [
  'name',
  'area',
  'group',
] as const

export const directKeys = [
  'direct-score',
] as const

export const hourIntensityKeys = [
  'frequentation__semaine__8h-12h',
  'frequentation__semaine__12h-14h',
  'frequentation__semaine__14h-18h',
  'frequentation__semaine__18h-20h',
  'frequentation__semaine__20h-22h',
  'frequentation__semaine__22h-8h',
  'frequentation__samedi__8h-12h',
  'frequentation__samedi__12h-14h',
  'frequentation__samedi__14h-18h',
  'frequentation__samedi__18h-20h',
  'frequentation__samedi__20h-22h',
  'frequentation__samedi__22h-8h',
  'frequentation__dimanche__8h-12h',
  'frequentation__dimanche__12h-14h',
  'frequentation__dimanche__14h-18h',
  'frequentation__dimanche__18h-20h',
  'frequentation__dimanche__20h-22h',
  'frequentation__dimanche__22h-8h',
] as const

export const computableKeys = [
  'nb_semaines_ouvertes_par_an',
  ...hourIntensityKeys,
] as const

export type SharedKey = typeof sharedKeys[number]
export type DirectKey = typeof directKeys[number]
export type ComputableKey = typeof computableKeys[number]
export type CsvKey = SharedKey | DirectKey | ComputableKey

export type Row<Columns extends string = string> = d3.DSVRowString<Columns> & { id: number }

export type SharedRow = Row<typeof sharedKeys[number]>
export type DirectRow = SharedRow & Row<typeof directKeys[number]>
export type ComputableRow = SharedRow & Row<typeof computableKeys[number]>

export type ColumnPreset = {
  key?: SharedKey | DirectKey | ComputableKey
  defaultColumnName: string
  label: string
}

export type ColumnModel = {
  key?: SharedKey | DirectKey | ComputableKey
  columnName?: string
}

export const COLUMNS_PRESETS: ColumnPreset[] = [
  {
    key: 'name',
    defaultColumnName: 'nom_espace',
    label: 'Nom de l\'espace',
  },
  {
    key: 'area',
    defaultColumnName: 'surface_m2',
    label: 'Surface en m²',
  },
  {
    key: 'direct-score',
    defaultColumnName: 'score_entre_0_et_5',
    label: 'Score d\'intensité (0 à 5)',
  },
  {
    key: 'group',
    defaultColumnName: 'groupe',
    label: 'Grouper par',
  },
  {
    defaultColumnName: 'nb_semaines_ouvertes_par_an',
    label: 'Nombre de semaines d\'ouverture',
  },
  {
    defaultColumnName: 'frequentation__semaine__8h-12h',
    label: 'Frequentation en semaine de 8h à 12h',
  },
  {
    defaultColumnName: 'frequentation__semaine__12h-14h',
    label: 'Frequentation en semaine de 12h à 14h',
  },
  {
    defaultColumnName: 'frequentation__semaine__14h-18h',
    label: 'Frequentation en semaine de 14h à 18h',
  },
  {
    defaultColumnName: 'frequentation__semaine__18h-20h',
    label: 'Frequentation en semaine de 18h à 20h',
  },
  {
    defaultColumnName: 'frequentation__semaine__20h-22h',
    label: 'Frequentation en semaine de 20h à 22h',
  },
  {
    defaultColumnName: 'frequentation__semaine__22h-8h',
    label: 'Frequentation en semaine de 22h à 8h',
  },
  {
    defaultColumnName: 'frequentation__samedi__8h-12h',
    label: 'Frequentation le samedi de 8h à 12h',
  },
  {
    defaultColumnName: 'frequentation__samedi__12h-14h',
    label: 'Frequentation le samedi de 12h à 14h',
  },
  {
    defaultColumnName: 'frequentation__samedi__14h-18h',
    label: 'Frequentation le samedi de 14h à 18h',
  },
  {
    defaultColumnName: 'frequentation__samedi__18h-20h',
    label: 'Frequentation le samedi de 18h à 20h',
  },
  {
    defaultColumnName: 'frequentation__samedi__20h-22h',
    label: 'Frequentation le samedi de 20h à 22h',
  },
  {
    defaultColumnName: 'frequentation__samedi__22h-8h',
    label: 'Frequentation le samedi de 22h à 8h',
  },
  {
    defaultColumnName: 'frequentation__dimanche__8h-12h',
    label: 'Frequentation le dimanche de 8h à 12h',
  },
  {
    defaultColumnName: 'frequentation__dimanche__12h-14h',
    label: 'Frequentation le dimanche de 12h à 14h',
  },
  {
    defaultColumnName: 'frequentation__dimanche__14h-18h',
    label: 'Frequentation le dimanche de 14h à 18h',
  },
  {
    defaultColumnName: 'frequentation__dimanche__18h-20h',
    label: 'Frequentation le dimanche de 18h à 20h',
  },
  {
    defaultColumnName: 'frequentation__dimanche__20h-22h',
    label: 'Frequentation le dimanche de 20h à 22h',
  },
  {
    defaultColumnName: 'frequentation__dimanche__22h-8h',
    label: 'Frequentation le dimanche de 22h à 8h',
  },
]
