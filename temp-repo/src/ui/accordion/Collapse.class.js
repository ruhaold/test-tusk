import {
  ARIA_EXPANDED,
  COLLAPSED_CLASS_NAME,
  COMMON_COLLAPSE_CLASS,
  COMMON_COLLAPSE_ITEM_CLASS,
  COMMON_COLLAPSE_ITEM_CLOSE_BTN_CLASS,
  COMMON_COLLAPSE_ITEM_TOGGLE_BTN_CLASS,
  COMMON_COLLAPSE_ITEM_TOGGLE_CONTAINER_CLASS,
  CUSTOM_EVENT_CLOSE,
  CUSTOM_EVENT_OPEN,
  DATA_OPEN,
  DATA_COLLAPSE_CONTAINER_HEIGHT,
  DATA_COLLAPSE_EXPAND_ONE,
} from '../../js/constants'

export default class CollapseClass {
  constructor(config) {
    if (typeof config === 'object') {
      Object.keys(config).forEach((key) => {
        this[key] = config[key]
      })
    }

    CollapseClass.init()
  }

  static init(collapses) {
    collapses = !Array.isArray(collapses) ? document.querySelectorAll(`.${COMMON_COLLAPSE_CLASS}`) : collapses

    collapses.forEach((el) => {
      const collapseItems = el.querySelectorAll(`.${COMMON_COLLAPSE_ITEM_CLASS}`)
      const isExpandOne = el.hasAttribute(DATA_COLLAPSE_EXPAND_ONE)
      const collapseItemsMapped = [...collapseItems].map((item, index) => {
        const isCollapsed = !item.hasAttribute(DATA_OPEN)

        item.addEventListener(CUSTOM_EVENT_OPEN, () => {
          if (Array.isArray(collapseItemsMapped) && isExpandOne) {
            collapseItemsMapped.forEach((itemClass, i) => {
              if (i !== index && !itemClass.isCollapsed) {
                itemClass.toggleCollapse(itemClass.toggleButton, false)
              }
            })
          }
        })

        return new CollapseItemClass({
          duration: 200,
          index,
          el: item,
          isCollapsed,
        })
      })
    })
  }
}

class CollapseItemClass {
  constructor({ el, callbacks = {}, duration = 200, isCollapsed = true }) {
    this.el = el
    this.callbacks = callbacks
    this.toggleButton = null
    this.closeButton = null
    this.toggleContainer = null
    this.duration = duration
    this.isCollapsed = isCollapsed

    this.init()
  }

  init() {
    if (!this.el) return

    this.toggleButton = this.el.querySelector(`.${COMMON_COLLAPSE_ITEM_TOGGLE_BTN_CLASS}`)
    this.closeButton = this.el.querySelector(`.${COMMON_COLLAPSE_ITEM_CLOSE_BTN_CLASS}`)
    this.toggleContainer = this.el.querySelector(`.${COMMON_COLLAPSE_ITEM_TOGGLE_CONTAINER_CLASS}`)

    if (this.toggleContainer) {
      this.dataHeightHas = this.toggleContainer.hasAttribute(`${DATA_COLLAPSE_CONTAINER_HEIGHT}`)
      this.dataHeightGet = this.toggleContainer.getAttribute(`${DATA_COLLAPSE_CONTAINER_HEIGHT}`)

      if (this.toggleButton) {
        this.toggleButton.addEventListener('click', () => {
          this.toggleCollapse(this.toggleButton)
        })

        this.toggleClass(this.toggleButton, COLLAPSED_CLASS_NAME, this.isCollapsed)

        if (this.isCollapsed) {
          this.toggleClass(this.toggleButton, COLLAPSED_CLASS_NAME, this.isCollapsed)
        } else {
          this.toggleCollapse(this.toggleButton, true)
        }
      }

      if (this.closeButton) {
        this.closeButton.addEventListener('click', () => {
          this.toggleCollapse(this.closeButton)
        })
      }

      if (this.dataHeightHas) {
        if (this.toggleContainer.scrollHeight <= this.dataHeightGet) {
          this.toggleContainer.style.height = 'auto'
          this.toggleContainer.style.minHeight = 'auto'
          this.toggleButton.style.display = 'none'
        }
      }
    }
  }

  toggleCollapse(btn = this.toggleButton, isCollapsed = this.isCollapsed) {
    this.isCollapsed = this.toggleCollapsed(isCollapsed)
    this.toggleClass(this.toggleButton, COLLAPSED_CLASS_NAME, this.isCollapsed)
    this.showHide(btn, this.isCollapsed)
    if (this.isCollapsed) {
      this.toggleButton.setAttribute(ARIA_EXPANDED, 'false')
      this.el.dispatchEvent(new CustomEvent(CUSTOM_EVENT_CLOSE))
    } else {
      this.toggleButton.setAttribute(ARIA_EXPANDED, 'true')
      this.el.dispatchEvent(new CustomEvent(CUSTOM_EVENT_OPEN))
    }
  }

  /**
   * Changing className of the btn.
   * @param {*} element
   * @param {*} className
   * @param {*} c
   */
  toggleClass(element, className, c) {
    if (c) {
      element.classList.add(className)
    } else {
      element.classList.remove(className)
    }
  }

  /**
   * Toggle collapsed value.
   * @param {*} v
   * @returns
   */
  toggleCollapsed(v) {
    return !v
  }

  /**
   *  Collapse / expand element.
   * @param {*} element
   * @param {*} c
   */
  showHide(element, c) {
    this.toggleClass(element, COLLAPSED_CLASS_NAME, c)

    if (c) {
      this.slideUp()
    } else {
      this.slideDown()
    }
  }

  /**
   * Increasing height of the Collapse element.
   *
   * @param {*} el
   * @param {*} progress
   */
  incrementHeight(el, progress) {
    el.style.height = `${progress * el.scrollHeight}px`
  }

  /**
   * Decrementing height of the Collapse element.
   *
   * @param {*} el
   * @param {*} progress
   */
  decrementHeight(el, progress) {
    el.style.height = `${el.scrollHeight - progress * el.scrollHeight}px`
    el.style.visibility = 'hidden'
    el.style.opacity = '0'
    el.style.overflow = 'hidden'
    this.el.removeAttribute(DATA_OPEN)
  }

  /**
   * Expanding Collapse element.
   */
  slideDown() {
    let start
    const animate = (time) => {
      if (!start) {
        start = time
      }
      const runtime = time - start
      const relativeProgress = runtime / this.duration
      const process = Math.min(relativeProgress, 1)

      if (process < 1) {
        this.incrementHeight(this.toggleContainer, process)
        requestAnimationFrame(animate)
        this.toggleContainer.style.visibility = 'inherit'
        this.toggleContainer.style.opacity = '1'
        this.el.setAttribute(DATA_OPEN, '')
      }

      if (process === 1) {
        this.toggleContainer.style.height = 'auto'
        this.toggleContainer.style.overflow = 'initial'
      }
    }

    requestAnimationFrame(animate)
  }

  /**
   * Collapsing element.
   */
  slideUp() {
    let start
    const animate = (time) => {
      if (!start) {
        start = time
      }
      const runtime = time - start
      const relativeProgress = runtime / this.duration
      const process = Math.min(relativeProgress, 1)

      if (process < 1) {
        this.decrementHeight(this.toggleContainer, process)
        requestAnimationFrame(animate)
      }
      if (process === 1) {
        this.toggleContainer.style.visibility = ''
        this.toggleContainer.style.opacity = ''
        this.toggleContainer.style.height = ''
        this.toggleContainer.style.overflow = ''
      }
    }
    requestAnimationFrame(animate)
  }
}
