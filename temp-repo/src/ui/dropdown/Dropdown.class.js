import {
  ARIA_EXPANDED,
  CUSTOM_EVENT_DROPDOWN_CLOSE,
  CUSTOM_EVENT_DROPDOWN_OPEN,
  CUSTOM_EVENT_ESCAPE_KEYDOWN,
  CUSTOM_EVENT_OPTIMIZED_SCROLL,
  DATA_EVENT,
  DROPDOWN_BTN_CLASS_NAME,
  DROPDOWN_CLASS_NAME,
  DROPDOWN_CONTENT_CLASS_NAME,
  OPEN_CLASS_NAME,
} from '../../js/constants'

export default class Dropdown {
  dropdownClassName = DROPDOWN_CLASS_NAME
  dropdownBtnClassName = DROPDOWN_BTN_CLASS_NAME
  dropdownContentClassName = DROPDOWN_CONTENT_CLASS_NAME

  openContentClassName = OPEN_CLASS_NAME

  constructor(config) {
    if (typeof config === 'object') {
      Object.keys(config).forEach((key) => {
        this[key] = config[key]
      })
    }

    this.addEvents()
  }

  addEvents() {
    const dropdowns = document.querySelectorAll(`.${this.dropdownClassName}`)

    dropdowns.forEach((el, i) => {
      const btns = el.querySelectorAll(`.${this.dropdownBtnClassName}`)
      const content = el.querySelector(`.${this.dropdownContentClassName}`)
      const eventName = el.getAttribute(DATA_EVENT) // способ открытия, можно передать click или hover

      if (btns.length && content) {
        const open = () => {
          content.classList.add(this.openContentClassName)
          btns.forEach((btn) => {
            btn.classList.add(this.openContentClassName)
            btn.setAttribute(ARIA_EXPANDED, 'true')
          })
          el.classList.add(this.openContentClassName)
          el.dispatchEvent(new CustomEvent(CUSTOM_EVENT_DROPDOWN_OPEN))
        }
        const close = (focusParent = false) => {
          if (
            focusParent &&
            content.classList.contains(this.openContentClassName) &&
            document.activeElement.closest(`.${this.dropdownContentClassName}.${this.openContentClassName}`)
          ) {
            setTimeout(() => {
              btns[0].focus({ preventScroll: true })

              if (window.app.isIos) {
                setTimeout(() => {
                  btns[0].blur()
                }, 0)
              }
            }, 100)
          }

          btns.forEach((btn) => {
            btn.setAttribute(ARIA_EXPANDED, 'false')
            btn.classList.remove(this.openContentClassName)
          })
          content.classList.remove(this.openContentClassName)
          el.classList.remove(this.openContentClassName)
          el.dispatchEvent(new CustomEvent(CUSTOM_EVENT_DROPDOWN_CLOSE))
        }
        const toggleOpen = (e) => {
          e.preventDefault()
          if (!content.classList.contains(this.openContentClassName)) {
            open()
          } else {
            close(true)
          }
        }

        btns.forEach((btn) => {
          btn.addEventListener('click', toggleOpen)
        })

        if (eventName !== 'click') {
          el.addEventListener('mouseout', () => close())
          el.addEventListener('mouseover', open)
        }

        window.addEventListener(CUSTOM_EVENT_OPTIMIZED_SCROLL, () => {
          if (content.classList.contains(this.openContentClassName)) {
            close()
          }
        })

        window.addEventListener('click', (e) => {
          if (!el.contains(e.target) && content.classList.contains(this.openContentClassName)) {
            close()
          }
        })

        window.addEventListener(CUSTOM_EVENT_ESCAPE_KEYDOWN, () => close(true))
      }
    })
  }
}
