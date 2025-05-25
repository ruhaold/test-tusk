import {
  FORM_INPUT_ERROR_MESSAGE_CLASS,
  DATA_ERROR_MESSAGE,
  HIDDEN_CLASS_NAME,
  ARIA_HIDDEN,
  ERROR_CLASS_NAME,
  ARIA_INVALID,
  CHECKBOX_GROUP_INPUT_CLASS,
  DATA_REMOVE_CLASS_FROM_FORM,
  DATA_ADD_CLASS_TO_FORM,
  ARIA_LABELLEDBY,
} from '../../js/constants'

export class CheckboxGroupClass {
  constructor(config) {
    this.value = config?.value || ''
    this.error = config?.error || false
    this.element = config?.element || null
    this.novalidate = config?.novalidate || false

    this.inputs = []
    this.input = null
    this.errorMessageEl = null
    this.required = false
    this.disabled = false
    this.message = ''
    this.errorId = ''
    this.name = ''
    this.type = ''
    this.isHidden = window.app.elementIsHidden(this.element)
    this.form = null

    if (this.element && !config?.isSuper) {
      this.init()
    }
  }

  /**
   * Инициализация
   */
  init() {
    this.inputs = this.element.querySelectorAll(`.${CHECKBOX_GROUP_INPUT_CLASS}`)
    this.errorMessageEl = this.element.querySelector(`.${FORM_INPUT_ERROR_MESSAGE_CLASS}`)
    this.message = this.element.getAttribute(DATA_ERROR_MESSAGE) || ''
    this.form = this.element.closest('form')

    if (this.errorMessageEl) {
      this.errorId = this.errorMessageEl.getAttribute('id')
    }

    this.inputs.forEach((input) => {
      if (input) {
        const dataAddClassToForm = input.getAttribute(DATA_ADD_CLASS_TO_FORM)
        const dataRemoveClassFromForm = input.getAttribute(DATA_REMOVE_CLASS_FROM_FORM)

        const toggleClasses = () => {
          if (this.form && input.checked) {
            if (dataAddClassToForm) {
              this.form.classList.add(dataAddClassToForm)
            }

            if (dataRemoveClassFromForm) {
              this.form.classList.remove(dataRemoveClassFromForm)
            }
          }
        }

        this.required = input.hasAttribute('required')
        this.disabled = input.hasAttribute('disabled')
        this.name = input.getAttribute('name')
        this.type = input.getAttribute('type')

        if (input.checked) {
          if (this.type === 'checkbox') {
            if (!Array.isArray(this.value)) {
              this.value = []
            }
            this.value.push(input.value)
          } else {
            this.value = input.value
          }
        }

        this.input = input

        toggleClasses()

        input.addEventListener('input', () => {
          if (this.type === 'checkbox') {
            if (!Array.isArray(this.value)) {
              this.value = []
            }
            const valueIndex = this.value.findIndex((val) => val == input.value)

            if (valueIndex > -1) {
              this.value.splice(valueIndex, 1)
            } else {
              this.value.push(input.value)
            }
          } else {
            this.value = input.value
          }

          if (!this.novalidate) {
            this.checkValid()
          }

          toggleClasses()
        })
      }
    })
  }

  /**
   * Установка невалидного статуса инпута.
   *
   * @param {string} [serverError] ошибка, которая пришла с сервера
   */
  setInvalid(serverError) {
    if (this.errorMessageEl) {
      this.errorMessageEl.innerText = serverError || this.message
      this.errorMessageEl.classList.remove(HIDDEN_CLASS_NAME)
      this.errorMessageEl.removeAttribute(ARIA_HIDDEN)
    }

    if (this.element) {
      this.element.classList.add(ERROR_CLASS_NAME)
    }

    this.inputs.forEach((input) => {
      input.setAttribute(ARIA_INVALID, 'true')
      input.classList.add(ERROR_CLASS_NAME)

      if (this.errorId) {
        const ariaLabelledby = input.getAttribute(ARIA_LABELLEDBY) || ''
        const isIdContains = ariaLabelledby.includes(this.errorId)

        if (!isIdContains) {
          input.setAttribute(ARIA_LABELLEDBY, `${ariaLabelledby} ${this.errorId}`.trim())
        }
      }
    })
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

    this.inputs.forEach((input) => {
      input.removeAttribute(ARIA_INVALID)
      input.classList.remove(ERROR_CLASS_NAME)

      if (this.errorId) {
        let ariaLabelledby = input.getAttribute(ARIA_LABELLEDBY) || ''
        ariaLabelledby = ariaLabelledby.replace(this.errorId, '').trim()

        if (ariaLabelledby) {
          input.setAttribute(ARIA_LABELLEDBY, ariaLabelledby)
        } else {
          input.removeAttribute(ARIA_LABELLEDBY, ariaLabelledby)
        }
      }
    })

    this.error = false
  }

  /**
   * Проверка валидации инпута.
   *
   * @param {string} [serverError] ошибка, которая пришла с сервера
   * @return {boolean} если true - ошибок валидации нет
   */
  checkValid(serverError = '') {
    if (this.inputs.length) {
      if (
        !!serverError ||
        ((!this.value || (Array.isArray(this.value) && !this.value.length)) && this.required && !this.disabled)
      ) {
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

    this.inputs.forEach((input, index) => {
      input.checked = input.hasAttribute('checked')

      if (input.checked) {
        if (this.type === 'checkbox') {
          if (!Array.isArray(this.value)) {
            this.value = []
          }
          this.value.push(input.value)
        } else {
          this.value = input.value
        }
      }

      if (index === 0 && this.form) {
        const dataAddClassToForm = input.getAttribute(DATA_ADD_CLASS_TO_FORM)
        const dataRemoveClassFromForm = input.getAttribute(DATA_REMOVE_CLASS_FROM_FORM)

        if (dataAddClassToForm) {
          this.form.classList.add(dataAddClassToForm)
        }

        if (dataRemoveClassFromForm) {
          this.form.classList.remove(dataRemoveClassFromForm)
        }
      }
    })

    this.setValid()
  }

  /**
   * установка значения инпута
   *
   * @param {string[] | number[]} value
   * */
  setValue(value) {
    this.value = value

    this.inputs.forEach((input) => {
      input.checked = Array.isArray(this.value)
        ? !!this.value.find((val) => val == input.value)
        : this.value == input.value
    })

    if (
      this.inputs.length &&
      this.type === 'radio' &&
      ![...this.inputs].some((input) => input.checked) &&
      this.element.closest('.group-tab-common')
    ) {
      const input = this.inputs[0]

      if (input) {
        input.checked = true

        if (Array.isArray(this.value)) {
          this.value.push(input.value)
        } else {
          this.value = input.value
        }

        setTimeout(() => {
          if (this.form) {
            this.form.dispatchEvent(new Event('input', { bubbles: true }))
          }
        }, 0)
      }
    }

    if (!this.novalidate) {
      this.checkValid()
    }
  }
}
