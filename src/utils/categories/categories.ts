export interface Category {
  value: string
  text: string
  help?: string
}

export interface ChildCategory extends Category {
  color?: string
  colorDark?: string
}

export interface ParentCategory extends Category {
  color: string
  colorDark: string
  children: ChildCategory[]
  type: 'primary' | 'secondary'
}

export const PARKING_CATEGORY: ParentCategory = {
  value: 'parking',
  text: 'Parking intérieur',
  color: CATEGORICAL_COLORS.grey,
  colorDark: CATEGORICAL_COLORS_DARK.grey,
  children: [],
  type: 'secondary',
}

export const OUTDOOR_SPACES_CATEGORY: ParentCategory = {
  value: 'outdoor-spaces',
  text: 'Espaces extérieurs',
  color: CATEGORICAL_COLORS.grey,
  colorDark: CATEGORICAL_COLORS_DARK.grey,
  children: [],
  type: 'secondary',
}

export const CAVE_CATEGORY: ParentCategory = {
  value: 'cave',
  text: 'Cave',
  color: CATEGORICAL_COLORS.grey,
  colorDark: CATEGORICAL_COLORS_DARK.grey,
  children: [],
  type: 'secondary',
}

export const VACANT_SPACE_CATEGORY: ParentCategory = {
  value: 'vacant-space',
  text: 'Espace vacant',
  color: CATEGORICAL_COLORS.brown,
  colorDark: CATEGORICAL_COLORS_DARK.brown,
  children: [],
  type: 'secondary',
}

export const UNKNOWN_CATEGORY: ParentCategory = {
  value: 'others',
  text: 'Autre, inconnu ou incertain',
  color: CATEGORICAL_COLORS.brown,
  colorDark: CATEGORICAL_COLORS_DARK.brown,
  children: [],
  type: 'secondary',
}

export const UNKNOWN_SUBCATEGORY: ChildCategory = {
  value: 'sub-others',
  text: 'Sous-catégorie autre, inconnue ou incertaine',
  color: CATEGORICAL_COLORS.grey,
}

export const SECONDARY_CATEGORIES: ParentCategory[] = [
  PARKING_CATEGORY,
  OUTDOOR_SPACES_CATEGORY,
  VACANT_SPACE_CATEGORY,
  CAVE_CATEGORY,
  UNKNOWN_CATEGORY,
]

export const ACTUALLYSECONDARY_CATEGORIES = [
  PARKING_CATEGORY,
  OUTDOOR_SPACES_CATEGORY,
  CAVE_CATEGORY,
]

export const NULL_CATEGORIES = [
  UNKNOWN_CATEGORY,
  VACANT_SPACE_CATEGORY,
]

export const OFFICE_SUBCATEGORIES = [
  'office',
  'public-services-public',
]

export const DESTINATION_CATEGORIES: ParentCategory[] = [
  {
    value: 'habitation',
    text: 'Habitation',
    help: 'Logement ou hébergement',
    color: CATEGORICAL_COLORS.yellow,
    colorDark: CATEGORICAL_COLORS_DARK.yellow,
    type: 'primary',
    children: [
      {
        value: 'housing',
        text: 'Logement',
      },
      {
        text: 'Hébergement',
        value: 'accommodation',
      },
    ],
  },
  {
    type: 'primary',
    value: 'commerce',
    text: 'Commerce et activité de service',
    help: 'Artisanat et commerce de détail, restauration, commerce de gros, activité de service avec accueil d’une clientèle, cinéma, hébergement hôtelier, autres hébergements touristiques',
    color: CATEGORICAL_COLORS.orange,
    colorDark: CATEGORICAL_COLORS_DARK.orange,
    children: [
      {
        text: 'Artisanat et commerce de détail',
        value: 'craft-and-retail',
      },
      {
        text: 'Restauration',
        value: 'restaurant',
      },
      {
        text: 'Commerce de gros',
        value: 'wholesale',
      },
      {
        text: 'Activités de services où s\'effectue l\'accueil d\'une clientèle',
        value: 'services',
      },
      {
        text: 'Cinéma',
        value: 'cinema',
      },
      {
        text: 'Hôtels',
        value: 'hotels',
      },
      {
        text: 'Autres hébergements touristiques',
        value: 'other-accommodation',
      },
    ],
  },
  {
    type: 'primary',
    value: 'public-services',
    text: 'Équipements d’intérêt collectif et des services publics',
    help: 'Locaux et bureaux accueillant du public, locaux techniques et industriels des administrations publiques et assimilés, établissements d’enseignement, de santé et d’action sociale, salles d’art et de spectacles, équipements sportifs, autre ERP.',
    color: CATEGORICAL_COLORS.blue,
    colorDark: CATEGORICAL_COLORS_DARK.blue,
    children: [
      {
        text: 'Locaux et bureaux accueillant du public des administrations publiques et assimilés',
        value: 'public-services-public',
      },
      {
        text: 'Locaux techniques et industriels des administrations publiques et assimilés',
        value: 'public-services-technical',
      },
      {
        text: 'Établissements d\'enseignement, de santé et d\'action sociale',
        value: 'health-and-education',
      },
      {
        text: 'Salles d\'art et de spectacles',
        value: 'art-and-spectacles',
      },
      {
        text: 'Équipements sportifs',
        value: 'sports',
      },
      {
        text: 'Lieux de culte',
        value: 'worship',
      },
      {
        text: 'Autres équipements recevant du public',
        value: 'other-public-service',
      },
    ],
  },
  {
    type: 'primary',
    value: 'other-activities',
    text: 'Autres activités des secteurs secondaires ou tertiaires',
    help: 'Industrie, entrepôt, bureau, centre de congrès et d’exposition',
    color: CATEGORICAL_COLORS.pink,
    colorDark: CATEGORICAL_COLORS_DARK.pink,
    children: [
      {
        text: 'Industrie',
        value: 'industry',
      },
      {
        text: 'Entrepôt',
        value: 'warehouse',
      },
      {
        text: 'Bureau',
        value: 'office',
      },
      {
        text: 'Centre de congrès et d\'exposition',
        value: 'congress',
      },
      {
        text: 'Cuisine dédiée à la vente en ligne',
        value: 'kitchen-business',
      },
    ],
  },
]

export const CATEGORIES = [
  ...DESTINATION_CATEGORIES,
  ...SECONDARY_CATEGORIES,
]

export const flatCategories = ([UNKNOWN_SUBCATEGORY, ...CATEGORIES] as (ParentCategory | ChildCategory)[])
  .flatMap((category: ParentCategory | ChildCategory) => {
    return [category, ...((category as ParentCategory)?.children ?? [])]
  })
