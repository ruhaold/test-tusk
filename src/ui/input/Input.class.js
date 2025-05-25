import {
  ARIA_DESCRIBEDBY,
  ARIA_HIDDEN,
  ARIA_INVALID,
  CUSTOM_EVENT_ALT_ZOOM_CHANGE,
  CUSTOM_EVENT_OPTIMIZED_RESIZE,
  DATA_ERROR_MESSAGE,
  DATA_INPUT_MIN_LENGTH,
  DISABLED_CLASS_NAME,
  ERROR_CLASS_NAME,
  FILLED_CLASS_NAME,
  FORM_INPUT_BUTTONS_CLASS,
  FORM_INPUT_CLEAR_CLASS,
  FORM_INPUT_ERROR_MESSAGE_CLASS,
  FORM_INPUT_INPUT_CLASS,
  FORM_INPUT_LABEL_CLASS,
  HIDDEN_CLASS_NAME,
} from '../../js/constants'

export class InputClass {
  constructor(config) {
    this.value = config?.value || ''
    this.error = config?.error || false
    this.element = config?.element || null
    this.novalidate = config?.novalidate || false

    this.input = null
    this.label = null
    this.errorMessageEl = null
    this.isCheckbox = false
    this.required = false
    this.disabled = false
    this.type = 'text'
    this.message = ''
    this.errorId = ''
    this.name = ''
    this.isHidden = window.app.elementIsHidden(this.element)
    this.form = null
    this.isFormOutdoor = false

    if (this.element && !config?.isSuper) {
      this.init()
    }
  }

  /**
   * Получает атрибуты у инпута.
   *
   * @param {boolean} [initValue] - получать значение инпута при инициализации
   */
  getAttributes(initValue = true) {
    this.errorMessageEl = this.element.querySelector(`.${FORM_INPUT_ERROR_MESSAGE_CLASS}`)
    this.buttons = this.element.querySelector(`.${FORM_INPUT_BUTTONS_CLASS}`)
    this.form = this.element.closest('form')

    if (this.errorMessageEl) {
      this.errorId = this.errorMessageEl.getAttribute('id')
    }

    if (this.input) {
      this.required = this.input.hasAttribute('required')
      this.disabled = this.input.hasAttribute('disabled')
      this.name = this.input.getAttribute('name')
      this.type = this.input.getAttribute('type')
      this.isCheckbox = this.type === 'checkbox'
      this.message = this.input.getAttribute(DATA_ERROR_MESSAGE) || ''
      this.minLength = parseInt(this.input.getAttribute(DATA_INPUT_MIN_LENGTH) || 0)

      if (initValue) {
        this.value = this.input.value || ''
      }

      if (!this.form) {
        const formId = this.input.getAttribute('form')
        if (formId) {
          this.form = document.getElementById(formId)
          this.isFormOutdoor = true
        }
      }
    }
  }

  /**
   * Рассчитывает padding-right у инпута, если поверх него выводятся кнопки.
   */
  calcInputPadding() {
    if (this.buttons) {
      const setPadding = () => {
        const width = this.buttons.getBoundingClientRect().width
        const paddingRight = `${width}px`
        this.input.style.paddingRight = paddingRight

        if (this.label) {
          this.label.style.paddingRight = paddingRight
        }
      }

      setPadding()

      window.addEventListener(CUSTOM_EVENT_OPTIMIZED_RESIZE, setPadding)
      window.addEventListener(CUSTOM_EVENT_ALT_ZOOM_CHANGE, () => {
        setTimeout(() => {
          setPadding()
        }, 1000)
      })
    }
  }

  /**
   * Инициализация
   */
  init() {
    this.input = this.element.querySelector(`.${FORM_INPUT_INPUT_CLASS}`)
    this.label = this.element.querySelector(`.${FORM_INPUT_LABEL_CLASS}`)
    this.clearBtn = this.element.querySelector(`.${FORM_INPUT_CLEAR_CLASS}`)

    this.getAttributes()

    if (this.input) {
      this.checkAutofill()
      setTimeout(() => {
        this.checkAutofill()
      }, 500)
      setTimeout(() => {
        this.checkAutofill()
      }, 1000)
      setTimeout(() => {
        this.checkAutofill()
      }, 2000)

      if (this.disabled) {
        this.element.classList.add(DISABLED_CLASS_NAME)
      }

      this.toggleLabelInit()

      this.input.addEventListener('input', (e) => {
        let prevValue = undefined
        const setValue = () => {
          prevValue = this.value
          if (this.minLength && prevValue && prevValue.length < this.minLength) {
            prevValue = ''
          }
          if (this.isCheckbox) {
            this.value = e.target.checked ? e.target.value : ''
          } else {
            if (this.minLength) {
              if (e.target.value.length >= this.minLength) {
                this.value = e.target.value
              } else {
                this.value = ''
              }
            } else {
              this.value = e.target.value
            }
          }

          this.setValid()
          this.toggleClearBtn()
        }

        setValue()

        setTimeout(() => {
          setValue()
        }, 0)

        if (prevValue === this.value) {
          e.stopPropagation()
        } else if (this.form && this.isFormOutdoor) {
          this.form.dispatchEvent(new Event('input', { bubbles: true }))
        }
      })

      this.calcInputPadding()

      if (this.clearBtn) {
        this.toggleClearBtn()
        this.clearBtn.addEventListener('click', () => {
          this.reset()
          this.toggleClearBtn()

          if (this.form) {
            this.form.dispatchEvent(new Event('input', { bubbles: true }))
          }
        })
      }
    }
  }

  /**
   * Инициализация переключения состояния лейбла: заполнено/не заполнено
   */
  toggleLabelInit() {
    if (this.input) {
      this.input.addEventListener('focus', () => {
        this.setFilled()
      })

      this.input.addEventListener('blur', (e) => {
        if (!e.target.value) {
          this.element.classList.remove(FILLED_CLASS_NAME)
        }

        if (!this.novalidate) {
          this.checkValid()
        }
      })
    }
  }

  /**
   * Установка невалидного статуса инпута.
   *
   * @param {string} [serverError] ошибка, которая пришла с сервера
   */
  setInvalid(serverError = '') {
    if (this.errorMessageEl) {
      this.errorMessageEl.innerText = serverError || this.message
      this.errorMessageEl.classList.remove(HIDDEN_CLASS_NAME)
      this.errorMessageEl.removeAttribute(ARIA_HIDDEN)
    }

    if (this.element) {
      this.element.classList.add(ERROR_CLASS_NAME)
    }

    this.input.setAttribute(ARIA_INVALID, 'true')
    this.input.classList.add(ERROR_CLASS_NAME)

    if (this.errorId) {
      const ariaDescribedby = this.input.getAttribute(ARIA_DESCRIBEDBY) || ''
      const isIdContains = ariaDescribedby.includes(this.errorId)

      if (!isIdContains) {
        this.input.setAttribute(ARIA_DESCRIBEDBY, `${ariaDescribedby} ${this.errorId}`.trim())
      }
    }

    this.error = true
  }

  /**
   * Установка валидного статуса инпута.
   */
  setValid() {
    if (this.errorMessageEl) {
      this.errorMessageEl.classList.add(HIDDEN_CLASS_NAME)
      this.errorMessageEl.setAttribute(ARIA_HIDDEN, 'true')
    }

    if (this.element) {
      this.element.classList.remove(ERROR_CLASS_NAME)
    }

    if (this.input) {
      if (this.errorId) {
        let ariaDescribedby = this.input.getAttribute(ARIA_DESCRIBEDBY) || ''
        ariaDescribedby = ariaDescribedby.replace(this.errorId, '').trim()

        if (ariaDescribedby) {
          this.input.setAttribute(ARIA_DESCRIBEDBY, ariaDescribedby)
        } else {
          this.input.removeAttribute(ARIA_DESCRIBEDBY, ariaDescribedby)
        }
      }

      this.input.removeAttribute(ARIA_INVALID)
      this.input.classList.remove(ERROR_CLASS_NAME)
    }

    this.error = false
  }

  /**
   * Проверка валидации инпута.
   *
   * @param {string} [serverError] ошибка, которая пришла с сервера
   * @return {boolean} если true - ошибок валидации нет
   */
  checkValid(serverError = '') {
    if (this.input) {
      if (this.isCheckbox) {
        this.value = this.input.checked ? this.input.value : ''
      } else {
        this.value = (this.input.value || '').trim()
      }

      if (!!serverError || (!this.value && this.required && !this.disabled)) {
        this.setInvalid(serverError)
      } else {
        this.setValid()
      }
    } else {
      this.error = false
    }

    return !this.error
  }

  /**
   * Очистка инпута
   * */
  reset() {
    this.value = ''

    if (this.input) {
      if (this.isCheckbox) {
        this.input.checked = this.input.hasAttribute('checked')

        if (this.input.checked) {
          this.value = this.input.value
        }
      } else {
        this.input.value = ''
      }
    }
    this.setValid()
    this.setUnfilled()
    this.toggleClearBtn()
  }

  /**
   * Установка статуса инпута "заполнен"
   * */
  setFilled() {
    if (this.element) {
      this.element.classList.add(FILLED_CLASS_NAME)
    }
  }

  /**
   * Установка статуса инпута "не заполнен"
   * */
  setUnfilled() {
    if (this.element) {
      this.element.classList.remove(FILLED_CLASS_NAME)
    }
  }

  /**
   * Проверка автозаполнения браузера
   * */
  checkAutofill() {
    if (this.input) {
      if (this.input.matches(':-webkit-autofill') || !!this.input.value) {
        this.setFilled()
      }
    }
  }

  /**
   * Переключение отображения кнопки очистки инпута (если она есть)
   * */
  toggleClearBtn() {
    if (this.clearBtn) {
      this.clearBtn.classList.toggle(HIDDEN_CLASS_NAME, !this.value)
    }
  }

  /**
   * установка значения инпута
   *
   * @param {string} value
   * */
  setValue(value) {
    if (this.input) {
      this.value = value
      this.input.value = value

      if (this.value) {
        this.setFilled()
      } else {
        this.setUnfilled()
      }

      if (!this.novalidate) {
        this.checkValid()
      }

      this.toggleClearBtn()
    }
  }
}
