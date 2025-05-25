import { InputClass } from '../Input.class'

export class InputMaskClass extends InputClass {
  constructor(config) {
    super(config)
    this.inputmask = null

    if (this.input) {
      this.initMask()
    }
  }

  async initMask() {
    if (!window.app.inputmaskLib) {
      window.app.inputmaskLib = (await import('inputmask/lib/inputmask')).default
      window.app.inputmaskLib.extendAliases({
        email: {
          mask: '*{+}[.*{+}][.*{+}][.*{+}]@-{+}.-{+}[.-{+}][.-{+}]',
          greedy: false,
          onBeforePaste: function (pastedValue, opts) {
            return pastedValue.replace('mailto:', '')
          },
          definitions: {
            '*': {
              validator: '[0-9A-Za-z!#$%&\'*+/=?^_`{|}~-]',
            },
            '-': {
              validator: '[0-9A-Za-z-]',
            },
          },
        },
        tel: {
          mask: '+7 (999) 999-99-99',
          postValidation: function (buffer, pos, c, currentResult, opts, maskset, strict, fromCheckval) {
            // console.log(pos, c)
            if (pos === 0 && ['0', '8'].indexOf(c) !== -1) {
              return {
                pos: 1,
                c: 7,
                remove: 4,
              }
            }
            if (pos === 4 && c === '7') {
              return {
                remove: 4,
              }
            }
            return true
          },
          showMaskOnHover: false,
          jitMasking: true,
        },
        url: {
          regex:
            '(https?://[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://[a-zA-Z0-9]+.[^s]{2,}|[a-zA-Z0-9]+.[^s]{2,})',
          isComplete: function (buffer, opts) {
            return new RegExp(opts.regex).test(buffer.join(''))
          },
          showMaskOnHover: false,
          jitMasking: true,
        },
      })
    }

    const inputmaskLib = window.app.inputmaskLib

    if (inputmaskLib) {
      this.inputmask = inputmaskLib({
        showMaskOnHover: false,
        jitMasking: true,
      }).mask(this.input)

      // удаляет пробелы при вставке из буфера, так как маска почему-то по пробелу обрезает значение (возможно баг плагина)
      this.input.addEventListener('paste', (e) => {
        const clipboardData = e.clipboardData || window.clipboardData
        const pastedData = clipboardData.getData('Text')

        e.target.value = pastedData.replace(/\s/g, '')
      })
    }
  }

  /**
   * Проверка валидации инпута.
   *
   * @param {string} [serverError] ошибка, которая пришла с сервера
   * @return {boolean} если true - ошибок валидации нет
   */
  checkValid(serverError = '') {
    if (this.input) {
      this.value = (this.input.value || '').trim()

      if (!!serverError || (!this.value && this.required && !this.disabled)) {
        this.setInvalid(serverError)
      } else if (this.inputmask && !this.inputmask.isValid() && !this.disabled && this.value) {
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
