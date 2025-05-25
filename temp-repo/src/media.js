const MEDIA_BREAKPOINT_SM = 360
const MEDIA_BREAKPOINT_MD = 768
const MEDIA_BREAKPOINT_LG = 1280
const MEDIA_BREAKPOINT_XL = 1600
const ZOOM_VALUES = [1.25, 1.5, 1.75, 2]

const altMedia = []

ZOOM_VALUES.forEach((zoom) => {
  const fractionDigits = zoom === 1.5 || zoom === 2 ? 2 : 3

  altMedia.push(`all and (min-width: ${MEDIA_BREAKPOINT_SM * zoom}px)`)
  altMedia.push(`all and (min-width: ${MEDIA_BREAKPOINT_MD * zoom}px)`)
  altMedia.push(`all and (min-width: ${MEDIA_BREAKPOINT_LG * zoom}px)`)
  altMedia.push(`all and (min-width: ${MEDIA_BREAKPOINT_XL * zoom}px)`)

  altMedia.push(`all and (max-width: ${((MEDIA_BREAKPOINT_MD - 0.02) * zoom).toFixed(fractionDigits)}px)`)
  altMedia.push(`all and (max-width: ${((MEDIA_BREAKPOINT_LG - 0.02) * zoom).toFixed(fractionDigits)}px)`)
  altMedia.push(`all and (max-width: ${((MEDIA_BREAKPOINT_XL - 0.02) * zoom).toFixed(fractionDigits)}px)`)

  altMedia.push(
    `all and (min-width: ${MEDIA_BREAKPOINT_SM * zoom}px) and (max-width: ${(
      (MEDIA_BREAKPOINT_MD - 0.02) *
      zoom
    ).toFixed(fractionDigits)}px)`,
  )
  altMedia.push(
    `all and (min-width: ${MEDIA_BREAKPOINT_SM * zoom}px) and (max-width: ${(
      (MEDIA_BREAKPOINT_LG - 0.02) *
      zoom
    ).toFixed(fractionDigits)}px)`,
  )
  altMedia.push(
    `all and (min-width: ${MEDIA_BREAKPOINT_SM * zoom}px) and (max-width: ${(
      (MEDIA_BREAKPOINT_XL - 0.02) *
      zoom
    ).toFixed(fractionDigits)}px)`,
  )

  altMedia.push(
    `all and (min-width: ${MEDIA_BREAKPOINT_MD * zoom}px) and (max-width: ${(
      (MEDIA_BREAKPOINT_LG - 0.02) *
      zoom
    ).toFixed(fractionDigits)}px)`,
  )
  altMedia.push(
    `all and (min-width: ${MEDIA_BREAKPOINT_MD * zoom}px) and (max-width: ${(
      (MEDIA_BREAKPOINT_XL - 0.02) *
      zoom
    ).toFixed(fractionDigits)}px)`,
  )

  altMedia.push(
    `all and (min-width: ${MEDIA_BREAKPOINT_LG * zoom}px) and (max-width: ${(
      (MEDIA_BREAKPOINT_XL - 0.02) *
      zoom
    ).toFixed(fractionDigits)}px)`,
  )
})

export {
  altMedia,
}
