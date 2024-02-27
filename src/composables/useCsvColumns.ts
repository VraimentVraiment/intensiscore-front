export const isCompatible = () => {
  // const isCompatible = (column: string) => {
  // @todo use validators defined in columnsMap
  return true
}

export const useCsvColumns = () => {
  const columnsMap = ref<ColumnModel[]>(COLUMNS_PRESETS.map(preset => ({
    key: preset.key ?? preset.defaultColumnName,
    columnName: preset.defaultColumnName,
  }),
  ))

  const getColumn = (key: CsvKey) => {
    const column = columnsMap.value
      .find(column => column.key === key)

    return column as ColumnModel
  }

  const getColumnModel = (key: CsvKey) => {
    return getColumn(key)?.columnName as string
  }

  const updateColumnModel = (key: CsvKey, columnName: string) => {
    const column = getColumn(key)
    if (column) {
      column.columnName = columnName
    }
  }

  const getColumnLabel = (key: CsvKey) => {
    return COLUMNS_PRESETS.find(preset => preset.key === key)?.label ?? key
  }

  const groupKey = computed(() => getColumnModel('group') as typeof sharedKeys[number])
  const labelKey = computed(() => getColumnModel('name') as typeof sharedKeys[number])
  const areaKey = computed(() => getColumnModel('area') as typeof sharedKeys[number])

  return {
    columnsMap,
    groupKey,
    labelKey,
    areaKey,
    getColumn,
    getColumnLabel,
    getColumnModel,
    updateColumnModel,
    getRandomCsvRow,
    getRandomCsvArray,
  }
}

// const COLUMNS = {
//   label: {
//     mandatory: true,
//     label: 'Nom de l\'espace',
//     columnName: 'nom_espace',
//     defaultColumnName: 'nom_espace',
//     conditionLabel: 'La valeur de la colonne doit être un texte',
//     validator: (value: unknown) => {
//       return (
//         typeof value === 'string'
//         && value.length > 0
//       )
//     },
//   },
//   value: {
//     mandatory: true,
//     label: 'Surface en m²',
//     defaultColumnName: 'surface_m2',
//     columnName: 'surface_m2',
//     conditionLabel: 'La valeur de la colonne doit être un nombre positif',
//     validator: (value: unknown) => {
//       return (
//         typeof value === 'number'
//         && value >= 0
//       )
//     },
//   },
//   // color: {
//   //   mandatory: true,
//   //   label: 'Score d\'intensité (1 à 5)',
//   //   defaultColumnName: 'score_entre_0_et_5',
//   //   columnName: 'score_entre_0_et_5',
//   //   conditionLabel: 'La valeur de la colonne doit être un nombre entier entre 1 et 5',
//   //   validator: (value: unknown) => {
//   //     return (
//   //       typeof value === 'number' &&
//   //       Number.isInteger(value) &&
//   //       value >= 1 &&
//   //       value <= 5
//   //     )
//   //   },
//   // },

//   utilisation_jour_0_a_5: {
//     mandatory: true,
//     columnName: 'utilisation_jour_0_a_5',
//     defaultColumnName: 'utilisation_jour_0_a_5',
//     label: 'Utilisation jour (0 à 5)',
//   },

//   utilisation_nuit_0_a_5: {
//     mandatory: true,
//     columnName: 'utilisation_nuit_0_a_5',
//     defaultColumnName: 'utilisation_nuit_0_a_5',
//     label: 'Utilisation nuit (0 à 5)',
//   },

//   heure_ouverture_semaine: {
//     mandatory: true,
//     columnName: 'heure_ouverture_semaine',
//     defaultColumnName: 'heure_ouverture_semaine',
//     label: 'Heure d\'ouverture en semaine',
//   },

//   heure_fermeture_semaine: {
//     mandatory: true,
//     columnName: 'heure_fermeture_semaine',
//     defaultColumnName: 'heure_fermeture_semaine',
//     label: 'Heure de fermeture en semaine',
//   },

//   heure_ouverture_samedi: {
//     mandatory: true,
//     columnName: 'heure_ouverture_samedi',
//     defaultColumnName: 'heure_ouverture_samedi',
//     label: 'Heure d\'ouverture le samedi',
//   },

//   heure_fermeture_samedi: {
//     mandatory: true,
//     columnName: 'heure_fermeture_samedi',
//     defaultColumnName: 'heure_fermeture_samedi',
//     label: 'Heure de fermeture le samedi',
//   },

//   heure_ouverture_dimanche: {
//     mandatory: true,
//     columnName: 'heure_ouverture_dimanche',
//     defaultColumnName: 'heure_ouverture_dimanche',
//     label: 'Heure d\'ouverture le dimanche',
//   },

//   heure_fermeture_dimanche: {
//     mandatory: true,
//     columnName: 'heure_fermeture_dimanche',
//     defaultColumnName: 'heure_fermeture_dimanche',
//     label: 'Heure de fermeture le dimanche',
//   },

//   nb_semaines_ouverture: {
//     mandatory: true,
//     columnName: 'nb_semaines_ouverture',
//     defaultColumnName: 'nb_semaines_ouverture',
//     label: 'Nombre de semaines d\'ouverture',
//   },

//   filter: {
//     mandatory: false,
//     defaultColumnName: 'group',
//     label: 'Filtrer par',
//   },

//   // sort: {
//   //   label: 'Trier par',
//   //   mandatory: false,
//   // },
// }
