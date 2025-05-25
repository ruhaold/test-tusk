import {
  CHECKBOX_GROUP_CLASS,
  DATA_FILTER_STATIC_PARAMS,
  DATA_ID,
  DATEPICKER_COMPONENT,
  EMPTY_RESULTS_CLASS,
  FILE_DROPZONE_CLASS,
  FILTER_FORM_CLASS,
  FILTER_FORM_PRELOADER_CLASS,
  FILTER_FORM_WRAP_CLASS,
  FILTER_PAGE,
  FORM_INPUT_CLASS,
  HIDDEN_CLASS_NAME,
  INPUTMASK_CLASS_NAME,
  INTL_TEL_INPUT_CLASS_NAME,
  MULTISELECT_COMPONENT,
  MULTISELECT_COMPONENT_INPUT,
  NUMBER_INPUT_CLASS,
  PAGE_CLASS,
  PAGE_INNER_CLASS,
  PAGINATION_COMMON_PLACEHOLDER_CLASS,
  PAGINATION_COMMON_WRAP_CLASS,
  RATING_ROW,
  SHOW_CLASS_NAME,
} from '../../js/constants'
import { ListingClass } from './Listing.class'
import PaginationClass from '../pagination/Pagination.class'
import MultiselectClass from '../input/multiselect/Multiselect.class'
import { debounce } from 'lodash-es'
import DatepickerRangeClass from '../input/datepicker/DatepickerRange'
import { InputClass } from '../input/Input.class'
import { CheckboxGroupClass } from '../checkbox-group/CheckboxGroup.class'
import { InputTelClass } from '../input/input-tel/InputTel.class'
import { InputMaskClass } from '../input/input-mask/InputMask.class'
import { InputNumberClass } from '../input/input-number/InputNumber.class'
import InputFileClass from '../input/input-file/InputFile.class'

// запрашивает ту же страницу, где находится, с установленными фильтрами
export default class FilterClass {
  constructor(config) {
    if (typeof config === 'object') {
      Object.keys(config).forEach((key) => {
        this[key] = config[key]
      })
    }

    this.init()
  }

  init() {
    const formWraps = document.querySelectorAll(`.${FILTER_FORM_WRAP_CLASS}`)

    formWraps.forEach(async (wrap) => {
      const form = wrap.querySelector(`.${FILTER_FORM_CLASS}`)
      const dataId = wrap.getAttribute(DATA_ID)

      if (!form) return

      const multiselectEl = document.querySelector(`.${MULTISELECT_COMPONENT}`)
      const calendarEl = document.querySelector(`.${DATEPICKER_COMPONENT}`)

      if (multiselectEl && !window.app.TomSelectLib) {
        window.app.TomSelectLib = (await import('tom-select/dist/js/tom-select.base.min')).default
        const TomSelectLib_checkbox_options = (await import('tom-select/dist/js/plugins/checkbox_options')).default
        const TomSelectLib_dropdown_input = (await import('tom-select/dist/js/plugins/dropdown_input')).default
        const TomSelectLib_no_backspace_delete = (await import('tom-select/dist/js/plugins/no_backspace_delete'))
          .default
        window.app.TomSelectLib.define('checkbox_options', TomSelectLib_checkbox_options)
        window.app.TomSelectLib.define('dropdown_input', TomSelectLib_dropdown_input)
        window.app.TomSelectLib.define('no_backspace_delete', TomSelectLib_no_backspace_delete)
      }

      if (calendarEl && !window.app.AirDatepickerLib) {
        window.app.AirDatepickerLib = (await import('air-datepicker')).default
      }

      let action = form.getAttribute('action') || window.location.origin + window.location.pathname
      const formElements = form.querySelectorAll(
        `.${FORM_INPUT_CLASS}, .${FILE_DROPZONE_CLASS}, .${DATEPICKER_COMPONENT}, .${MULTISELECT_COMPONENT}, .${RATING_ROW}, .${CHECKBOX_GROUP_CLASS}, .${NUMBER_INPUT_CLASS}, .${INPUTMASK_CLASS_NAME}, .${INTL_TEL_INPUT_CLASS_NAME}, .${FILE_DROPZONE_CLASS}`,
      )

      const outdoorFormElements = []
      const formId = form.getAttribute('id')
      if (formId) {
        document.querySelectorAll(`[form="${formId}"`).forEach((input) => {
          const parent = input.closest(
            `.${FORM_INPUT_CLASS}, .${FILE_DROPZONE_CLASS}, .${DATEPICKER_COMPONENT}, .${MULTISELECT_COMPONENT}, .${RATING_ROW}, .${CHECKBOX_GROUP_CLASS}, .${NUMBER_INPUT_CLASS}, .${INPUTMASK_CLASS_NAME}, .${INTL_TEL_INPUT_CLASS_NAME}, .${FILE_DROPZONE_CLASS}`,
          )
          if (parent) {
            outdoorFormElements.push(parent)
          }
        })
      }

      const requestFilterStaticParams = form.getAttribute(`${DATA_FILTER_STATIC_PARAMS}`) || ''
      const pageContainer = wrap.querySelector(`.${PAGE_CLASS}`)
      let pageListContainer = wrap.querySelector(`.${PAGE_INNER_CLASS}`) || pageContainer
      const preloader = wrap.querySelector(`.${FILTER_FORM_PRELOADER_CLASS}`)
      const resetButtons = form.querySelectorAll('button[type="reset"]')
      const formElementsClasses = []
      let controllerRequest
      let listing = new ListingClass()
      let values = {}
      const FILTER_PAGE_RESULT = dataId ? `${FILTER_PAGE}_${dataId}` : FILTER_PAGE
      let notAddPageToBrowserUrl = false

      let paginationInstance = new PaginationClass({
        document: wrap,
        callback(val) {
          if (val?.page) {
            listing.current_page = val.page
            submit(true, val.isShowMore || false)
            toggleResetButtons()
          }
        },
      })

      notAddPageToBrowserUrl = paginationInstance?.pagination ? !!paginationInstance?.notCreatePages : true

      const deleteSearchParams = (searchParams) => {
        formElementsClasses.forEach((el) => {
          searchParams.delete(`${el.name}[]`)
          searchParams.delete(`${el.name}`)
        })
        searchParams.delete(FILTER_PAGE_RESULT)
      }
      const setSearchParams = (searchParams) => {
        Object.entries(values).forEach(([k, v]) => {
          if (!v) return

          if (Array.isArray(v)) {
            v.forEach((val) => {
              searchParams.append(`${k}[]`, val)
            })
          } else {
            searchParams.append(`${k}`, v)
          }
        })

        if (listing.current_page > 1) {
          searchParams.append(FILTER_PAGE_RESULT, listing.current_page)
        }
      }
      const setFirstPage = () => {
        const browserUrl = new URL(location.href)
        const searchParams = browserUrl.searchParams

        searchParams.delete(FILTER_PAGE_RESULT)
        searchParams.append(FILTER_PAGE_RESULT, 1)
        listing.current_page = 1
        history.replaceState(null, '', browserUrl)
      }

      const itemsRequest = debounce((searchParams, isShowMore) => {
        window.app.http
          .get(action, {
            params: searchParams,
            signal: controllerRequest.signal,
          })
          .then((data) => {
            const parser = new DOMParser()
            const doc = parser.parseFromString(data || '', 'text/html')

            if (!doc) return

            const wrapDoc = dataId
              ? doc.querySelector(`.${FILTER_FORM_WRAP_CLASS}[${DATA_ID}="${dataId}"]`) || doc
              : doc

            const paginationElDoc = wrapDoc.querySelector(`.${PAGINATION_COMMON_WRAP_CLASS}`)
            const paginationEl = wrap.querySelector(`.${PAGINATION_COMMON_WRAP_CLASS}`)
            const paginationPlaceholder = wrap.querySelector(`.${PAGINATION_COMMON_PLACEHOLDER_CLASS}`)
            const contentElDoc = wrapDoc.querySelector(`.${PAGE_CLASS}`)

            const emptyResultsElDoc = wrapDoc.querySelector(`.${EMPTY_RESULTS_CLASS}`)
            const selectEls = form.querySelectorAll(`.${MULTISELECT_COMPONENT}`)
            const selectElsDoc = wrapDoc.querySelectorAll(`.${MULTISELECT_COMPONENT}`)

            controllerRequest = null
            const contentListElDoc = wrapDoc.querySelector(`.${PAGE_INNER_CLASS}`) || contentElDoc

            if (listing.current_page > 1 && !paginationElDoc && emptyResultsElDoc) {
              setFirstPage()
            }

            if (pageContainer && pageListContainer && contentElDoc && contentListElDoc) {
              if (isShowMore) {
                pageListContainer.insertAdjacentHTML('beforeend', contentListElDoc.innerHTML)
              } else {
                pageContainer.innerHTML = contentElDoc.innerHTML
              }

              pageListContainer = wrap.querySelector(`.${PAGE_INNER_CLASS}`) || pageContainer
            }

            if (paginationElDoc) {
              if (paginationEl) {
                paginationEl.innerHTML = paginationElDoc.innerHTML
              } else if (paginationPlaceholder) {
                paginationPlaceholder.insertAdjacentHTML('afterend', paginationElDoc.innerHTML)
              }

              paginationInstance = new PaginationClass({
                document: wrap,
                callback(val) {
                  if (val?.page) {
                    listing.current_page = val.page
                    submit(true, val.isShowMore || false)
                    toggleResetButtons()
                  }
                },
              })

              notAddPageToBrowserUrl = paginationInstance?.pagination ? !!paginationInstance?.notCreatePages : true
            } else if (paginationEl) {
              paginationEl.remove()
            }

            selectEls.forEach((select) => {
              const input = select.querySelector(`.${MULTISELECT_COMPONENT_INPUT}`)

              if (input) {
                const name = input.getAttribute('name')

                if (name) {
                  const selectDoc = [...selectElsDoc].find((el) => {
                    const input = el.querySelector(`.${MULTISELECT_COMPONENT_INPUT}`)

                    return input ? input.getAttribute('name') === name : false
                  })

                  if (selectDoc) {
                    select.innerHTML = selectDoc.innerHTML

                    formElementsClasses.forEach((el, index) => {
                      if (el.name === name) {
                        formElementsClasses[index] = new MultiselectClass({ element: select, novalidate: true })
                      }
                    })
                  }
                }
              }
            })

            if (preloader) {
              preloader.classList.remove(SHOW_CLASS_NAME)
            }

            if (pageContainer && pageListContainer) {
              //здесь нужно заново инициализировать компоненты, при необходимости

              pageContainer.classList.remove(HIDDEN_CLASS_NAME)
            }

            if (paginationInstance) {
              paginationInstance.enablePagination()
            }
          })
          .catch((e) => {
            if (e?.code !== 'ERR_CANCELED') {
              if (preloader) {
                preloader.classList.remove(SHOW_CLASS_NAME)
              }

              if (pageContainer) {
                pageContainer.classList.remove(HIDDEN_CLASS_NAME)
              }

              if (paginationInstance) {
                paginationInstance.enablePagination()
              }
            }
          })
      }, 500)
      const submit = (isPage = false, isShowMore = false) => {
        if (controllerRequest) {
          controllerRequest.abort()
          controllerRequest = new AbortController()
        } else {
          controllerRequest = new AbortController()
        }

        const browserUrl = new URL(location.href)
        const searchParams = browserUrl.searchParams
        const searchParamsRequest = new URLSearchParams()
        const searchParamsStaticRequest = new URLSearchParams(requestFilterStaticParams)

        if (!isPage) {
          listing.current_page = 1
        }

        deleteSearchParams(searchParams)
        setSearchParams(searchParamsRequest)

        for (let [key, val] of searchParamsRequest.entries()) {
          if (notAddPageToBrowserUrl && key === FILTER_PAGE_RESULT) {
            continue
          }

          searchParams.append(key, val)
        }

        history.replaceState(null, '', browserUrl)

        if (!action) return

        for (let [key, val] of searchParamsStaticRequest.entries()) {
          searchParamsRequest.append(key, val)
        }

        if (isPage && !isShowMore && pageContainer) {
          const headerHeight = window.app.header ? window.app.header.getBoundingClientRect().height : 100

          window.scrollTo({
            top: pageContainer.getBoundingClientRect().top + window.scrollY - headerHeight - 100,
            behavior: 'smooth',
          })
        }

        if (preloader) {
          preloader.classList.add(SHOW_CLASS_NAME)
        }

        if (pageContainer) {
          pageContainer.classList.add(HIDDEN_CLASS_NAME)
        }

        if (paginationInstance) {
          paginationInstance.disablePagination()
        }

        itemsRequest(searchParamsRequest, isShowMore)
      }
      const setInitParams = () => {
        const browserUrl = new URL(location.href)
        const searchParams = browserUrl.searchParams
        const paginationEl = wrap.querySelector(`.${PAGINATION_COMMON_WRAP_CLASS}`)
        const emptyResultsEl = wrap.querySelector(`.${EMPTY_RESULTS_CLASS}`)

        listing.current_page = Number(searchParams.get(FILTER_PAGE_RESULT)) || 1

        if (listing.current_page > 1 && !paginationEl && emptyResultsEl) {
          setFirstPage()
        }

        formElementsClasses.forEach((el) => {
          const val = searchParams.get(`${el.name}`)
          const valArr = searchParams.getAll(`${el.name}[]`)

          const setValue = (value) => {
            if (el.setValue && !el.datepicker && !el.select && (!el.minLength || el.minLength <= value.length)) {
              el.setValue(value)
            }
          }

          if (val) {
            values[el.name] = val
            setValue(val)
          } else if (valArr.length) {
            values[el.name] = valArr
            setValue(valArr)
          }
        })
      }
      const toggleResetButtons = () => {
        let isEmpty = true

        Object.entries(values).forEach(([k, val]) => {
          if ((Array.isArray(val) && val.length) || (!Array.isArray(val) && val)) {
            isEmpty = false
          }
        })

        resetButtons.forEach((btn) => {
          btn.classList.toggle(HIDDEN_CLASS_NAME, isEmpty)

          if (isEmpty) {
            btn.setAttribute('disabled', '')
          } else {
            btn.removeAttribute('disabled')
          }
        })
      }

      const initFormElement = (element) => {
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
      }
      formElements.forEach((element) => initFormElement(element))
      outdoorFormElements.forEach((element) => initFormElement(element))

      setInitParams()
      toggleResetButtons()

      form.addEventListener('input', (e) => {
        formElementsClasses.forEach((el) => {
          if (el.datepicker) {
            values[el.name] = el.altInput ? el.altInput.value : el.value
          } else {
            values[el.name] = el.value
          }
        })

        toggleResetButtons()

        if (e.target.type !== 'search') {
          submit()
        }
      })

      form.addEventListener('submit', (e) => {
        e.preventDefault()
        submit()
      })

      form.addEventListener('reset', () => {
        formElementsClasses.forEach((el) => {
          el.reset()
        })
        values = {}

        submit()
        toggleResetButtons()
      })
    })
  }
}
