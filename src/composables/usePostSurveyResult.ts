export function usePostSurveyResult() {
  const resultId: Ref<string | null> = ref(null)

  const {
    SURVEY_RESULTS_COLLECTION_NAME,
    SURVEY_RESULTS_SECRETS_COLLECTION_NAME,
  } = useAppConfig()
  const { createItems } = useDirectusItems()

  const secretSurveyKeys = [
    'user-mail',
    'user-job',
    'user-reason',
    'user-reason-other',
    'user-consent',
  ]

  const postSurveyResult = async (
    content: Record<string, unknown>,
    surveySchemaId: number,
  ): Promise<void> => {
    const secretItemContent = secretSurveyKeys.reduce((acc, key) => {
      acc[key] = content[key]
      return acc
    }, {} as Record<string, unknown>)

    const nonSecretItemContent = Object.keys(content)
      .reduce((acc, key) => {
        if (!secretSurveyKeys.includes(key)) {
          acc[key] = content[key]
        }
        return acc
      }, {} as Record<string, unknown>)

    const item: SurveyRecord = {
      survey_schema_id: surveySchemaId,
      content: JSON.stringify(nonSecretItemContent),
      survey_label: content['survey-label'] as string,
    }

    const items = await createItems<CmsSurveyRecord>({
      collection: SURVEY_RESULTS_COLLECTION_NAME as string,
      items: [item],
    })

    const id = items[0]?.id

    const secretItem = {
      content: JSON.stringify(secretItemContent),
      survey_id: id,
    }
    await createItems({
      collection: SURVEY_RESULTS_SECRETS_COLLECTION_NAME as string,
      items: [secretItem],
    })

    resultId.value = id
  }

  return {
    resultId,
    postSurveyResult,
  }
}
