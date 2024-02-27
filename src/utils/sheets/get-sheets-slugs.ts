export const getSheetSlugs = (
  result: SurveyResultModel,
  totalScore: number,
): string[] => {
  const slugs = [] as string[]
  const always = [
    'acceptabilite',
    'equilibre-economique',
    'modele-gestion',
    'impact-ecologique-societal',
    'enjeux-reglementaires-juridiques',
  ]
  slugs.push(...always)

  if (totalScore < 0.8) {
    slugs.push(...['diagnostic-usage', 'diagnostic-territoire'])
  }

  const mainUsages = result['building-mainUsages']
  if (mainUsages.some(u => getUsageSubCategory(u) === 'health-and-education')) {
    slugs.push(...[
      'cours-ouvertes',
      'ecole-noirmoutier',
      'cesure-paris',
      'classe-dehors',
      'ecoles-salles-classe',
    ])
  }

  if (mainUsages.some(u => ['public-services-public', 'office'].includes(getUsageSubCategory(u) ?? ''))) {
    slugs.push(...[
      'station-45',
      'garage-lille',
      'bureaux-coeur',
      'bureaux-salle-reunion',
      'metal-57',
    ])
  }
  if (mainUsages.some(u => getUsageSubCategory(u) === 'housing')) {
    slugs.push(...[
      'colonies',
    ])
  }

  if (result['building-hasOutdoorSpaces'] === 'yes') {
    slugs.push(...[
      'exterieur-prive',
      'espace-public',
      'ludotheque-mobile',
    ])
  }
  if (result['building-hasIndoorParking'] === 'yes') {
    slugs.push(...[
      'parking-stationnement',
      'stockage',
    ])
  }
  if (result['building-hasCave'] === 'yes') {
    slugs.push(...[
      'stockage',
    ])
  }
  if (result['building-hasFlatRoof'] === 'yes') {
    slugs.push(...[
      'arche-vegetale',
      'toit',
    ])
  }

  if (
    result['building-usagesTimings']
      .some(u => u['building-usage__typicalSpaces']
        ?.includes('type-cantine'))
  ) {
    slugs.push(...[
      'restaurant-schoelcher',
      'cantine-rie',
    ])
  }
  if (
    result['building-usagesTimings']
      .some(u => u['building-usage__typicalSpaces']
        ?.includes('type-reception'))
  ) {
    slugs.push(...[
      'hall-entree',
    ])
  }
  if (
    result['building-usagesTimings']
      .some(u => u['building-usage__typicalSpaces']
        ?.includes('type-auditorium'))
  ) {
    slugs.push(...[
      'auditorium',
    ])
  }
  if (
    result['building-usagesTimings']
      .some(u => u['building-usage__typicalSpaces']
        ?.includes('type-gym'))
  ) {
    slugs.push(...[
      'gymnase',
    ])
  }

  return [...new Set(slugs)]
}
