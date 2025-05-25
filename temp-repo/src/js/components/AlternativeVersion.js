import {
  ACTIVE_CLASS_NAME,
  ALTERNATIVE_VERSION_MENU_CLASS,
  ALTERNATIVE_VERSION_MENU_CONTENT_CLASS,
  ALTERNATIVE_VERSION_MENU_TOGGLE_CLASS,
  ARIA_LABEL,
  CUSTOM_EVENT_ALT_COLOR_CHANGE,
  CUSTOM_EVENT_ALT_EFFECTS_CHANGE,
  CUSTOM_EVENT_ALT_IMAGES_CHANGE,
  CUSTOM_EVENT_ALT_ZOOM_CHANGE,
  CUSTOM_EVENT_BREAKPOINT_SM_CHANGE,
  CUSTOM_EVENT_DROPDOWN_CLOSE,
  CUSTOM_EVENT_DROPDOWN_OPEN,
  DATA_ARIA_LABEL,
  DATA_IMAGES,
  DATA_NO_EFFECTS,
  DATA_THEME,
  DATA_ZOOM,
  HEADER_ALT_EFFECTS_CLASS_NAME,
  HEADER_ALT_RESET_CLASS_NAME,
  HEADER_ALT_SET_COLOR_CLASS_NAME,
  HEADER_ALT_SET_IMAGES_CLASS_NAME,
  HEADER_ALT_SET_ZOOM_CLASS_NAME,
  HEADER_ALT_ZOOM_LEVELS,
  LOCAL_STORAGE_COLOR_KEY,
  LOCAL_STORAGE_EFFECTS_KEY,
  LOCAL_STORAGE_IMAGES_KEY,
  LOCAL_STORAGE_ZOOM_KEY,
  MEDIA_BREAKPOINT_MD,
  MENU_TOGGLER_CLASS_NAME,
  OPEN_ALT_MENU_CLASS_NAME,
  OPEN_CLASS_NAME,
} from '../constants'
import { fetchStyle } from '../functions/loadCSS'

export default class AlternativeVersionClass {
  constructor(config) {
    if (typeof config === 'object') {
      Object.keys(config).forEach((key) => {
        this[key] = config[key]
      })
    }

    this.defaultColor = 'light'
    this.darkColor = 'dark'
    this.cBColor = 'contrast-blue'
    this.cDColor = 'contrast-dark'
    this.cLColor = 'contrast-light'
    this.pathToAltMedia = window.app?.css?.pathToAltMedia
    this.pathToDarkColor = window.app?.css?.pathToDarkColor
    this.pathToContrastBlueColor = window.app?.css?.pathToContrastBlueColor
    this.pathToContrastDarkColor = window.app?.css?.pathToContrastDarkColor
    this.pathToContrastLightColor = window.app?.css?.pathToContrastLightColor

    this.init()
    this.addEvents()
  }

  init() {
    const elements = document.querySelectorAll(`.${ALTERNATIVE_VERSION_MENU_CLASS}`)
    const fullMenuToggler = document.querySelector(`.${MENU_TOGGLER_CLASS_NAME}`)
    const header = window.app.header

    elements.forEach((el) => {
      const toggler = el.querySelector(`.${ALTERNATIVE_VERSION_MENU_TOGGLE_CLASS}`)
      const content = el.querySelector(`.${ALTERNATIVE_VERSION_MENU_CONTENT_CLASS}`)
      let removeFocusInModal

      el.addEventListener(CUSTOM_EVENT_DROPDOWN_OPEN, () => {
        if (removeFocusInModal) {
          removeFocusInModal()
          removeFocusInModal = null
        }

        if (window.app.isMobile || window.app.isTablet) {
          removeFocusInModal = window.app.setFocusInModal({ modal: el, openBtn: toggler })

          if (fullMenuToggler) {
            fullMenuToggler.classList.add(OPEN_ALT_MENU_CLASS_NAME)
          }
          header.classList.add(OPEN_ALT_MENU_CLASS_NAME)
          window.app.addOverflowHiddenBody()

          if (content) {
            content.style.visibility = 'visible'
            content.style.opacity = 1
          }

          el.style.opacity = 1
        }
      })
      el.addEventListener(CUSTOM_EVENT_DROPDOWN_CLOSE, () => {
        if (removeFocusInModal) {
          removeFocusInModal()
          removeFocusInModal = null
        }

        if (fullMenuToggler) {
          fullMenuToggler.classList.remove(OPEN_ALT_MENU_CLASS_NAME)
        }
        header.classList.remove(OPEN_ALT_MENU_CLASS_NAME)

        if (fullMenuToggler && !fullMenuToggler.classList.contains(OPEN_CLASS_NAME)) {
          window.app.removeOverflowHiddenBody()
        }

        if (content) {
          content.style.visibility = ''
          content.style.opacity = ''
        }

        el.style.opacity = ''
      })
    })
  }

  addEvents() {
    const zoomTogglers = document.querySelectorAll(`.${HEADER_ALT_SET_ZOOM_CLASS_NAME}`)
    const effectsTogglers = document.querySelectorAll(`.${HEADER_ALT_EFFECTS_CLASS_NAME}`)
    const imagesTogglers = document.querySelectorAll(`.${HEADER_ALT_SET_IMAGES_CLASS_NAME}`)
    const colorTogglers = document.querySelectorAll(`.${HEADER_ALT_SET_COLOR_CLASS_NAME}`)
    const resetElements = document.querySelectorAll(`.${HEADER_ALT_RESET_CLASS_NAME}`)

    const zoomLocalStorage = Number(localStorage.getItem(LOCAL_STORAGE_ZOOM_KEY))
    const effectsLocalStorage = localStorage.getItem(LOCAL_STORAGE_EFFECTS_KEY) || 1
    const colorLocalStorage = localStorage.getItem(LOCAL_STORAGE_COLOR_KEY) || this.defaultColor
    const imagesLocalStorage = Number(localStorage.getItem(LOCAL_STORAGE_IMAGES_KEY))

    // нужно для сброса зума на мобилке
    const isMobile = window.matchMedia(`(max-width:${MEDIA_BREAKPOINT_MD.value - 1}px)`).matches

    /**
     * @param {number} val - значение размера шрифта
     * */
    const setZoom = (val) => {
      let zoom = HEADER_ALT_ZOOM_LEVELS.find((el) => el === val) || 100
      let isZoomExists = false
      const applyZoom = () => {
        document.documentElement.setAttribute(DATA_ZOOM, zoom)
        localStorage.setItem(LOCAL_STORAGE_ZOOM_KEY, zoom)
      }

      zoomTogglers.forEach((el) => {
        const dataZoom = Number(el.getAttribute(DATA_ZOOM))

        if (dataZoom && dataZoom === zoom) {
          const label = el.getAttribute(DATA_ARIA_LABEL) || ''
          el.classList.add(ACTIVE_CLASS_NAME)
          el.setAttribute(ARIA_LABEL, label)
          isZoomExists = true
        } else {
          el.classList.remove(ACTIVE_CLASS_NAME)
          el.removeAttribute(ARIA_LABEL)
        }
      })

      if (!isZoomExists) {
        zoom = 100
      }

      // загрузка файла стилей для увеличения размера шрифта по требованию
      if (zoom && zoom > 100) {
        fetchStyle(this.pathToAltMedia).then(applyZoom)
      } else {
        applyZoom()
      }
    }

    /**
     * @param {1 | 0} val - вкл/выкл эффекты
     * */
    const setEffects = (val) => {
      let isEffectsExists = false
      effectsTogglers.forEach((el) => {
        el.checked = !!val
        isEffectsExists = true
      })

      if (!isEffectsExists) {
        val = 1
      }

      if (!val) {
        document.documentElement.setAttribute(DATA_NO_EFFECTS, '')
        localStorage.setItem(LOCAL_STORAGE_EFFECTS_KEY, 0)
      } else {
        document.documentElement.removeAttribute(DATA_NO_EFFECTS)
        localStorage.setItem(LOCAL_STORAGE_EFFECTS_KEY, 1)
      }
    }

    /**
     * @param {string} val - имя цветовой схемы
     * */
    const setColor = (val) => {
      let color = val || this.defaultColor
      let isColorExists = false
      const applyColor = () => {
        document.documentElement.setAttribute(DATA_THEME, color)
        localStorage.setItem(LOCAL_STORAGE_COLOR_KEY, color)
      }

      colorTogglers.forEach((el) => {
        const dataColor = el.getAttribute(DATA_THEME)

        if (dataColor && dataColor === color) {
          const label = el.getAttribute(DATA_ARIA_LABEL) || ''
          el.classList.add(ACTIVE_CLASS_NAME)
          el.setAttribute(ARIA_LABEL, label)
          isColorExists = true
        } else {
          el.classList.remove(ACTIVE_CLASS_NAME)
          el.removeAttribute(ARIA_LABEL)
        }
      })

      if (!isColorExists) {
        color = this.defaultColor
      }

      window.dispatchEvent(
        new CustomEvent(CUSTOM_EVENT_ALT_EFFECTS_CHANGE, {
          detail: {
            effects: Number(color === this.defaultColor || color === this.darkColor),
          },
        }),
      )

      applyColor()
    }

    /**
     * @param {1 | 2 | 3} val - состояние изображений: 1 - вкл, 2 - серые, 3 - выкл
     * */
    const setImages = (val) => {
      let images = Number(val) || 1
      let isImagesExists = false

      imagesTogglers.forEach((el) => {
        const dataImages = Number(el.getAttribute(DATA_IMAGES))

        if (dataImages && dataImages === images) {
          const label = el.getAttribute(DATA_ARIA_LABEL) || ''
          el.classList.add(ACTIVE_CLASS_NAME)
          el.classList.add(ACTIVE_CLASS_NAME)
          el.setAttribute(ARIA_LABEL, label)
          isImagesExists = true
        } else {
          el.classList.remove(ACTIVE_CLASS_NAME)
          el.removeAttribute(ARIA_LABEL)
        }
      })

      if (!isImagesExists) {
        images = 1
      }

      document.documentElement.setAttribute(DATA_IMAGES, images)
      localStorage.setItem(LOCAL_STORAGE_IMAGES_KEY, images)
    }

    zoomTogglers.forEach((el) => {
      el.addEventListener('click', () => {
        const zoom = Number(el.getAttribute(DATA_ZOOM))
        const currentZoom = Number(document.documentElement.getAttribute(DATA_ZOOM))

        if (zoom) {
          const zoomVal = HEADER_ALT_ZOOM_LEVELS.find((item) => item === zoom)

          if (zoomVal) {
            window.dispatchEvent(
              new CustomEvent(CUSTOM_EVENT_ALT_ZOOM_CHANGE, {
                detail: {
                  zoom: zoomVal,
                },
              }),
            )
          }
        } else {
          const index = HEADER_ALT_ZOOM_LEVELS.findIndex((el) => el === currentZoom)

          if (index > -1) {
            const zoomVal = HEADER_ALT_ZOOM_LEVELS[index + 1] || HEADER_ALT_ZOOM_LEVELS[0]
            window.dispatchEvent(
              new CustomEvent(CUSTOM_EVENT_ALT_ZOOM_CHANGE, {
                detail: {
                  zoom: zoomVal,
                },
              }),
            )
          }
        }
      })
    })

    effectsTogglers.forEach((el) => {
      el.addEventListener('change', (e) => {
        window.dispatchEvent(
          new CustomEvent(CUSTOM_EVENT_ALT_EFFECTS_CHANGE, {
            detail: {
              effects: e.target.checked,
            },
          }),
        )
      })
    })

    colorTogglers.forEach((el) => {
      el.addEventListener('click', () => {
        const color = el.getAttribute(DATA_THEME) || this.defaultColor

        if (color) {
          window.dispatchEvent(
            new CustomEvent(CUSTOM_EVENT_ALT_COLOR_CHANGE, {
              detail: {
                color,
              },
            }),
          )
        }
      })
    })

    imagesTogglers.forEach((el) => {
      el.addEventListener('click', () => {
        const images = Number(el.getAttribute(DATA_IMAGES))

        if (images) {
          window.dispatchEvent(
            new CustomEvent(CUSTOM_EVENT_ALT_IMAGES_CHANGE, {
              detail: {
                images,
              },
            }),
          )
        }
      })
    })

    resetElements.forEach((el) => {
      el.addEventListener('click', () => {
        window.dispatchEvent(
          new CustomEvent(CUSTOM_EVENT_ALT_ZOOM_CHANGE, {
            detail: {
              zoom: 100,
            },
          }),
        )
        window.dispatchEvent(
          new CustomEvent(CUSTOM_EVENT_ALT_COLOR_CHANGE, {
            detail: {
              color: this.defaultColor,
            },
          }),
        )
        window.dispatchEvent(
          new CustomEvent(CUSTOM_EVENT_ALT_IMAGES_CHANGE, {
            detail: {
              images: 1,
            },
          }),
        )
        window.dispatchEvent(
          new CustomEvent(CUSTOM_EVENT_ALT_EFFECTS_CHANGE, {
            detail: {
              effects: 1,
            },
          }),
        )
      })
    })

    window.addEventListener(CUSTOM_EVENT_ALT_EFFECTS_CHANGE, (e) => {
      setEffects(e?.detail?.effects)
      this.stopAllVideos(e?.detail?.effects)
    })

    window.addEventListener(CUSTOM_EVENT_ALT_ZOOM_CHANGE, (e) => {
      setZoom(e?.detail?.zoom)
    })

    window.addEventListener(CUSTOM_EVENT_ALT_COLOR_CHANGE, (e) => {
      setColor(e?.detail?.color)
    })

    window.addEventListener(CUSTOM_EVENT_ALT_IMAGES_CHANGE, (e) => {
      setImages(e?.detail?.images)
    })

    if (zoomLocalStorage && !isMobile) {
      window.dispatchEvent(
        new CustomEvent(CUSTOM_EVENT_ALT_ZOOM_CHANGE, {
          detail: {
            zoom: zoomLocalStorage,
          },
        }),
      )
    }

    if (!isNaN(effectsLocalStorage)) {
      window.dispatchEvent(
        new CustomEvent(CUSTOM_EVENT_ALT_EFFECTS_CHANGE, {
          detail: {
            effects: Number(effectsLocalStorage),
          },
        }),
      )
    }

    if (colorLocalStorage) {
      window.dispatchEvent(
        new CustomEvent(CUSTOM_EVENT_ALT_COLOR_CHANGE, {
          detail: {
            color: colorLocalStorage,
          },
        }),
      )
    }

    if (imagesLocalStorage) {
      window.dispatchEvent(
        new CustomEvent(CUSTOM_EVENT_ALT_IMAGES_CHANGE, {
          detail: {
            images: imagesLocalStorage,
          },
        }),
      )
    }

    const resetZoom = () => {
      window.dispatchEvent(
        new CustomEvent(CUSTOM_EVENT_ALT_ZOOM_CHANGE, {
          detail: {
            zoom: 100,
          },
        }),
      )
    }

    if (isMobile) {
      resetZoom()
    }

    window.addEventListener(CUSTOM_EVENT_BREAKPOINT_SM_CHANGE, (e) => {
      if (e?.detail?.matches) {
        resetZoom()
      }
    })
  }

  stopAllVideos(play) {
    const videos = document.querySelectorAll('video')

    videos.forEach((video) => {
      if (!play) {
        video.pause()
      } else if (video.hasAttribute('autoplay')) {
        video.play()
      }
    })
  }
}
