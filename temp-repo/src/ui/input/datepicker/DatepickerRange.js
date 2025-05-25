import {
  DATA_DATE_FORMAT_TO_SERVER,
  DATA_DATE_FORMAT_TO_SHOW,
  DATA_DATE_FORMAT_TO_SHOW_DAYJS,
  DATA_DATE_FROM_FIELD_NAME,
  DATA_DATE_INIT_FROM_QUERY,
  DATA_DATE_TO_FIELD_NAME,
  DATA_DISABLED_TO_TODAY,
  DATA_DP_AVAILABLE_DATES,
  DATA_DP_EXTRA_CONFIG,
  DATA_DP_FROM_NAME,
  DATA_DP_TO_NAME,
  DATEPICKER_COMPONENT_ALT_INPUT,
  DATEPICKER_COMPONENT_INPUT,
  FORM_INPUT_LABEL_CLASS,
  FORM_INPUT_CLEAR_CLASS,
  HIDDEN_CLASS_NAME,
  EMPTY_CLASS_NAME,
  DATA_DISABLED_FROM_TODAY,
} from '../../../js/constants'
import { InputClass } from '../Input.class'

import localeRu from 'air-datepicker/locale/ru'
// import localeEn from './air-datepicker/dist/locale/en'
// import localeZh from './air-datepicker/dist/locale/zh'

export default class DatepickerRangeClass extends InputClass {
  constructor(config) {
    super({
      ...config,
      isSuper: true,
    })

    this.onSelect = config?.onSelect || (() => {})
    this.onShow = config?.onShow || (() => {})

    this.value = config?.value || ''
    this.novalidate = config?.novalidate || false
    this.datepickerOptions = config?.datepickerOptions || {}
    // Нужно передавать, если календарь находится внутри модалки
    this.scrollParentSelector = config?.scrollParentSelector || ''

    this.datepicker = null
    this.multiple = false
    this.dpFromName = null
    this.dpToName = null
    this.disabledToToday = false
    this.dateFromFieldName = null
    this.dateToFieldName = null

    if (this.element) {
      this.input = this.element.querySelector(`.${DATEPICKER_COMPONENT_INPUT}`)
      this.label = this.element.querySelector(`.${FORM_INPUT_LABEL_CLASS}`)
      this.altInput = this.element.querySelector(`.${DATEPICKER_COMPONENT_ALT_INPUT}`)
      this.clearBtn = this.element.querySelector(`.${FORM_INPUT_CLEAR_CLASS}`)

      if (this.input) {
        this.init()
      }
    }
  }

  init() {
    const AirDatepicker = window.app.AirDatepickerLib

    if (!AirDatepicker) return

    const selectedDates = []
    const browserUrl = new URL(location.href)
    const searchParams = browserUrl.searchParams
    const multipleDatesSeparator = ' — '

    this.getAttributes()

    this.multiple = this.input.hasAttribute('multiple')
    this.dpFromName = this.input.getAttribute(DATA_DP_FROM_NAME)
    this.dpToName = this.input.getAttribute(DATA_DP_TO_NAME)
    this.disabledToToday = this.input.hasAttribute(DATA_DISABLED_TO_TODAY)
    this.disabledFromToday = this.input.hasAttribute(DATA_DISABLED_FROM_TODAY)
    this.dateFromFieldName = this.input.getAttribute(DATA_DATE_FROM_FIELD_NAME)
    this.dateToFieldName = this.input.getAttribute(DATA_DATE_TO_FIELD_NAME)
    this.formatToShow = this.input.getAttribute(DATA_DATE_FORMAT_TO_SHOW)
    this.formatToShowDayjs = this.input.hasAttribute(DATA_DATE_FORMAT_TO_SHOW_DAYJS)
    this.formatToServer = this.input.getAttribute(DATA_DATE_FORMAT_TO_SERVER)
    this.initFromQuery = this.input.hasAttribute(DATA_DATE_INIT_FROM_QUERY)
    this.isInline = false

    this.dpExtraConfig = {}
    try {
      this.dpExtraConfig = this.input.getAttribute(DATA_DP_EXTRA_CONFIG)
      if (this.dpExtraConfig) {
        this.dpExtraConfig = JSON.parse(this.dpExtraConfig)
        this.isInline = Object.keys(this.dpExtraConfig).includes('inline')
      }
    } catch (e) {
      console.log(e)
    }

    this.dpAvailableDates = []
    try {
      const givenDates = this.input.getAttribute(DATA_DP_AVAILABLE_DATES)
      if (givenDates) {
        this.dpAvailableDates = JSON.parse(givenDates)
      }
    } catch (e) {
      console.log(e)
    }

    if (this.altInput) {
      this.name = this.altInput.getAttribute('name')
    }

    this.toggleLabelInit()

    if (this.multiple && !this.value) {
      this.value = []
    }

    if (Array.isArray(this.value)) {
      selectedDates.push(...this.value)
    } else if (this.value) {
      selectedDates.push(this.value)
    }

    const onSelect = (date) => {
      this.value = date

      if (!this.novalidate) {
        this.checkValid()
      }

      if (Array.isArray(this.value) ? this.value.length : this.value) {
        this.setFilled()
      }

      this.onSelect(this.value)

      if (this.form) {
        this.form.dispatchEvent(new Event('input', { bubbles: true }))
      }

      this.toggleClearBtn()
    }

    // закрытие календаря после выбора даты
    let preventOpenOnFocus = false

    const showDatepicker = () => {
      if (this.datepicker && !this.datepicker?.visible && !preventOpenOnFocus) {
        this.datepicker.show()
        preventOpenOnFocus = true
      }
    }

    this.input.addEventListener('focus', () => {
      showDatepicker()
    })

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || (e.key === 'Enter' && !this.datepicker?.visible)) {
        e.preventDefault()
        showDatepicker()
      }
    })

    // сабмит формы по энтеру на инпуте
    this.input.addEventListener('keypress', (e) => e.preventDefault())

    this.input.addEventListener('mousedown', () => {
      if (this.datepicker?.visible && !this.isInline) {
        this.datepicker.hide()
      } else {
        showDatepicker()
      }
    })

    if (this.formatToShow) {
      this.datepickerOptions.dateFormat = this.formatToShow
      if (this.formatToShowDayjs && window.app.dayjs) {
        this.datepickerOptions.dateFormat = (date) => window.app.dayjs(date).format(this.formatToShow)
      }
    }

    if (this.formatToServer && this.altInput) {
      this.datepickerOptions.altFieldDateFormat = this.formatToServer
      this.datepickerOptions.altField = this.altInput
    }

    this.datepicker = new AirDatepicker(this.input, {
      range: this.multiple,
      locale: localeRu,
      multipleDatesSeparator,
      navTitles: {
        days: 'MMMM yyyy',
      },
      buttons: ['clear'],
      showEvent: 'qwe', // нужно для переопределения событий открытия
      prevHtml: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" height="16" width="16">
                  <path d="M 7.3203125 3.2421875 A 0.750075 0.750075 0 0 0 6.8046875 3.46875 L 2.8886719 7.3847656 A 0.750075 0.750075 0 0 0 2.6035156 7.7890625 A 0.750075 0.750075 0 0 0 2.8652344 8.59375 A 0.750075 0.750075 0 0 0 2.8710938 8.5976562 L 6.8046875 12.53125 A 0.75130096 0.75130096 0 1 0 7.8671875 11.46875 L 5.1484375 8.75 L 12.667969 8.75 A 0.750075 0.750075 0 1 0 12.667969 7.25 L 5.1484375 7.25 L 7.8671875 4.53125 A 0.750075 0.750075 0 0 0 7.3203125 3.2421875 z " fill="currentColor" />
                </svg>`,
      nextHtml: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" height="16" width="16">
                  <path d="M 8.65625 3.2421875 A 0.750075 0.750075 0 0 0 8.1328125 4.53125 L 10.851562 7.25 L 3.3320312 7.25 A 0.750075 0.750075 0 1 0 3.3320312 8.75 L 10.851562 8.75 L 8.1328125 11.46875 A 0.75130096 0.75130096 0 1 0 9.1953125 12.53125 L 13.123047 8.6015625 A 0.750075 0.750075 0 0 0 13.410156 7.84375 A 0.750075 0.750075 0 0 0 13.410156 7.8398438 A 0.750075 0.750075 0 0 0 13.390625 7.7714844 A 0.750075 0.750075 0 0 0 13.371094 7.7167969 A 0.750075 0.750075 0 0 0 13.365234 7.7011719 A 0.750075 0.750075 0 0 0 13.363281 7.6972656 A 0.750075 0.750075 0 0 0 13.330078 7.6308594 A 0.750075 0.750075 0 0 0 13.107422 7.3808594 L 9.1953125 3.46875 A 0.750075 0.750075 0 0 0 8.65625 3.2421875 z " fill="currentColor" />
                </svg>`,
      offset: 8,
      selectedDates,
      onSelect: ({ date }) => {
        onSelect(date)

        // закрытие календаря после выбора даты
        if (Array.isArray(date) ? date.length === 2 : date) {
          if (!this.isInline) {
            this.datepicker.hide()
            this.input.focus()
          }
          preventOpenOnFocus = false
        } else {
          preventOpenOnFocus = true
        }
      },
      onShow: () => {
        this.onShow()

        preventOpenOnFocus = true
      },
      onHide: (isFinished) => {
        if (isFinished) {
          setTimeout(() => {
            preventOpenOnFocus = false
          }, 0)
        }
      },
      availableDates: this.dpAvailableDates,
      ...this.datepickerOptions,
      ...this.dpExtraConfig,
    })

    this.input.datepicker = this.datepicker

    if (this.scrollParentSelector) {
      const scrollParent = this.element.closest(this.scrollParentSelector)

      if (scrollParent) {
        scrollParent.addEventListener('scroll', () => {
          if (this.datepicker?.visible) {
            this.datepicker.hide()
          }
        })
      }
    }

    if (this.initFromQuery) {
      const date = searchParams.get(`${this.name}`)

      if (date) {
        this.setValue(date.split(multipleDatesSeparator))
      }
    }

    this.setMinDateFromToday()
    this.setMaxDateToToday()

    if (this.clearBtn) {
      this.toggleClearBtn()
      this.clearBtn.addEventListener('click', (e) => {
        this.reset()
        setTimeout(() => {
          preventOpenOnFocus = false
        }, 0)
      })
    }
  }

  checkValid(serverError = '') {
    if (this.input) {
      const valueIsEmpty = Array.isArray(this.value) ? this.value.length !== 2 : !this.value

      if (!!serverError || (valueIsEmpty && this.required && !this.disabled)) {
        this.setInvalid(serverError)
      } else {
        this.setValid()
      }
    } else {
      this.error = false
    }

    return !this.error
  }

  reset(silent = false) {
    this.value = this.multiple ? [] : ''
    if (this.altInput) {
      this.altInput.value = this.multiple ? [] : ''
    }
    if (!silent) {
      this.onSelect(this.value)
    }
    this.setUnfilled()

    if (this.datepicker) {
      this.datepicker.clear({ silent: silent })
    }
    this.setValid()
    this.toggleClearBtn()
  }

  setMinDateFromToday() {
    if (this.datepicker && this.disabledToToday) {
      this.datepicker.update({
        minDate: new Date(),
      })
    }
  }

  setMaxDateToToday() {
    if (this.datepicker && this.disabledFromToday) {
      this.datepicker.update({
        maxDate: new Date(),
      })
    }
  }

  setValue(value) {
    if (this.datepicker) {
      this.value = value

      if ((Array.isArray(this.value) && this.value.length) || (!Array.isArray(this.value) && this.value)) {
        this.datepicker.selectDate(this.value, { silent: true })
        this.setFilled()
      } else {
        this.setUnfilled()
      }

      if (!this.novalidate) {
        this.checkValid()
      }
    }
  }

  toggleClearBtn() {
    if (this.clearBtn) {
      this.clearBtn.classList.toggle(HIDDEN_CLASS_NAME, !this.value)
    }
    if (this.element) {
      this.element.classList.toggle(EMPTY_CLASS_NAME, !this.value)
    }
  }
}
