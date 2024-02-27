import * as d3 from 'd3'

export const useBuildingRepartitionModel = (
  initialBuildingRepartition: FloorWithUsages[],
) => {
  const floorsWithUsages = ref<FloorWithUsages[]>(initialBuildingRepartition)
  const activeFloorId = ref<number>(0)
  const activeFloor = computed(() => getFloor(activeFloorId.value))
  const minFloorId = computed(() => d3.min(floorsWithUsages.value.map(f => f.id)) as number)
  const maxFloorId = computed(() => d3.max(floorsWithUsages.value.map(f => f.id)) as number)

  const getFloor = (floorId: number) => {
    return floorsWithUsages.value
      .find(f => f.id === floorId)
  }

  const isGroundFloor = (floorId: number) => {
    return floorId === 0
  }

  const isFlatRoof = (floorId: number) => {
    return getFloor(floorId)?.isRoof ?? false
  }

  const isEmpty = (floor: FloorWithUsages) => {
    return floor.usages.length === 0
  }

  const isActive = (floorId: number) => {
    return activeFloorId.value === floorId
  }

  const isLowest = (floorId: number) => {
    return floorId === minFloorId.value
  }

  const isHighest = (floorId: number) => {
    return floorId === maxFloorId.value
  }

  const activatePrevFloor = () => {
    activeFloorId.value = Math.max(minFloorId.value, activeFloorId.value - 1)
  }

  const activateNextFloor = () => {
    activeFloorId.value = Math.min(maxFloorId.value, activeFloorId.value + 1)
  }

  const updateFloorUsage = (usage: UsageIds, floorId: number | Ref<number>) => {
    const floor = getFloor(unref(floorId))
    if (!floor) {
      return
    }
    const index = floor.usages.findIndex(u => isSameUsage(u, usage))
    if (index === -1) {
      floor.usages.push(usage)
    }
    else {
      floor.usages.splice(index, 1)
    }
    floor.usages.sort((usageA, usageB) => sortUsages(usageA, usageB))
  }

  const duplicateFloorRepartition = ({ from, to }: { from: number, to: number }) => {
    const fromFloor = getFloor(from)
    const toFloor = getFloor(to)
    if (!fromFloor || !toFloor) {
      return
    }
    toFloor.usages = fromFloor.usages.map(u => ({ ...u }))
  }

  const doesUsageMatch = (usageA: UsageIds) => {
    return activeFloor.value?.usages
      .some(usageB => isSameUsage(usageA, usageB))
  }

  return {
    floorsWithUsages,
    activeFloorId,
    doesUsageMatch,
    isLowest,
    isHighest,
    updateFloorUsage,
    duplicateFloorRepartition,
    isGroundFloor,
    isFlatRoof,
    isEmpty,
    isActive,
    activatePrevFloor,
    activateNextFloor,
  }
}

export const getInitialRepartition = ({
  nFloors,
  nBasementsLevels,
  hasFlatRoof,
}: BuildingDescription): FloorWithUsages[] => {
  const totalLevels = nFloors + nBasementsLevels + (hasFlatRoof ? 1 : 0)

  return Array.from({ length: totalLevels }, (_, i) => {
    return {
      usages: [],
      id: i - nBasementsLevels,
      isRoof: hasFlatRoof && i === totalLevels - 1,
    }
  }).reverse()
}

export const reverseInitialRepartition = (repartition: FloorWithUsages[]): BuildingDescription => {
  const nBasementsLevels = repartition.filter(f => f.id < 0).length
  const hasFlatRoof = repartition.some(f => f.isRoof)
  const nFloors = repartition.length - nBasementsLevels - (hasFlatRoof ? 1 : 0)
  return { nBasementsLevels, hasFlatRoof, nFloors }
}

export const updateRepartition = (sourceRepartition: FloorWithUsages[], targetValues: {
  nFloors: number
  nBasementsLevels: number
  hasFlatRoof: boolean
}) => {
  const sourceValues = reverseInitialRepartition(sourceRepartition)

  const nBasementDiff = targetValues.nBasementsLevels - sourceValues.nBasementsLevels
  if (nBasementDiff > 0) {
    /**
     * If there are more basements in the survey than in the stored repartition,
     * we add them
     */
    const lowestBasementId = d3.min(sourceRepartition, d => d.id) as number
    for (let i = 1; i <= nBasementDiff; i++) {
      sourceRepartition.push({
        id: lowestBasementId - i,
        isRoof: false,
        usages: [],
      })
    }
  }
  else if (nBasementDiff < 0) {
    /**
     * If there are less basements in the survey than in the stored repartition,
     * we remove them
     */
    for (let i = 1; i <= Math.abs(nBasementDiff); i++) {
      sourceRepartition.pop()
    }
  }

  /**
   * Always remove roof from stored repartition,
   * we will add it later if needed
   */
  if (sourceValues.hasFlatRoof) {
    sourceRepartition.shift()
  }

  const nfloorsDiff = targetValues.nFloors - sourceValues.nFloors
  if (nfloorsDiff > 0) {
    /**
     * If there are more floors in the survey than in the stored repartition,
     * we add them
     */
    const highestFloorId = d3.max(sourceRepartition, d => d.id) as number
    for (let i = 1; i <= nfloorsDiff; i++) {
      sourceRepartition.push({
        id: highestFloorId + i,
        isRoof: false,
        usages: [],
      })
    }
  }
  else if (nfloorsDiff < 0) {
    /**
     * If there are less floors in the survey than in the stored repartition,
     * we remove them
     */
    for (let i = 1; i <= Math.abs(nfloorsDiff); i++) {
      sourceRepartition.shift()
    }
  }

  if (targetValues.hasFlatRoof) {
    // If the survey has a flat roof, we add it to the stored repartition
    // We do not check if the stored repartition already has a flat roof, as it has been removed earlier
    const highestLevelId = d3.max(sourceRepartition, d => d.id) as number
    sourceRepartition.push({
      id: highestLevelId + 1,
      isRoof: true,
      usages: [],
    })
  }

  return sourceRepartition.sort((a, b) => b.id - a.id)
}
