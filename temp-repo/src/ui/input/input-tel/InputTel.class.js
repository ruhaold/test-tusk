import {
  CUSTOM_EVENT_ALT_ZOOM_CHANGE,
  CUSTOM_EVENT_OPTIMIZED_RESIZE,
  CUSTOM_EVENT_TEL_COUNTRIES_IS_INIT,
  DATA_INTL_DIAL_CODE,
  DATA_INTL_ISO,
} from '../../../js/constants'
import { InputMaskClass } from '../input-mask/InputMask.class'

export class InputTelClass extends InputMaskClass {
  constructor(config) {
    super(config)

    this.iti = null
    this.dataIntlDialCode = null
    this.dataIntlIso = null
    this.preferredCountries = []
    this.countryData = null

    if (this.input) {
      this.preferredCountries = Array.isArray(window.app.intlTelInput?.preferredCountries)
        ? window.app.intlTelInput.preferredCountries
        : ['ru']
      this.dataIntlDialCode = this.input.getAttribute(DATA_INTL_DIAL_CODE) || ''
      this.dataIntlIso = this.input.getAttribute(DATA_INTL_ISO) || ''

      this.initIti().then(() => {
        this.addEvents()
      })
    }
  }

  async initIti() {
    if (window.app.telCountries?.length || window.app.telCountriesError) {
      if (!window.app.intlTelInputLib) {
        window.app.intlTelInputLib = (await import('intl-tel-input')).default
      }

      const intlTelInputLib = window.app.intlTelInputLib
      const countryData = window.intlTelInputGlobals?.getCountryData() || []

      window.app.telCountries?.forEach((newData) => {
        const countryIndex = countryData.findIndex((el) => el.iso2.toLowerCase() === newData.iso2)

        if (countryIndex > -1) {
          countryData[countryIndex] = {
            ...newData,
            priority: countryData[countryIndex]?.priority || 0,
          }
        } else {
          countryData.push(newData)
        }
      })

      if (intlTelInputLib) {
        this.iti = intlTelInputLib(this.input, {
          initialCountry: 'ru',
          preferredCountries: this.preferredCountries,
        })

        this.setPadding()

        this.countryData = this.iti.getSelectedCountryData()
      }
    }
  }

  /**
   * устанавливает отступ слева у инпута
   * */
  setPadding() {
    if (this.iti) {
      const width = this.iti.flagsContainer.getBoundingClientRect().width
      this.element.style = `--padding-left-input: ${width}px`
    }
  }

  addEvents() {
    this.input.addEventListener('countrychange', () => {
      if (this.iti) {
        this.countryData = this.iti.getSelectedCountryData()
      }

      this.setValid()
      this.setPadding()
    })

    window.addEventListener(CUSTOM_EVENT_TEL_COUNTRIES_IS_INIT, () => {
      this.initIti()
    })
    window.addEventListener(CUSTOM_EVENT_OPTIMIZED_RESIZE, this.setPadding)
    window.addEventListener(CUSTOM_EVENT_ALT_ZOOM_CHANGE, () => {
      setTimeout(() => {
        this.setPadding()
      }, 1000)
    })
  }

  setValid() {
    super.setValid()

    if (this.input && this.iti && this.countryData && this.input.value) {
      const isRu = this.countryData.iso2 === 'ru'
      const isDialCode = this.input.value.startsWith('+')
      const dialCode = this.countryData.dialCode
      let value = this.input.value

      if (!isDialCode) {
        if (!isRu) {
          value = `+${dialCode}${value}`
        } else {
          if (value.startsWith('7')) {
            value = `+${value}`
          } else if (value.startsWith('8')) {
            value = value.substring(1)
            value = `+${dialCode}${value}`
          } else {
            value = `+${dialCode}${value}`
          }
        }

        this.value = value
      }
    }
  }
}
