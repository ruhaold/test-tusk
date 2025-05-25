import dayjs from 'dayjs'
import 'focus-visible'
import {
  CUSTOM_EVENT_ALT_ZOOM_CHANGE,
  CUSTOM_EVENT_APP_INITIALIZED,
  CUSTOM_EVENT_OPTIMIZED_RESIZE,
  IS_FIREFOX_CLASS,
  IS_IOS_CLASS,
  LOADED_CLASS,
  MEDIA_BREAKPOINT_LG,
  MEDIA_BREAKPOINT_MD,
  MEDIA_BREAKPOINT_SM,
  MEDIA_BREAKPOINT_XL,
  MEDIA_BREAKPOINT_XXL,
  NO_WEBP_CLASS,
  OVERFLOW_HIDDEN,
  VAR_PADDING_RIGHT,
  VAR_PADDING_RIGHT_PX,
  WEBP_CLASS,
} from './constants'
import { objectHasOwn } from './functions/objectHasOwn'
import { getBrowserName } from './functions/getBrowserName'
import { customEvents } from './functions/customEvents'
import HttpClass from './components/Http'
import AlternativeVersionClass from './components/AlternativeVersion'
import { TabsClass } from '../ui/tabs/Tabs.class'
import PopupClass from '../ui/popup/Popup.class'
import CollapseClass from '../ui/accordion/Collapse.class'
import { BtnUpClass } from '../ui/btn-scroll-up/BtnUp.class'
import FormClass from '../ui/form/Form.class'
import VideoClass from '../ui/video/Video.class'
import Dropdown from '../ui/dropdown/Dropdown.class'
import FilterClass from '../ui/listing/Filter.class'
import { checkUseMouse } from './functions/checkUseMouse'
import mustache from 'mustache'
import utc from 'dayjs/plugin/utc.js'
import { swiper } from './swiper/swiper';
import {animationButtonHover} from './functions/animation/animation-button-hover/animationButtonHover.js'


if (!('scrollBehavior' in window.document.documentElement.style)) {
  import('seamless-scroll-polyfill').then((res) => {
    res?.polyfill()
  })
}

class App {
  restUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8888'
      : 'https://pages.rs-app.ru/rs/html/frontend-vite-pug' // базовый урл рест
  langParam = 'lang' // параметр запроса к рест, в котором передаем язык
  lang = document.documentElement.lang || 'ru' // язык сайта
  // пути к файлам css, для динамической загрузки по требованию
  css = {
    pathToAltMedia: 'css/alt-media.css',
    pathToDarkColor: 'css/variables-dark.css',
    pathToContrastBlueColor: 'css/variables-contrast-blue.css',
    pathToContrastDarkColor: 'css/variables-contrast-dark.css',
    pathToContrastLightColor: 'css/variables-contrast-light.css',
  }
  resourceId = 16 // id страницы на бэке
  yandexMapApiKey = ''
  templateUrl = '' // путь к шаблону на вебе
  siteName = 'Сайт'
  loadSentry = false
  loadYM = true
  YMNumber = 0 // номер счетчика

  constructor(config = {}) {
    Object.keys(config).forEach((key) => {
      if (objectHasOwn(this, key)) {
        this[key] = config[key]
      }
    })
    const documentHeight = () => {
      const doc = document.documentElement
      const height =
        Math.abs(window.innerHeight - (window.innerHeight - document.documentElement.clientHeight)) ||
        window.innerHeight
      doc.style.setProperty('--vh', `${height / 100}px`)
    }
    const setIsInit = () => {
      window.dispatchEvent(new CustomEvent(CUSTOM_EVENT_APP_INITIALIZED))
      this.isInitialized = true
      this.body.classList.add(LOADED_CLASS)
    }

    /* switch (this.lang) {
      case 'zh':
        import('dayjs/locale/zh')
        break
      case 'en':
        import('dayjs/locale/en')
        break
      case 'ru':
      default:
        import('dayjs/locale/ru')
        break
    } */
    dayjs.locale(this.lang)

    dayjs.extend(utc)

    this.body = document.querySelector('body')
    this.header = document.querySelector('header')
    this.zoom = 1
    this.mediaQuery = this.setMediaQuery()
    this.isInitialized = false
    this.isLighthouse = window.navigator.userAgent.includes('Chrome-Lighthouse')
    this.isIos = /iPad|iPhone|iPod/.test(window.navigator.userAgent)
    this.browserName = getBrowserName(window.navigator.userAgent)
    this.isFirefox = this.browserName === 'Firefox'
    this.isSupportWebP = false
    this.isProd = process.env.NODE_ENV === 'production'
    this.telCountriesError = true

    window.addEventListener(CUSTOM_EVENT_OPTIMIZED_RESIZE, () => {
      this.mediaQuery = this.setMediaQuery()
    })

    window.addEventListener(CUSTOM_EVENT_ALT_ZOOM_CHANGE, (e) => {
      this.zoom = e?.detail?.zoom ? e.detail.zoom / 100 : 1
      this.mediaQuery = this.setMediaQuery()
    })

    customEvents()
    checkUseMouse()

    if (this.isProd && this.loadSentry && !this.isLighthouse) {
      import('./components/sentry')
    }

    this.supportsWebP()
      .then((res) => {
        if (res) {
          this.body.classList.add(WEBP_CLASS)
          this.isSupportWebP = true
        } else {
          this.body.classList.add(NO_WEBP_CLASS)
          this.isSupportWebP = false
        }
      })
      .finally(() => {
        if (!this.body.classList.contains(WEBP_CLASS) && !this.body.classList.contains(NO_WEBP_CLASS)) {
          this.body.classList.add(NO_WEBP_CLASS)
          this.isSupportWebP = false
        }
      })

    // глобально подключенные библиотеки, для уменьшения размера бандла с vue
    this.MustacheLib = mustache
    this.dayjs = dayjs

    setTimeout(() => {
      const http = new HttpClass()

      this.http = http.axios

      // include components here

      new TabsClass()
      new PopupClass()
      new CollapseClass()
      new BtnUpClass()
      new FormClass()
      new VideoClass()
      new Dropdown()
      new FilterClass()
      new AlternativeVersionClass() // вызывать после всех остальных компонентов

      if (this.isLighthouse) {
        setTimeout(() => {
          setIsInit()
        }, 5000)
      } else {
        setIsInit()
      }

      document.documentElement.style.setProperty('--scrollbar-width', `${this.getScrollbarWidth()}px`)

      documentHeight()
      window.addEventListener(CUSTOM_EVENT_OPTIMIZED_RESIZE, documentHeight)
      window.addEventListener('orientationchange', documentHeight)

      if (this.isIos) {
        this.body.classList.add(IS_IOS_CLASS)
      }

      if (this.isFirefox) {
        this.body.classList.add(IS_FIREFOX_CLASS)
      }
    }, 0)
  }

  /**
   * Устанавливает фокус внутри модального окна, а также зацикливает фокус, не давая ему "выпрыгнуть" за пределы модального окна
   * @param {Object} params - список параметров
   * @param {HTMLElement} params.modal - модальное окно, в котором необходимо зациклить фокус
   * @param {HTMLElement} params.openBtn - кнопка открытия модального окна
   * @param {DOMStringList | string} [params.excludeSelector] - селекторы, для исключения элементов из списка фокусировки внутри модального окна
   * @param {HTMLElement} [params.focusElement] - элемент для фокусировки при открытии модального окна
   * @param {boolean} [params.includeOpenBtn] - включать или нет кнопку открытия модального окна в порядок фокусировки
   * @param {boolean} [params.setEventOnly] - фокусировать или нет первый элемент внутри модального окна
   * @returns {(function(boolean): HTMLElement) | void} - возвращается функция. Ее нужно вызывать при закрытии модального окна. Функция удаляет события и ставит фокус на кнопку открытия модального окна
   */
  setFocusInModal({
    modal,
    openBtn,
    excludeSelector = '',
    focusElement = null,
    includeOpenBtn = false,
    setEventOnly = false,
  }) {
    openBtn = openBtn?.[0] || openBtn
    excludeSelector = excludeSelector ? `:not(${excludeSelector})` : ''
    const focusableElements = `button${excludeSelector}, [href]${excludeSelector}, input${excludeSelector}, select${excludeSelector}, textarea${excludeSelector}, [tabindex]:not([tabindex="-1"])${excludeSelector}`

    if (!modal) return

    let focusableContent = modal.querySelectorAll(focusableElements)
    if (!focusableContent.length) return
    if (includeOpenBtn) {
      focusableContent = [openBtn, ...focusableContent]
    }

    let firstFocusableElement = focusableContent[0]
    let lastFocusableElement = focusableContent[focusableContent.length - 1]

    const listener = (e) => {
      const isTabPressed = e.key === 'Tab' || e.keyCode === 9
      if (!isTabPressed) {
        return
      }

      firstFocusableElement =
        [...focusableContent].find((el) => !this.elementIsHidden(el) && !el.disabled) || firstFocusableElement
      lastFocusableElement =
        [...focusableContent].reverse().find((el) => !this.elementIsHidden(el) && !el.disabled) || lastFocusableElement

      if (e.shiftKey) {
        // if shift key pressed for shift + tab combination
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus() // add focus for the last focusable element
          e.preventDefault()
        }
      } else if (document.activeElement === lastFocusableElement) {
        // if tab key is pressed
        // if focused has reached to last focusable element then focus first focusable element after pressing tab
        firstFocusableElement.focus() // add focus for the first focusable element
        e.preventDefault()
      }
    }

    document.addEventListener('keydown', listener, false)

    if (!setEventOnly) {
      setTimeout(() => {
        if (focusElement) {
          focusElement.focus()

          if (this.isIos) {
            setTimeout(() => {
              focusElement.blur()
            }, 0)
          }
        } else {
          firstFocusableElement.focus()

          if (this.isIos) {
            setTimeout(() => {
              firstFocusableElement.blur()
            }, 0)
          }
        }
      }, 500)
    }

    /**
     * @param {boolean} [removeEventOnly] - если true - фокус на кнопку открытия модального окна не ставится
     * @returns {HTMLElement} - возвращает кнопку открытия модального окна
     * */
    return (removeEventOnly = false) => {
      document.removeEventListener('keydown', listener, false)

      if (openBtn && !removeEventOnly) {
        setTimeout(() => {
          openBtn.focus({ preventScroll: true })

          if (this.isIos) {
            setTimeout(() => {
              openBtn.blur()
            }, 0)
          }
        }, 500)
      }

      return openBtn
    }
  }

  /**
   * Проверяет, попадает ли элемент в область просмотра
   *
   * @param {HTMLElement} el целевой элемент
   * @param {boolean} [horizontalOnly] если true - проверяется только попадание в область просмотра по горизонтали;
   * если false - в обеих направлениях
   * @return {boolean}
   * */
  isElementInViewport(el, horizontalOnly = false) {
    const rect = el.getBoundingClientRect()
    const horizontal = rect.left >= 0 && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    const vertical = rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)

    return horizontalOnly ? horizontal : horizontal && vertical
  }

  /**
   * Проверяет, скрыт ли элемент
   *
   * @param {HTMLElement} element целевой элемент
   * @return {boolean}
   * */
  elementIsHidden(element) {
    return element
      ? (element.offsetWidth <= 0 && element.offsetHeight <= 0) ||
          window.getComputedStyle(element).visibility === 'hidden'
      : true
  }

  /**
   * Устанавливает на целевой элемент padding-right и css переменные --padding-right, --padding-right-px
   *
   * @param {HTMLElement} element целевой элемент
   * @param {number} padding размер в пикселях
   * */
  setPaddingWithModal(element, padding) {
    element.style.paddingRight = padding + 'px'
    element.style.setProperty(VAR_PADDING_RIGHT, padding / 10 + 'rem')
    element.style.setProperty(VAR_PADDING_RIGHT_PX, padding + 'px')
  }

  /**
   * Удаляет с целевого элемента ранее установленный padding-right и css переменные --padding-right, --padding-right-px
   *
   * @param {HTMLElement} element целевой элемент
   * */
  removePaddingWithModal(element) {
    element.style.paddingRight = ''
    element.style.removeProperty(VAR_PADDING_RIGHT)
    element.style.removeProperty(VAR_PADDING_RIGHT_PX)
  }

  /**
   * Добавляет overflow: hidden для элемента body. Нужно вызывать, например, при открытии модального окна
   * */
  addOverflowHiddenBody() {
    const padding = this.getScrollbarWidth()

    this.setPaddingWithModal(this.body, padding)
    this.body.classList.add(OVERFLOW_HIDDEN)
  }

  /**
   * Удаляет overflow: hidden у элемента body. Нужно вызывать, например, при закрытии модального окна
   * */
  removeOverflowHiddenBody() {
    this.body.classList.remove(OVERFLOW_HIDDEN)
    this.removePaddingWithModal(this.body)
  }

  /**
   * @return {number} возвращает ширину полосы прокрутки в пикселях. На мобильном устройстве ширина прокрутки будет равна нулю.
   * */
  getScrollbarWidth() {
    const documentWidth = document.documentElement.clientWidth
    return Math.abs(window.innerWidth - documentWidth)
  }

  /**
   * @returns {'xxl' | 'xl' | 'lg' | 'md' | 'sm'} возвращает текущий медиа запрос, на основе ширины экрана устройства,
   * с учетом увеличения масштаба
   * */
  setMediaQuery() {
    const clientWidth = window.innerWidth / this.zoom
    switch (true) {
      case clientWidth >= MEDIA_BREAKPOINT_XXL.value:
        return MEDIA_BREAKPOINT_XXL.name
      case clientWidth >= MEDIA_BREAKPOINT_XL.value:
        return MEDIA_BREAKPOINT_XL.name
      case clientWidth >= MEDIA_BREAKPOINT_LG.value:
        return MEDIA_BREAKPOINT_LG.name
      case clientWidth >= MEDIA_BREAKPOINT_MD.value:
        return MEDIA_BREAKPOINT_MD.name
      default:
        return MEDIA_BREAKPOINT_SM.name
    }
  }

  /**
   * Inspired by Modernizr implementation. Выполняет проверку поддержки браузером изображений формата webp
   *
   * @return {Promise} Возвращает промис, который завершиться успешно, если браузер поддерживает изображения формата webp
   * */
  supportsWebP() {
    return new Promise((resolve) => {
      const image = new Image()
      image.onerror = () => resolve(false)
      image.onload = (event) => resolve(event.type === 'load' && image.width === 10)
      image.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvCUACEAcQERGIiP4HAA=='
    })
  }

  /**
   * Проверка на совпадение медиа запроса "sm"
   * @return {boolean}
   * */
  get isMobile() {
    return MEDIA_BREAKPOINT_SM.name === this.mediaQuery
  }

  /**
   * Проверка на совпадение медиа запроса "md"
   * @return {boolean}
   * */
  get isTablet() {
    return MEDIA_BREAKPOINT_MD.name === this.mediaQuery
  }

  /**
   * Проверка на совпадение медиа запроса "lg"
   * @return {boolean}
   * */
  get isLaptop() {
    return MEDIA_BREAKPOINT_LG.name === this.mediaQuery
  }

  /**
   * Проверка на совпадение медиа запроса "xl" или "xxl"
   * @return {boolean}
   * */
  get isDesktop() {
    return MEDIA_BREAKPOINT_XL.name === this.mediaQuery || MEDIA_BREAKPOINT_XXL.name === this.mediaQuery
  }

  /**
   * Проверка на совпадение медиа запроса "xxl"
   * @return {boolean}
   * */
  get isDesktopXXL() {
    return MEDIA_BREAKPOINT_XXL.name === this.mediaQuery
  }
}

if (document.readyState !== 'loading' && !window.app) {
  window.app = new App(appConfig || {})
  swiper();
  animationButtonHover();
}

document.addEventListener('DOMContentLoaded', () => {
  if (!window.app) {
    window.app = new App(appConfig || {})
    swiper();
    animationButtonHover();
  }
})
