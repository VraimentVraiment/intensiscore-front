export const cosDeg = (angle: number) => Math.cos(angle * (Math.PI / 180))
export const sinDeg = (angle: number) => Math.sin(angle * (Math.PI / 180))

export function getAxonometricTransformMatrixes(
  width: number,
  angle: number,
) {
  const cos = cosDeg(angle)
  const sin = sinDeg(angle)

  const getMatrix = ({
    scale: { x: scaleX = 1, y: scaleY = 1 } = {},
    skew: { x: skewX = 0, y: skewY = 0 } = {},
    translate: { x: translateX = 0, y: translateY = 0 } = {},
  } = {}) => {
    return `matrix(${scaleX} ${skewX} ${skewY} ${scaleY} ${translateX} ${translateY})`
  }

  return {
    top: getMatrix({
      scale: {
        x: cos,
        y: sin,
      },
      skew: {
        x: sin,
        y: -cos,
      },
      translate: {
        x: width * cos,
        y: 0,
      },
    }),
    left: getMatrix({
      scale: {
        x: cos,
        y: 1,
      },
      skew: {
        x: sin,
        y: 0,
      },
      translate: {
        x: 0,
        y: width * sin,
      },
    }),
    right: getMatrix({
      scale: {
        x: cos,
        y: 1,
      },
      skew: {
        x: -sin,
        y: 0,
      },
      translate: {
        x: width * cos,
        y: 2 * width * sin,
      },
    }),
  }
}
