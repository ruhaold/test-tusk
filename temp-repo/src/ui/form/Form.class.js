import {
  CHECKBOX_GROUP_CLASS,
  CUSTOM_EVENT_CLOSE,
  CUSTOM_EVENT_FORM_SEND_SUCCESS,
  CUSTOM_EVENT_HANDLE_CLOSE,
  CUSTOM_EVENT_HANDLE_OPEN,
  DATA_NATIVE_ACTION,
  DATA_POPUP_ID,
  DATA_SUCCESS_WITHOUT_RESET_FORM,
  DATE_FORMAT,
  DATEPICKER_COMPONENT,
  FILE_DROPZONE_CLASS,
  FORM_CLASS,
  FORM_HIDDEN_INPUT,
  FORM_INPUT_CLASS,
  FORM_PRELOADER_CLASS,
  HIDDEN_CLASS_NAME,
  INPUTMASK_CLASS_NAME,
  INTL_TEL_INPUT_CLASS_NAME,
  LOADING_CLASS_NAME,
  MULTISELECT_COMPONENT,
  NUMBER_INPUT_CLASS,
  POPUP_CLASS,
  RATING_ROW,
  SUCCESS_CLASS_NAME,
  ERROR_CLASS_NAME,
} from '../../js/constants'
import { InputTelClass } from '../input/input-tel/InputTel.class'
import { InputMaskClass } from '../input/input-mask/InputMask.class'
import { InputNumberClass } from '../input/input-number/InputNumber.class'
import MultiselectClass from '../input/multiselect/Multiselect.class'
import DatepickerRangeClass from '../input/datepicker/DatepickerRange'
import { InputClass } from '../input/Input.class'
import { CheckboxGroupClass } from '../checkbox-group/CheckboxGroup.class'
import { formDataToObject } from '../../js/functions/formDataToObject'
import FormPreloaderClass from '../form-message/FormPreloader.class'
import InputFileClass from '../input/input-file/InputFile.class'

export default class FormClass {
  constructor(config) {
    if (typeof config === 'object') {
      Object.keys(config).forEach((key) => {
        this[key] = config[key]
      })
    }

    this.init()
  }

  async init() {
    const forms = document.querySelectorAll(`.${FORM_CLASS}`)

    if (!forms.length) return

    const multiselectEl = document.querySelector(`.${MULTISELECT_COMPONENT}`)
    const calendarEl = document.querySelector(`.${DATEPICKER_COMPONENT}`)

    if (multiselectEl && !window.app.TomSelectLib) {
      window.app.TomSelectLib = (await import('tom-select/dist/js/tom-select.base.min')).default
      const TomSelectLib_checkbox_options = (await import('tom-select/dist/js/plugins/checkbox_options')).default
      const TomSelectLib_dropdown_input = (await import('tom-select/dist/js/plugins/dropdown_input')).default
      const TomSelectLib_no_backspace_delete = (await import('tom-select/dist/js/plugins/no_backspace_delete')).default
      window.app.TomSelectLib.define('checkbox_options', TomSelectLib_checkbox_options)
      window.app.TomSelectLib.define('dropdown_input', TomSelectLib_dropdown_input)
      window.app.TomSelectLib.define('no_backspace_delete', TomSelectLib_no_backspace_delete)
    }

    if (calendarEl && !window.app.AirDatepickerLib) {
      window.app.AirDatepickerLib = (await import('air-datepicker')).default
    }

    forms.forEach((form) => {
      let errors = false
      const action = form.getAttribute('action')
      const formElements = form.querySelectorAll(
        `.${FORM_INPUT_CLASS}, .${FILE_DROPZONE_CLASS}, .${DATEPICKER_COMPONENT}, .${MULTISELECT_COMPONENT}, .${RATING_ROW}, .${CHECKBOX_GROUP_CLASS}, .${NUMBER_INPUT_CLASS}, .${INPUTMASK_CLASS_NAME}, .${INTL_TEL_INPUT_CLASS_NAME}, .${FILE_DROPZONE_CLASS}`,
      )
      const dataNativeAction = form.hasAttribute(DATA_NATIVE_ACTION)
      const formElementsClasses = []
      let preloaderEl = form.querySelector(`.${FORM_PRELOADER_CLASS}`)
      const popupEl = form.closest(`.${POPUP_CLASS}`)
      let preloader = null
      const formElementsHidden = form.querySelectorAll(`.${FORM_HIDDEN_INPUT}`)
      const popupStatusId = form.getAttribute(DATA_POPUP_ID)
      const popupStatus = popupStatusId ? document.querySelector(`.${POPUP_CLASS}#${popupStatusId}`) : null
      let inputStartTime
      const dataSuccessWithoutResetForm = form.hasAttribute(DATA_SUCCESS_WITHOUT_RESET_FORM)
      let isLoading = false

      if (!preloaderEl && (popupEl || popupStatus)) {
        preloaderEl = (popupEl || popupStatus).querySelector(`.${FORM_PRELOADER_CLASS}`)
      }

      const showForm = () => {
        this.show(form)

        if (formElementsClasses[0]?.input) {
          formElementsClasses[0].input.focus()
        }
      }

      if (popupStatus) {
        popupStatus.addEventListener(CUSTOM_EVENT_CLOSE, () => {
          showForm()
        })
      }

      if (preloaderEl) {
        preloader = new FormPreloaderClass({
          element: preloaderEl,
          onClose() {
            if (popupStatus) {
              popupStatus.dispatchEvent(new CustomEvent(CUSTOM_EVENT_HANDLE_CLOSE))
            }

            showForm()
          },
        })
      }

      formElements.forEach((element) => {
        if (element.classList.contains(INTL_TEL_INPUT_CLASS_NAME)) {
          formElementsClasses.push(new InputTelClass({ element }))
        } else if (element.classList.contains(INPUTMASK_CLASS_NAME)) {
          formElementsClasses.push(new InputMaskClass({ element }))
        } else if (element.classList.contains(NUMBER_INPUT_CLASS)) {
          formElementsClasses.push(new InputNumberClass({ element }))
        } else if (element.classList.contains(MULTISELECT_COMPONENT)) {
          formElementsClasses.push(new MultiselectClass({ element }))
        } else if (element.classList.contains(DATEPICKER_COMPONENT)) {
          formElementsClasses.push(new DatepickerRangeClass({ element }))
        } else if (element.classList.contains(FILE_DROPZONE_CLASS)) {
          formElementsClasses.push(new InputFileClass({ element }))
        } else if (element.classList.contains(FORM_INPUT_CLASS)) {
          formElementsClasses.push(new InputClass({ element }))
        } else if (element.classList.contains(CHECKBOX_GROUP_CLASS)) {
          formElementsClasses.push(new CheckboxGroupClass({ element }))
        }
      })

      FormClass.initDatePickers(formElementsClasses)

      const checkValid = (serverErrors) => {
        errors = false
        formElementsClasses.forEach((classInstance) => {
          classInstance.isHidden = window.app.elementIsHidden(classInstance.element)

          if (classInstance.isHidden) {
            return
          }

          const name = classInstance.name
          const serverError = name ? serverErrors?.[name] : ''
          const isValid = classInstance.checkValid(serverError)

          if (!isValid) {
            if (!errors && classInstance.input) {
              classInstance.input.focus()
            }

            errors = true
          }
        })
      }

      form.addEventListener('input', () => {
        errors = false

        if (!inputStartTime) {
          inputStartTime = Date.now()
        }
      })

      form.addEventListener('submit', (e) => {
        if (dataNativeAction) return

        e.preventDefault()

        if (isLoading) return

        checkValid()

        if (action && !errors) {
          isLoading = true

          // Блокируем все поля формы и кнопку отправки
          const formInputs = form.querySelectorAll('input, textarea, select, button[type="submit"]');
          formInputs.forEach(input => {
            input.disabled = true;
          });

          if (preloader) {
            if (popupStatus) {
              popupStatus.dispatchEvent(new CustomEvent(CUSTOM_EVENT_HANDLE_OPEN))
            }

            preloader.showLoading()
            form.classList.add(LOADING_CLASS_NAME)
          }
          const formData = new FormData()
          const diffTime = window.app.dayjs().diff(inputStartTime)

          if (diffTime > 5000) {
            formData.append('antiBot', 1) // защита от ботов
          }

          formElementsClasses.forEach((el) => {
            el.isHidden = window.app.elementIsHidden(el.element)

            if (el.isHidden) {
              return
            }

            if (Array.isArray(el.value)) {
              if (el.datepicker && el.multiple && el.dateFromFieldName && el.dateToFieldName) {
                const dateFrom = el.value[0]
                const dateTo = el.value[1]

                if (dateFrom) {
                  formData.append(`${el.dateFromFieldName}`, window.app.dayjs(dateFrom).format(DATE_FORMAT))
                }

                if (dateTo) {
                  formData.append(`${el.dateToFieldName}`, window.app.dayjs(dateTo).format(DATE_FORMAT))
                }
              } else {
                el.value.forEach((val) => {
                  if (el.datepicker && val) {
                    val = window.app.dayjs(val).format(DATE_FORMAT)
                  }

                  formData.append(`${el.name}[]`, val)
                })
              }
            } else {
              let value = el.value

              if (value && el.datepicker) {
                value = window.app.dayjs(value).format(DATE_FORMAT)
              } else if (value && el.iti && el.dataIntlDialCode && el.dataIntlIso && el.countryData) {
                const selectedCountryData = el.countryData
                let dialCode = selectedCountryData?.dialCode
                const iso2 = selectedCountryData?.iso2

                if (dialCode) {
                  dialCode = dialCode.startsWith('+') ? dialCode : `+${dialCode}`
                  formData.append(el.dataIntlDialCode, dialCode)
                }
                if (iso2) {
                  formData.append(el.dataIntlIso, iso2)
                }
              }

              formData.append(el.name, value)
            }
          })

          formElementsHidden.forEach((el) => {
            formData.append(el.name, el.value)
          })

          // Заменяем реальный HTTP-запрос на имитацию для тестирования
          // Раскомментируйте нужный вариант для тестирования:

          // Имитация успешного запроса
          //simulateSuccessfulRequest(formData);

          // Имитация запроса с ошибкой
           simulateFailedRequest(formData);

          // Оригинальный HTTP запрос (закомментирован)
          /*
          window.app.http
            .post(action, formData)
            .then((response) => {
              console.log(response)
              // console.log('data', data?.message)
              // console.log('data', data?.success)
              // const message = data?.message
              // if (!data?.success) {
              //   if (preloader) {
              //     this.hide(form)
              //     preloader.showError(message, '', formDataToObject(formData))
              //   }
              // } else {
              //   if (preloader) {
              //     this.hide(form)
              //     preloader.showSuccess('', '', formDataToObject(formData))
              //   }
              //
              //   if (!dataSuccessWithoutResetForm) {
              //     formElementsClasses.forEach((el) => el.reset(true))
              //     form.reset()
              //   }
              //
              //   form.dispatchEvent(
              //     new CustomEvent(CUSTOM_EVENT_FORM_SEND_SUCCESS, {
              //       detail: {
              //         formData,
              //       },
              //     }),
              //   )
              // }
            })
            .catch((error) => {
              console.log('error', error)
              const errors = error?.errors
              const message = error.message

              if (errors) {
                if (popupStatus) {
                  popupStatus.dispatchEvent(new CustomEvent(CUSTOM_EVENT_HANDLE_CLOSE))
                }

                if (preloader) {
                  preloader.hide()
                }
                showForm()
                setTimeout(() => {
                  checkValid(errors)
                }, 0)
              } else if (preloader) {
                this.hide(form)
                preloader.showError(message, '', formDataToObject(formData))
              }
            })
            .finally(() => {
              form.classList.remove(LOADING_CLASS_NAME)
              isLoading = false

              // Разблокируем все поля формы и кнопку отправки
              const formInputs = form.querySelectorAll('input, textarea, select, button[type="submit"]');
              formInputs.forEach(input => {
                input.disabled = false;
              });

              // Скрываем прелоадер, если он не скрыт явно через showSuccess или showError
              if (preloader && !preloader.element.classList.contains(SUCCESS_CLASS_NAME) && !preloader.element.classList.contains(ERROR_CLASS_NAME)) {
                preloader.hide();
              }
            })
          */

          // Функции для имитации запросов
          function simulateSuccessfulRequest(formData) {
            // Имитируем задержку сетевого запроса (2 секунды)
            setTimeout(() => {
              console.log('Имитация успешного запроса с данными:', formDataToObject(formData));

              // Показываем сообщение об успехе
              if (preloader) {
                form.classList.add(HIDDEN_CLASS_NAME);
                preloader.showSuccess('Успешно отправлено', 'Ваша заявка принята в обработку. Мы свяжемся с вами в ближайшее время.', formDataToObject(formData));
              }

              // Сбрасываем форму при успешной отправке
              if (!dataSuccessWithoutResetForm) {
                formElementsClasses.forEach((el) => el.reset(true));
                form.reset();
              }

              // Генерируем событие успешной отправки формы
              form.dispatchEvent(
                new CustomEvent(CUSTOM_EVENT_FORM_SEND_SUCCESS, {
                  detail: {
                    formData,
                  },
                }),
              );

              // Выполняем код из блока finally
              cleanupAfterRequest();
            }, 2000);
          }

          function simulateFailedRequest(formData) {
            // Имитируем задержку сетевого запроса (2 секунды)
            setTimeout(() => {
              console.log('Имитация запроса с ошибкой');

              // Показываем сообщение об ошибке
              if (preloader) {
                form.classList.add(HIDDEN_CLASS_NAME);
                preloader.showError('Ошибка отправки', 'Извините, произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.', formDataToObject(formData));
              }

              // Выполняем код из блока finally
              cleanupAfterRequest();
            }, 2000);
          }

          function cleanupAfterRequest() {
            form.classList.remove(LOADING_CLASS_NAME);
            isLoading = false;

            // Разблокируем все поля формы и кнопку отправки
            const formInputs = form.querySelectorAll('input, textarea, select, button[type="submit"]');
            formInputs.forEach(input => {
              input.disabled = false;
            });

            // Скрываем прелоадер, если он не показывает результат
            if (preloader && !preloader.element.classList.contains(SUCCESS_CLASS_NAME) && !preloader.element.classList.contains(ERROR_CLASS_NAME)) {
              preloader.hide();
            }
          }
        }
      })
    })
  }

  hide(form) {
    if (form) {
      form.classList.add(HIDDEN_CLASS_NAME)
    }
  }

  show(form) {
    if (form) {
      form.classList.remove(HIDDEN_CLASS_NAME)
    }
  }

  /**
   * @param {Array} formElementsClasses массив элементов формы
   *
   * связывает календари между собой по имени
   */
  static initDatePickers(formElementsClasses = []) {
    if (Array.isArray(formElementsClasses)) {
      formElementsClasses.forEach((classInstance) => {
        const name = classInstance.name

        if (classInstance.datepicker && classInstance.dpToName && name) {
          const dpTo = formElementsClasses.find((dp) => dp.name === classInstance.dpToName && name === dp.dpFromName)

          if (dpTo && dpTo.datepicker) {
            classInstance.onShow = () => {
              dpTo.isHidden = window.app.elementIsHidden(dpTo.element)

              classInstance.datepicker.update({
                maxDate: dpTo.isHidden ? '' : dpTo.value,
              })

              if (dpTo.isHidden) {
                dpTo.reset()
              }
            }

            dpTo.onShow = () => {
              classInstance.isHidden = window.app.elementIsHidden(classInstance.element)

              if (classInstance.isHidden || !classInstance.value) {
                dpTo.setMinDateFromToday()
              } else if (classInstance.value) {
                dpTo.datepicker.update({
                  minDate: classInstance.value,
                })
              }

              if (classInstance.isHidden) {
                classInstance.reset()
              }
            }
          }
        }
      })
    }
  }
}
