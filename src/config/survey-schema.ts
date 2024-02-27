/* eslint-disable no-irregular-whitespace */
const requiredQuestion = {
  isRequired: true,
  requiredErrorText: 'Veuillez sélectionner une option',
}

const booleanChoiceItem = {
  type: 'radiogroup',
  itemComponent: 'custom-choice-item',
  choices: [
    {
      value: 'yes',
      text: 'Oui',
    },
    {
      value: 'no',
      text: 'Non',
    },
  ],
}

const isQuickTest = false

export const surveySchema: Record<string, unknown> = {
  pagePrevText: 'Précédent',
  pageNextText: 'Suivant',
  completeText: 'Terminer',
  completedHtml: '<h2>Vous avez terminé le diagnostic simple !</h2>',
  clearInvisibleValues: 'none', // this is needed to store hidden uuid in panel dynamic
  pages: [
    !isQuickTest && {
      elements: [{
        type: 'html',
        html: `<p class="text-xl"><b>Vous avez moins de 30 minutes devant vous ?</b></p>
        <p class="text-lg">Quel est l’usage réel et le potentiel d’intensification global de mon bâtiment ? Ce diagnostic permet d’obtenir une vision globale du niveau d’intensité d’usage de votre bâtiment, selon les grands domaines d’activités qui y sont implémentés (cf. « destinations » du code de l’urbanisme).</a>.</p>
        <p class="text-lg">Ce diagnostic sert à sensibiliser de manière ludique ses utilisateurs sur l’usage de leurs bâtiments, il ne s’engage pas à fournir une information exacte mais à donner des ordres de grandeur afin de souligner la sous-occupation de lieux et leur potentiel d’intensification.</p>`,
      }],
    },
    {
      title: 'Informations générales',
      elements: [
        {
          name: 'survey-label',
          type: 'text',
          title: 'Nom du diagnostic',
          description: 'Donnez un nom à votre diagnostic pour le retrouver plus facilement.<br>Il peut s\'agir par exemple du nom du bâtiment que vous diagnostiquez.',
          visible: !isQuickTest,
          ...requiredQuestion,
          defaultValueExpression: isQuickTest ? '"Label utilisateur du diagnostic"' : undefined,
        },
        !isQuickTest && {
          name: 'user-mail',
          title: 'Quelle est votre adresse e-mail ?',
          // description: 'Cette information nous sert à...',
          type: 'text',
          inputType: 'email',
          ...requiredQuestion,
          validators: {
            type: 'email',
            text: 'Veuillez entrer une adresse e-mail valide.',
          },
        },
        !isQuickTest && {
          name: 'user-consent',
          title: 'Consentement',
          type: 'checkbox',
          ...requiredQuestion,
          choices: [
            {
              value: 'consent-accept-mails',
              text: 'Je consens à ce que les membres fondateurs de l’action collective à l’origine de l’Intensi’Score m’envoient des mails concernant les actualités et temps forts de la démarche.<a target="_blank" href="/content/politique-de-confidentialite">En savoir plus</a>',
            },
          ],
        },
        !isQuickTest && {
          name: 'user-job',
          title: 'Quel est l\'intitulé de votre poste ?',
          description: 'Cette information nous permet de mieux connaître le profil des utilisateur·ice·s intéressé·e·s par cet outil.',
          type: 'text',
        },
        !isQuickTest && {
          name: 'user-reason',
          title: 'Pourquoi souhaitez-vous intensifier l’usage de votre actif ?',
          type: 'checkbox',
          itemComponent: 'custom-choice-item',
          choices: [
            {
              value: 'reason-revenue',
              text: 'Générer des revenus complémentaires.',
            },
            {
              value: 'reason-rse',
              text: 'Contribuer à ma stratégie RSE (décarbonation, ancrage territorial...).',
            },
            {
              value: 'reason-open-building',
              text: 'Ouvrir mon bâtiment sur son territoire et proposer ses services aux riverains.',
            },
            {
              value: 'reason-optimize-estate',
              text: 'Optimiser et réduire mon parc immobilier.',
            },
            {
              value: 'reason-other',
              text: 'Autre',
            },
          ],
        },
        !isQuickTest && {
          name: 'user-reason-other',
          title: 'Préciser',
          type: 'text',
          visibleIf: '{user-reason} contains "reason-other"',
        },
      ].filter(Boolean),
    },
    !isQuickTest && {
      elements: [
        {
          /**
         * @todo choix multiple
         */
          name: 'building-localization',
          title: 'Où se situe votre bâtiment ?',
          type: 'radiogroup',
          itemComponent: 'custom-choice-item',
          ...requiredQuestion,
          choices: [
            {
              value: 'localization-rural',
              text: 'Zone rurale',
            },
            {
              value: 'localization-suburb',
              text: 'Zone péri-urbaine',
            },
            {
              value: 'localization-industrial',
              text: 'Zone industrielle / tertiaire / ZAC',
            },
            {
              value: 'localization-medium-city',
              text: 'Ville moyenne',
            },
            {
              value: 'localization-large-city',
              text: 'Grande ville',
            },
            {
              value: 'localization-touristic',
              text: 'Zone touristique',
            },
          ],
        },
      ],
    },
    {
      title: 'Description de votre bâtiment',
      description: 'Ces questions nous permettent de comprendre comment est structuré votre bâtiment.',
      elements: [
        {
          name: 'building-nFloors',
          title: 'Combien d\'étages avez vous dans votre bâtiment ?',
          description: 'NB: Le RDC compte comme un étage, mais pas les sous-sol ni le toit.',
          type: 'text',
          inputType: 'number',
          ...requiredQuestion,
          defaultValue: isQuickTest ? '2' : undefined,
          validators: [
            {
              type: 'regex',
              text: 'Le nombre d\'étages doit être un entier positif, inférieur à 60.',
              regex: '^[1-5]?[0-9]$',
            },
          ],
        },
        {
          name: 'building-hasFlatRoof',
          title: 'Les usagers de votre bâtiment ont-ils accès à un toit plat / toit terrasse ?"',
          description: 'Nous cherchons à identifier des espaces extérieurs accessibles aux usagers de votre bâtiment, même si ces espaces ne sont pas aménagés.',
          defaultValue: isQuickTest ? 'yes' : undefined,
          ...requiredQuestion,
          ...booleanChoiceItem,
        },
        {
          name: 'building-hasBasement',
          title: 'Avez-vous un sous-sol dans votre bâtiment ?',
          defaultValue: isQuickTest ? 'yes' : undefined,
          ...requiredQuestion,
          ...booleanChoiceItem,
        },
        {
          name: 'building-nBasementsLevels',
          title: 'Combien de niveaux avez-vous en sous-sol ?',
          type: 'text',
          inputType: 'number',
          ...requiredQuestion,
          visibleIf: '{building-hasBasement} = \'yes\'',
          defaultValue: isQuickTest ? '1' : undefined,
          validators: [
            {
              type: 'regex',
              text: 'Le nombre de niveaux doit être un entier positif.',
              regex: '^[1-9][0-9]*$',

            },
          ],
        },
      ],
    },
    {
      title: 'Description des usages secondaires de votre bâtiment',
      elements: [
        {
          name: 'building-hasIndoorParking',
          title: 'Avez-vous un parking intérieur dans votre bâtiment ?',
          defaultValue: isQuickTest ? 'yes' : undefined,
          ...requiredQuestion,
          ...booleanChoiceItem,
        },
        {
          name: 'building-hasCave',
          title: 'Avez-vous des caves dans votre bâtiment ?',
          defaultValue: isQuickTest ? 'yes' : undefined,
          ...requiredQuestion,
          ...booleanChoiceItem,
        },
        {
          name: 'building-hasOutdoorSpaces',
          title: 'Avez-vous des espaces extérieurs dans votre bâtiment ?',
          description: 'Terrasse, balcon, lodgia, parking...',
          defaultValue: isQuickTest ? 'yes' : undefined,
          ...requiredQuestion,
          ...booleanChoiceItem,
        },
        {
          name: 'building-hasVacantSpace',
          title: 'Y a-t-il un espace vacant dans votre bâtiment (ou non commercialisé, non accessible) ?',
          description: 'Ne répondre oui que si ces espaces représentent environ plus d\'un tiers d\'un étage.',
          defaultValue: isQuickTest ? 'yes' : undefined,
          ...requiredQuestion,
          ...booleanChoiceItem,
        },
      ],
    },
    !isQuickTest && {
      elements: [
        {
          name: 'building-isErp',
          title: 'Votre bâtiment est-il est ouvert au public ?',
          description: 'Un bâtiment est-dit "ERP" (Établissement Recevant du Public) lorsqu\'il peut recevoir du public, il est alors soumis à des règles de sécurité spécifiques. Un bâtiment peut être entièrement ou partiellement ERP.',
          ...requiredQuestion,
          type: 'radiogroup',
          itemComponent: 'custom-choice-item',
          choices: [
            {
              value: 'yes',
              text: 'Oui',
            },
            {
              value: 'no',
              text: 'Non',
            },
            {
              value: 'unknown',
              text: 'Je ne sais pas',
            },
          ],
        },
        {
          name: 'building-isErp__hasEquipments',
          title: 'Dans la partie ERP ou attenant, y a-t’il les équipements suivants ?',
          description: 'Vous pouvez en sélectionner plusieurs comme aucun.',
          type: 'checkbox',
          itemComponent: 'custom-choice-item',
          visibleIf: '{building-isErp} = \'yes\'',
          choices: [
            {
              value: 'erp-sanitary',
              text: 'Sanitaires / toilettes',
            },
            {
              value: 'erp-kitchen',
              text: 'Cuisine, cafétéria, tisanerie',
            },
            {
              value: 'erp-showers',
              text: 'Douches',
            },
          ],
        },
      ],
    },
    {
      title: 'Description des usages principaux de votre bâtiment',
      description: `Cliquez sur "Ajouter un usage" pour ajouter un usage.`,
      elements: [
        {
          type: 'paneldynamic',
          name: 'building-mainUsages',
          title: 'Quels sont les usages de votre bâtiment ?',
          renderMode: 'tab',
          maxPanelCount: 5,
          confirmDelete: true,
          templateTabTitle: '{panel.tabTitle}',
          panelNextText: 'Usage suivant',
          panelPrevText: 'Usage précédent',
          panelAddText: 'Ajouter un usage',
          noEntriesText: 'Cliquez sur le bouton ci-dessous pour ajouter un usage',
          panelRemoveText: 'Supprimer cet usage',
          confirmDeleteText: 'Êtes-vous sûr de vouloir supprimer cet usage ?',
          newPanelPosition: 'next',
          ...requiredQuestion,
          templateElements: [
            {
              type: 'expression',
              name: 'tabTitle',
              visible: false,
              expression: 'iif({panel.building-usage__userLabel} notempty, {panel.building-usage__userLabel}, "Usage n°" + sum(1, {panelIndex}))',
            },
            {
              name: 'building-usage__id',
              type: 'expression',
              visible: false,
              expression: 'iif({panel.building-usage__id} notempty, {panel.building-usage__id}, uuidv4())',
            },
            {
              name: 'building-usage__category',
              title: 'Quelle est l\'usage n°{panelIndex} de votre bâtiment ?',
              description: 'Nous vous proposons d’identifier les usages de votre bâtiment au sens des <a href="https://www.notaires.fr/fr/immobilier-fiscalite/urbanisme/la-destination-des-batiments-dans-le-droit-de-lurbanisme">destinations du code de l’urbanisme</a>. L’objectif : obtenir une vision réglementaire sur les activités régies au sein de votre bâtiment. Ces destinations ont une incidence sur les méthodes et solutions d’intensification à mettre en place. ​',
              type: 'radiogroup',
              ...requiredQuestion,
              itemComponent: 'custom-choice-item',
              choices: parentCategoriesChoices,
            },
            {
              name: 'building-usage__subCategory',
              title: 'Préciser la catégorie d’usage de votre bâtiment',
              type: 'radiogroup',
              ...requiredQuestion,
              itemComponent: 'custom-choice-item',
              visibleIf: `{panel.building-usage__category} notempty`,
              choices: childCategoriesChoices,
            },
            {
              name: 'building-usage__userLabel',
              description: `Donnez un nom à cet usage pour le retrouver ultérieurement, ou le distinguer d'un usage similaire.
Par exemple : "Locaux de l'entreprise X", "Commerces du rez-de-chaussée", etc.`,
              title: 'Labelliser cet usage',
              ...requiredQuestion,
              defaultValueExpression: isQuickTest ? '"Usage " + {panelIndex}' : undefined,
              type: 'text',
            },
          ],
        }],
    },
    {
      elements: [
        {
          type: 'text',
          name: 'building-usageRepartition',
          ...requiredQuestion,
          title: 'Comment sont répartis les usages dans votre bâtiment ?',
          renderAs: 'custom-building-matrix',
        },
      ],
    },
    {
      elements: [
        {
          type: 'paneldynamic',
          name: 'building-usagesTimings',
          title: 'Quand et comment sont utilisés les différents espaces de votre bâtiment ?',
          canAddPanel: false,
          canRemovePanel: false,
          panelNextText: 'Usage suivant',
          panelPrevText: 'Usage précédent',
          renderMode: 'tab',
          templateTabTitle: '{panel.usageLabel}',
          ...requiredQuestion,
          templateElements: [
            {
              type: 'expression',
              name: 'usageLabel',
              visible: false,
              expression: 'iif({panel.building-usage__userLabel} notempty, {panel.building-usage__userLabel}, "Usage n°" + sum(1, {panelIndex}) + " : " + {panel.building-usage_i__subCategoryText})',
            },
            {
              name: 'building-usage__typicalSpaces',
              title: 'Quels sont les espaces types associés à cet usage ?',
              description: '{panel.usageLabel}',
              type: 'checkbox',
              itemComponent: 'custom-choice-item',
              visibleIf: `{panel.building-usage__category} != 'habitation'`,
              choices: [
                {
                  value: 'type-cave',
                  text: 'Cave',
                },
                {
                  value: 'type-cantine',
                  text: 'Cantine / RIE',
                },
                {
                  value: 'type-meeting-room',
                  text: 'Salle de réunion',
                },
                {
                  value: 'type-office',
                  text: 'Bureau',
                },
                {
                  value: 'type-classroom',
                  text: 'Salle de classe',
                },
                {
                  value: 'type-auditorium',
                  text: 'Auditorium',
                },
                {
                  value: 'type-gym',
                  text: 'Gymnase',
                },
                {
                  text: 'Espace d’accueil',
                  value: 'type-reception',
                },
              ],
            },
            {
              name: 'building-usage__openingWeeks',
              title: 'Combien de semaine par an cet usage est-il ouvert ?',
              description: '{panel.usageLabel}',
              ...requiredQuestion,
              type: 'text',
              renderAs: 'custom-weeks-picker',
            },
            {
              name: 'building-usage__isOffice__surface',
              title: 'Quelle est la surface de bureaux concernée ?',
              description: '{panel.usageLabel}',
              type: 'text',
              inputType: 'number',
              visibleIf: getOfficeSubcategoryCondition(),
              validators: [
                {
                  type: 'regex',
                  text: 'La surface doit être un nombre positif.',
                  regex: '^[1-9][0-9]*$',
                },
              ],
            },
            {
              name: 'building-usage__isOffice__nEmployees',
              title: 'Quel est l\'effectif pour ces bureaux ?',
              description: '{panel.usageLabel}',
              type: 'text',
              inputType: 'number',
              visibleIf: getOfficeSubcategoryCondition(),
              validators: [
                {
                  type: 'regex',
                  text: 'L\'effectif doit être un nombre positif.',
                  regex: '^[1-9][0-9]*$',
                },
              ],
            },
            {
              name: 'building-usage__isOffice__nWorkstations',
              title: 'Quel est le nombre de postes de travail dans ces bureaux ?',
              description: '{panel.usageLabel}',
              type: 'text',
              inputType: 'number',
              visibleIf: getOfficeSubcategoryCondition(),
              validators: [
                {
                  type: 'regex',
                  text: 'Le nombre de postes de travail doit être un nombre positif.',
                  regex: '^[1-9][0-9]*$',
                },
              ],
            },
            {
              name: 'building-usage__isOffice__teleworkRate',
              title: 'Quel est le taux de télétravail (en pourcentage du nombre de jour travaillés) ?',
              description: '{panel.usageLabel}',
              type: 'text',
              inputType: 'number',
              visibleIf: getOfficeSubcategoryCondition(),
              validators: [
                {
                  type: 'regex',
                  text: 'Le taux de télétravail doit être un nombre compris entre 0 et 100.',
                  regex: '^([0-9]|[1-9][0-9]|100)$',
                },
              ],
            },
            {
              title: 'Quelle phrase décrit le mieux la fréquentation de cet usage au fil de la semaine ?',
              description: '{panel.usageLabel}',
              name: 'building-usage__weekFrequentationDescription',
              type: 'radiogroup',
              ...requiredQuestion,
              itemComponent: 'custom-choice-item',
              choices: weekSlicesDescriptionChoices,
            },
            ...weekSlicesOptions.map(getWeekSliceHourlyIntensity),
          ],
        }],
    },
  ].filter(Boolean),
}
