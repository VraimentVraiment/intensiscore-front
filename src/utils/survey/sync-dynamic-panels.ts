import {
  type Question,
} from 'survey-core'

export const syncDynamicPanels = (targetPanel: Question, sourceValue: WithUsageId[]) => {
  targetPanel.maxPanelCount = 0
  targetPanel.minPanelCount = 0
  targetPanel.value = sourceValue
  /**
   * @todo smarter way to sync dynamic panels
   * - only add panel if not already present in targetPanel.value
   * - remove panel if not in sourceValue
   * - only copy id and label from source to target
   */
  if (targetPanel.value?.length > 0) {
    targetPanel.maxPanelCount = targetPanel.value?.length ?? 0
    targetPanel.minPanelCount = targetPanel.value?.length ?? 0
  }
}
