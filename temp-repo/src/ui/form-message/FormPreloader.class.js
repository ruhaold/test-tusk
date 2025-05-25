import {
  ERROR_CLASS_NAME,
  FORM_PRELOADER_CLOSE_BTN_CLASS,
  FORM_PRELOADER_ERROR_MESSAGE_TEXT_CLASS,
  FORM_PRELOADER_ERROR_MESSAGE_TITLE_CLASS, FORM_PRELOADER_SUCCESS_MESSAGE_TEXT_CLASS,
  FORM_PRELOADER_SUCCESS_MESSAGE_TITLE_CLASS,
  LOADING_CLASS_NAME,
  SUCCESS_CLASS_NAME
} from '../../js/constants'
import {stripTags} from '../../js/functions/stripTags'

export default class FormPreloaderClass {
  constructor(config) {
    this.element = config?.element || null
    this.errorMessageTitle = ''
    this.errorMessageText = ''
    this.successMessageTitle = ''
    this.successMessageText = ''

    this.errorMessageTitleEl = null
    this.errorMessageTextEl = null
    this.successMessageTitleEl = null
    this.successMessageTextEl = null

    this.closeBtns = []
    this.onClose = config?.onClose || (() => {
    })

    if (this.element) {
      this.init()
    }
  }

  init() {
    if (this.element) {
      this.errorMessageTitleEl = this.element.querySelector(`.${FORM_PRELOADER_ERROR_MESSAGE_TITLE_CLASS}`)
      this.errorMessageTextEl = this.element.querySelector(`.${FORM_PRELOADER_ERROR_MESSAGE_TEXT_CLASS}`)
      this.successMessageTitleEl = this.element.querySelector(`.${FORM_PRELOADER_SUCCESS_MESSAGE_TITLE_CLASS}`)
      this.successMessageTextEl = this.element.querySelector(`.${FORM_PRELOADER_SUCCESS_MESSAGE_TEXT_CLASS}`)
      this.closeBtns = this.element.querySelectorAll(`.${FORM_PRELOADER_CLOSE_BTN_CLASS}`)

      if (this.errorMessageTitleEl) {
        this.errorMessageTitle = this.errorMessageTitleEl.innerHTML
      }
      if (this.errorMessageTextEl) {
        this.errorMessageText = this.errorMessageTextEl.innerHTML
      }
      if (this.successMessageTitleEl) {
        this.successMessageTitle = this.successMessageTitleEl.innerHTML
      }
      if (this.successMessageTextEl) {
        this.successMessageText = this.successMessageTextEl.innerHTML
      }

      this.closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.hide()
        })
      })
    }
  }

  showLoading() {
    if (this.element) {
      this.element.classList.add(LOADING_CLASS_NAME)
      this.element.classList.remove(SUCCESS_CLASS_NAME)
      this.element.classList.remove(ERROR_CLASS_NAME)
    }
  }

  showError(message = '', text = '' , data = {}) {
    const MustacheLib = window.app.MustacheLib

    if (this.element && MustacheLib) {
      this.element.classList.remove(LOADING_CLASS_NAME)
      this.element.classList.remove(SUCCESS_CLASS_NAME)
      this.element.classList.add(ERROR_CLASS_NAME)

      if (this.errorMessageTitleEl) {
        if (message) {
          message = MustacheLib.render(message, data)
          this.errorMessageTitleEl.innerHTML = message
          this.errorMessageTitleEl.setAttribute('title', stripTags(message))
        } else {
          message = MustacheLib.render(this.errorMessageTitle, data)
          this.errorMessageTitleEl.innerHTML = message
          this.errorMessageTitleEl.setAttribute('title', stripTags(message))
        }
      }

      if (this.errorMessageTextEl) {
        if (text) {
          text = MustacheLib.render(text, data)
          this.errorMessageTextEl.innerHTML = text
        } else {
          text = MustacheLib.render(this.errorMessageText, data)
          this.errorMessageTextEl.innerHTML = text
        }
      }
    }
  }

  showSuccess(message = '', text = '' , data = {}) {
    const MustacheLib = window.app.MustacheLib

    if (this.element && MustacheLib) {
      this.element.classList.remove(LOADING_CLASS_NAME)
      this.element.classList.add(SUCCESS_CLASS_NAME)
      this.element.classList.remove(ERROR_CLASS_NAME)

      if (this.successMessageTitleEl) {
        if (message) {
          message = MustacheLib.render(message, data)
          this.successMessageTitleEl.innerHTML = message
          this.successMessageTitleEl.setAttribute('title', stripTags(message))
        } else {
          message = MustacheLib.render(this.successMessageTitle, data)
          this.successMessageTitleEl.innerHTML = message
          this.successMessageTitleEl.setAttribute('title', stripTags(message))
        }
      }

      if (this.successMessageTextEl) {
        if (text) {
          text = MustacheLib.render(text, data)
          this.successMessageTextEl.innerHTML = text
        } else {
          text = MustacheLib.render(this.successMessageText, data)
          this.successMessageTextEl.innerHTML = text
        }
      }
    }
  }

  hide() {
    if (this.element) {
      this.element.classList.remove(LOADING_CLASS_NAME)
      this.element.classList.remove(SUCCESS_CLASS_NAME)
      this.element.classList.remove(ERROR_CLASS_NAME)
      this.onClose()
    }
  }
}
