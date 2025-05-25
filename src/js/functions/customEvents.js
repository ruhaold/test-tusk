import {
  CUSTOM_EVENT_ARROW_LEFT_KEYDOWN,
  CUSTOM_EVENT_ARROW_RIGHT_KEYDOWN,
  CUSTOM_EVENT_BREAKPOINT_LG_CHANGE,
  CUSTOM_EVENT_BREAKPOINT_MD_CHANGE,
  CUSTOM_EVENT_BREAKPOINT_SM_CHANGE,
  CUSTOM_EVENT_BREAKPOINT_XL_CHANGE,
  CUSTOM_EVENT_BREAKPOINT_XXL_CHANGE,
  CUSTOM_EVENT_ESCAPE_KEYDOWN,
  CUSTOM_EVENT_OPTIMIZED_RESIZE,
  CUSTOM_EVENT_OPTIMIZED_SCROLL,
  MEDIA_BREAKPOINT_LG,
  MEDIA_BREAKPOINT_MD,
  MEDIA_BREAKPOINT_XL,
  MEDIA_BREAKPOINT_XXL,
} from '../constants'

export const customEvents = () => {
  const throttle = function (type, name, obj) {
    obj = obj || window
    let running = false
    const func = function () {
      if (running) {
        return
      }
      running = true
      requestAnimationFrame(function () {
        obj.dispatchEvent(new CustomEvent(name))
        running = false
      })
    }
    obj.addEventListener(type, func)
  }

  /* init - you can init any event */
  throttle('resize', CUSTOM_EVENT_OPTIMIZED_RESIZE)
  throttle('scroll', CUSTOM_EVENT_OPTIMIZED_SCROLL)

  window.addEventListener(
    'keydown',
    (e) => {
      e = e || window.event
      let isEscape
      if ('key' in e) {
        isEscape = e.key === 'Escape' || e.key === 'Esc'
      } else {
        isEscape = e.keyCode === 27
      }
      if (isEscape) {
        window.dispatchEvent(new CustomEvent(CUSTOM_EVENT_ESCAPE_KEYDOWN))
      } else if (event.key === 'ArrowRight') {
        window.dispatchEvent(new CustomEvent(CUSTOM_EVENT_ARROW_RIGHT_KEYDOWN))
      } else if (event.key === 'ArrowLeft') {
        window.dispatchEvent(new CustomEvent(CUSTOM_EVENT_ARROW_LEFT_KEYDOWN))
      }
    },
    false,
  )

  const breakpointSm = window.matchMedia(`(max-width:${MEDIA_BREAKPOINT_MD.value - 1}px)`)
  const breakpointMd = window.matchMedia(`(min-width:${MEDIA_BREAKPOINT_MD.value}px)`)
  const breakpointLg = window.matchMedia(`(min-width:${MEDIA_BREAKPOINT_LG.value}px)`)
  const breakpointXl = window.matchMedia(`(min-width:${MEDIA_BREAKPOINT_XL.value}px)`)
  const breakpointXxl = window.matchMedia(`(min-width:${MEDIA_BREAKPOINT_XXL.value}px)`)

  const breakpointChecker = (name, breakpoint) => {
    if (breakpoint.matches === true) {
      window.dispatchEvent(
        new CustomEvent(name, {
          detail: {
            matches: true,
          },
        }),
      )
    } else if (breakpoint.matches === false) {
      window.dispatchEvent(
        new CustomEvent(name, {
          detail: {
            matches: false,
          },
        }),
      )
    }
  }

  // не использовать эти события, вместо них использовать событие CUSTOM_EVENT_OPTIMIZED_RESIZE
  try {
    // Chrome & Firefox
    breakpointSm.addEventListener('change', () => breakpointChecker(CUSTOM_EVENT_BREAKPOINT_SM_CHANGE, breakpointSm))
    breakpointMd.addEventListener('change', () => breakpointChecker(CUSTOM_EVENT_BREAKPOINT_MD_CHANGE, breakpointMd))
    breakpointLg.addEventListener('change', () => breakpointChecker(CUSTOM_EVENT_BREAKPOINT_LG_CHANGE, breakpointLg))
    breakpointXl.addEventListener('change', () => breakpointChecker(CUSTOM_EVENT_BREAKPOINT_XL_CHANGE, breakpointXl))
    breakpointXxl.addEventListener('change', () => breakpointChecker(CUSTOM_EVENT_BREAKPOINT_XXL_CHANGE, breakpointXxl))
  } catch (e1) {
    try {
      // Safari
      breakpointSm.addListener(() => breakpointChecker(CUSTOM_EVENT_BREAKPOINT_SM_CHANGE, breakpointSm))
      breakpointMd.addListener(() => breakpointChecker(CUSTOM_EVENT_BREAKPOINT_MD_CHANGE, breakpointMd))
      breakpointLg.addListener(() => breakpointChecker(CUSTOM_EVENT_BREAKPOINT_LG_CHANGE, breakpointLg))
      breakpointXl.addListener(() => breakpointChecker(CUSTOM_EVENT_BREAKPOINT_XL_CHANGE, breakpointXl))
      breakpointXxl.addListener(() => breakpointChecker(CUSTOM_EVENT_BREAKPOINT_XXL_CHANGE, breakpointXxl))
    } catch (e2) {
      console.error(e2)
    }
  }
}
