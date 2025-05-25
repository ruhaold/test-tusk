import {
  ARIA_DESCRIBEDBY,
  ARIA_EXPANDED,
  DATA_ERROR_MESSAGE,
  DATA_GROUP_FIELD,
  DATA_GROUP_LABEL_FIELD,
  DATA_GROUP_VALUE_FIELD,
  DATA_HIGHLIGHT,
  DATA_HINT_FIELD,
  DATA_LABEL,
  DATA_LABEL_FIELD,
  DATA_LINK_FIELD,
  DATA_OPTION_IS_LINK,
  DATA_OPTION_WITH_HINT,
  DATA_PRELOAD_DATA,
  DATA_URL,
  DATA_VALUE_FIELD,
  DATA_WITH_GROUPS,
  FILLED_CLASS_NAME,
  FOCUS_CLASSNAME,
  FORM_INPUT_LABEL_CLASS,
  MULTISELECT_COMPONENT_SELECT,
} from '../../../js/constants'
import { InputClass } from '../Input.class'
import { generateId } from '../../../js/functions/generateId'

export default class MultiselectClass extends InputClass {
  constructor(config) {
    super({
      ...config,
      isSuper: true,
    })

    this.onChange = config?.onChange || (() => {})
    this.onBlur = config?.onBlur || (() => {})
    this.onClear = config?.onClear || (() => {})
    this.onDropdownClose = config?.onDropdownClose || (() => {})
    this.onInput = config?.onInput || (() => {})

    this.selectOptions = config?.selectOptions || {}
    this.value = Array.isArray(config?.value) ? config.value : []
    this.novalidate = config?.novalidate || false

    this.select = null
    this.multiple = false
    this.readonly = false
    this.inputValue = ''
    this.labelField = ''
    this.valueField = ''
    this.hintField = ''
    this.linkField = ''
    this.url = ''
    this.optionWithHint = false
    this.groupLabelField = ''
    this.groupValueField = ''
    this.groupField = ''
    this.withGroups = false
    this.optionIsLink = false
    this.threshold = config?.threshold || 3
    this.tsControl = null

    if (this.element) {
      this.label = this.element.querySelector(`.${FORM_INPUT_LABEL_CLASS}`)
      this.selectEl = this.element.querySelector(`.${MULTISELECT_COMPONENT_SELECT}`)
      this.form = this.element.closest('form')

      if (this.selectEl) {
        this.init()
      }
    }
  }

  init() {
    const TomSelectLib = window.app.TomSelectLib

    if (!TomSelectLib) return

    const plugins = []
    const options = {}
    let controllerRequest

    this.getAttributes(false)

    this.multiple = this.selectEl.hasAttribute('multiple')
    this.labelField = this.selectEl.getAttribute(DATA_LABEL_FIELD) || 'label'
    this.valueField = this.selectEl.getAttribute(DATA_VALUE_FIELD) || 'value'
    this.hintField = this.selectEl.getAttribute(DATA_HINT_FIELD) || 'hint'
    this.linkField = this.selectEl.getAttribute(DATA_LINK_FIELD) || 'link'
    this.url = this.selectEl.getAttribute(DATA_URL)
    this.optionWithHint = this.selectEl.hasAttribute(DATA_OPTION_WITH_HINT)
    this.groupLabelField = this.selectEl.getAttribute(DATA_GROUP_LABEL_FIELD) || 'label'
    this.groupValueField = this.selectEl.getAttribute(DATA_GROUP_VALUE_FIELD) || 'value'
    this.groupField = this.selectEl.getAttribute(DATA_GROUP_FIELD) || 'group'
    this.withGroups = this.selectEl.hasAttribute(DATA_WITH_GROUPS)
    this.optionIsLink = this.selectEl.hasAttribute(DATA_OPTION_IS_LINK)
    this.dataLabel = this.selectEl.getAttribute(DATA_LABEL)
    this.required = this.selectEl.hasAttribute('required')
    this.disabled = this.selectEl.hasAttribute('disabled')
    this.message = this.selectEl.getAttribute(DATA_ERROR_MESSAGE) || ''
    this.name = this.selectEl.getAttribute('name')
    this.highlight = this.selectEl.hasAttribute(DATA_HIGHLIGHT)
    this.preload = this.selectEl.hasAttribute(DATA_PRELOAD_DATA)

    if (this.multiple) {
      plugins.push('checkbox_options')
    }

    plugins.push('dropdown_input')
    plugins.push('no_backspace_delete')

    const onChange = (val, isInit = false) => {
      const options = this.select?.options || {}
      let arr = []

      if (val) {
        if (Array.isArray(val)) {
          arr = val
        } else {
          arr = [val]
        }
      }

      this.inputValue = ''

      arr.forEach((id) => {
        const item = options?.[id]

        if (item) {
          if (this.optionIsLink && item[this.linkField]) {
            location.href = item[this.linkField]
          } else {
            this.inputValue += `${this.inputValue ? ', ' : ''}${item[this.labelField]}`
          }
        }
      })

      if (this.input) {
        this.input.value = this.inputValue
      }

      this.value = arr

      this.element.classList.toggle(FILLED_CLASS_NAME, !!this.value.length)

      if (!this.novalidate && !isInit) {
        this.checkValid()
      }

      if (!isInit) {
        this.onChange(arr)
      }
    }
    const onBlur = () => {
      if (!this.novalidate) {
        this.checkValid()
      }

      this.onBlur()
    }
    const onClear = () => {
      if (this.input) {
        this.input.value = ''
      }
      if (!this.novalidate) {
        this.checkValid()
      }

      this.onClear()
    }
    const onDropdownClose = () => {
      if (this.input) {
        this.input.classList.remove(FOCUS_CLASSNAME)
        this.input.setAttribute(ARIA_EXPANDED, 'false')
      }

      this.onDropdownClose()
    }
    const onDropdownOpen = () => {
      if (this.input) {
        this.input.classList.add(FOCUS_CLASSNAME)
        this.input.setAttribute(ARIA_EXPANDED, 'true')
      }
    }
    const load = (query, callback) => {
      if (controllerRequest) {
        controllerRequest.abort()
        controllerRequest = new AbortController()
      } else {
        controllerRequest = new AbortController()
      }

      if (this.url) {
        this.select.clearOptions()

        window.app.http
          .get(this.url, {
            params: {
              query: query?.trim() || '',
            },
            signal: controllerRequest.signal,
          })
          .then((res) => {
            controllerRequest = null
            const items = res?.data?.items
            const groups = res?.data?.groups || []

            if (Array.isArray(items) && items.length) {
              if (this.withGroups) {
                this.select.clearOptionGroups()

                if (Array.isArray(groups)) {
                  groups.forEach((group) => {
                    this.select.addOptionGroup(group[this.groupValueField], group)
                  })
                }
              }

              callback(items)
            } else {
              callback()
            }
          })
          .catch(() => {
            callback()
          })
      } else {
        callback()
      }
    }

    const render = {
      no_results: (data, escape) => {
        return '<div class="no-results" role="alert" aria-live="assertive">Не найдено</div>'
      },
      loading: (data, escape) => {
        return `<div role="alert" aria-live="assertive" class="form-message__icon _loading">
            <span class="screen-reader-only">Загрузка</span>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>`
      },
      not_loading: (data, escape) => {
        const query = data?.input || ''
        const queryLength = query.trim().length

        return this.url && queryLength && queryLength < this.threshold
          ? '<div class="no-results" role="alert" aria-live="assertive">Продолжайте ввод</div>'
          : null
      },
    }

    if (this.optionWithHint) {
      render.option = (data, escape) => {
        const hint = data[this.hintField] ? `<span class="hint">${data[this.hintField]}</span>` : ''
        const link = data[this.linkField]
        const tag = this.optionIsLink && link ? 'a' : 'div'
        const href = this.optionIsLink && link ? `href="${link}"` : ''

        return `
            <${tag} ${href}>
                <div class="option__inner">
                    <span class="label">${data[this.labelField]}</span>
                    ${hint}
                </div>
            </${tag}>
          `
      }
    }

    if (this.value.length) {
      options.items = this.value
    }

    this.select = new TomSelectLib(this.selectEl, {
      hideSelected: false,
      valueField: this.valueField,
      labelField: this.labelField,
      plugins,
      searchField: this.url ? [] : [this.labelField],
      highlight: this.highlight,
      preload: this.preload,
      optgroupField: this.groupField,
      optgroupValueField: this.groupValueField,
      optgroupLabelField: this.groupLabelField,
      placeholder: '',
      render,
      openOnFocus: true,
      load: this.url ? load : undefined,
      shouldLoad: (query) => {
        return this.url ? query.trim().length >= this.threshold : true
      },
      selectedAriaMessage: () => 'Выбрано',
      notSelectedAriaMessage: () => 'Не выбрано',
      checkboxIconHtml: `<svg class="svgsprite _only-checkbox" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.6251 6.65873L20.5494 5.45437C20.3281 5.20665 19.945 5.19339 19.7072 5.42523L9 15.8623L4.29256 11.4121C4.05375 11.1864 3.67568 11.2024 3.45677 11.4475L2.38181 12.651C2.16986 12.8883 2.18716 13.2517 2.4207 13.4677L8.5965 19.1822C8.82311 19.3919 9.17386 19.3887 9.39661 19.1749L21.594 7.46817C21.8205 7.25072 21.8343 6.89294 21.6251 6.65873Z" fill="currentColor"/>
      </svg>
      `,
      ...options,
      ...this.selectOptions,
      onChange: (val) => {
        onChange(val)
      },
      onBlur() {
        onBlur()
      },
      onClear() {
        onClear()
      },
      onDropdownClose() {
        onDropdownClose()
      },
      onDropdownOpen() {
        onDropdownOpen()
      },
      onInitialize: () => {
        setTimeout(() => {
          if (this.select) {
            onChange(this.select.items, true)
          }
        }, 0)
      },
    })

    this.input = this.select.wrapper.querySelector('.items-placeholder')

    if (this.select.control_input) {
      this.select.control_input.setAttribute('placeholder', 'Поиск')

      this.select.control_input.addEventListener('input', (e) => {
        e.stopPropagation()
      })
    }

    if (this.input && this.dataLabel) {
      const label = document.createElement('label')
      const id = generateId()
      const caption = this.element.querySelector('.input-common__caption')
      const captionId = caption?.getAttribute('id')
      this.tsControl = this.element.querySelector('.ts-control')

      label.classList.add('input-common__label')
      label.innerText = this.dataLabel
      label.setAttribute('for', id)

      if (this.required) {
        label.insertAdjacentHTML('beforeend', '<span aria-hidden="true" class="input-common__required">*</span>')
      }

      if (captionId) {
        const inputAriaDescribedBy = this.input.getAttribute(ARIA_DESCRIBEDBY) || ''

        this.input.setAttribute(ARIA_DESCRIBEDBY, `${inputAriaDescribedBy} ${captionId}`)
      }

      this.input.setAttribute('id', id)
      this.input.insertAdjacentElement('beforebegin', label)
      this.input.setAttribute('readonly', '')
      this.input.classList.add('input-common__input')
      this.input.classList.remove('items-placeholder')
      this.element.classList.add('_with-icon-right')
      this.input.setAttribute(ARIA_EXPANDED, 'false')
      this.input.insertAdjacentHTML(
        'afterend',
        `<svg class="svgsprite _arrow-down input-common__icon _icon-right" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.6182 9.44738L17.5432 8.24384C17.3243 7.99874 16.9462 7.98277 16.7074 8.20852L12 12.6587L7.29256 8.20852C7.05375 7.98277 6.67568 7.99874 6.45677 8.24384L5.38181 9.44738C5.16986 9.68467 5.18716 10.048 5.4207 10.2641L11.6038 15.9854C11.8274 16.1923 12.1726 16.1923 12.3962 15.9854L18.5793 10.2641C18.8128 10.048 18.8301 9.68467 18.6182 9.44738Z" fill="currentColor"/>
      </svg>
      `,
      )

      if (this.tsControl) {
        this.tsControl.classList = ''
      }
    }
  }

  checkValid(serverError = '') {
    if (this.input) {
      if (!!serverError || (!this.value.length && this.required && !this.disabled)) {
        this.setInvalid(serverError)
      } else {
        this.setValid()
      }
    } else {
      this.error = false
    }

    return !this.error
  }

  reset() {
    this.value = []
    this.inputValue = ''
    this.onChange(this.value)

    if (this.select) {
      this.select.clear(true)
    }
    this.setValid()
    this.onInput(this.inputValue)
  }

  /**
   * установка значения для селекта
   *
   * @param {number[] | string[]} value массив значений
   * */
  setValue(value) {
    if (this.select) {
      this.value = value

      if (Array.isArray(this.value) && this.value.length) {
        this.select.setValue(this.value, false)
        this.setFilled()
      } else {
        this.setUnfilled()
      }

      if (!this.novalidate) {
        this.checkValid()
      }
    }
  }
}
