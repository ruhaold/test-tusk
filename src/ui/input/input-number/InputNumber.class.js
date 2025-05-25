import { InputClass } from '../Input.class'
import {
  DATA_MAX_NUM_ERROR_MESSAGE,
  DATA_MIN_NUM_ERROR_MESSAGE,
  DATA_STEP_NUM_ERROR_MESSAGE,
  FORM_INPUT_BUTTON_MINUS_CLASS,
  FORM_INPUT_BUTTON_PLUS_CLASS,
} from '../../../js/constants'
import { getRoundedValue } from '../../../js/functions/getRoundedValue'

export class InputNumberClass extends InputClass {
  constructor(config) {
    super(config)

    this.minErrMsg = ''
    this.maxErrMsg = ''
    this.stepErrMsg = ''
    this.min = ''
    this.max = ''
    this.step = ''
    this.isNumber = false

    if (this.input) {
      this.isNumber = this.input.getAttribute('type') === 'number'

      if (this.isNumber) {
        this.initNumber()
      }
    }
  }

  initNumber() {
    const btnMinus = this.element.querySelector(`.${FORM_INPUT_BUTTON_MINUS_CLASS}`)
    const btnPlus = this.element.querySelector(`.${FORM_INPUT_BUTTON_PLUS_CLASS}`)
    this.min = Number(this.input.getAttribute('min') ?? -Infinity)
    this.max = Number(this.input.getAttribute('max')) || Infinity
    this.step = Number(this.input.getAttribute('step')) || 1
    this.minErrMsg = this.input.getAttribute(DATA_MIN_NUM_ERROR_MESSAGE) || ''
    this.maxErrMsg = this.input.getAttribute(DATA_MAX_NUM_ERROR_MESSAGE) || ''
    this.stepErrMsg = this.input.getAttribute(DATA_STEP_NUM_ERROR_MESSAGE) || ''

    if (btnMinus) {
      btnMinus.addEventListener('click', () => {
        const val = Number(this.input.value)
        let result = val - this.step
        result = getRoundedValue(result, this.step)

        if (result >= this.min) {
          this.input.value = result
        } else {
          this.input.value = this.min
        }

        // запускает валидацию
        this.input.dispatchEvent(new Event('blur', { bubbles: true }))

        this.input.dispatchEvent(new Event('input', { bubbles: true }))
      })
    }

    if (btnPlus) {
      btnPlus.addEventListener('click', () => {
        const val = Number(this.input.value)
        let result = val + this.step
        result = getRoundedValue(result, this.step)

        if (result <= this.max) {
          this.input.value = result
        } else {
          this.input.value = this.max
        }

        // запускает валидацию
        this.input.dispatchEvent(new Event('blur', { bubbles: true }))

        this.input.dispatchEvent(new Event('input', { bubbles: true }))
      })
    }

    // очищать поле, если в него ввели недопустимые символы (firefox, safari)
    this.input.addEventListener('blur', (e) => {
      if (e.target.value === '') {
        e.target.value = ''
        this.input.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })
  }

  /**
   * Проверка автозаполнения браузера
   * */
  isNumberMinValid() {
    return this.minErrMsg ? this.value >= this.min : true
  }

  isNumberMaxValid() {
    return this.maxErrMsg ? this.value <= this.max : true
  }

  // проверка числа на кратность шагу
  isNumberStepValid() {
    return this.stepErrMsg ? getRoundedValue(this.value, this.step) === this.value : true
  }

  /**
   * Проверка валидации инпута.
   *
   * @param {string} [serverError] ошибка, которая пришла с сервера
   * @return {boolean} если true - ошибок валидации нет
   */
  checkValid(serverError = '') {
    if (this.input) {
      if (this.isNumber) {
        this.value = Number(this.input.value)
      }

      if (serverError) {
        this.setInvalid(serverError)
      } else if (this.isNumber && !this.disabled && !this.isNumberMinValid()) {
        this.setInvalid(this.minErrMsg)
      } else if (this.isNumber && !this.disabled && !this.isNumberMaxValid()) {
        this.setInvalid(this.maxErrMsg)
      } else if (this.isNumber && !this.disabled && !this.isNumberStepValid()) {
        this.setInvalid(this.stepErrMsg)
      } else if (this.isNumber && this.input.value === '' && this.required && !this.disabled) {
        this.setInvalid()
      } else {
        this.setValid()
      }
    } else {
      this.error = false
    }

    return !this.error
  }
}
