import {
  DATA_DRAG_SCOPED,
  DATA_MAX_FILE_COUNT,
  DATA_MAX_FILE_COUNT_ERROR_MESSAGE,
  DATA_MAX_FILE_SIZE,
  DATA_FILE_ACCEPT_ERROR_MESSAGE,
  DATA_FILE_SIZE_ERROR_MESSAGE,
  DATA_USE_CLIPBOARD,
  DRAG_OVER_CLASS_NAME,
  FILE_DROPZONE_DELETE_FILE_CLASS,
  FILE_DROPZONE_FILE_CLASS,
  FILE_DROPZONE_INPUT_CLASS,
  FILE_DROPZONE_LIST_CLASS,
  HIDDEN_CLASS_NAME,
  DATA_FILE_COUNT_MESSAGE,
  FILE_DROPZONE_CAPTION_CLASS,
  DATA_ID,
  CUSTOM_EVENT_HELLO_IS_INIT,
  FORM_INPUT_LABEL_CLASS,
} from '../../../js/constants'
import { InputClass } from '../Input.class'
import { formatBytes } from '../../../js/functions/formatBytes'
import { generateId } from '../../../js/functions/generateId'
import { dropzoneFile } from './html'

export default class InputFileClass extends InputClass {
  constructor(config) {
    super({
      ...config,
      isSuper: true,
    })

    this.onError = config?.onError || (() => {})
    this.onAdd = config?.onAdd || (() => {})
    this.onDragStart = config?.onDragStart || (() => {})
    this.onDragEnd = config?.onDragEnd || (() => {})
    this.value = Array.isArray(config?.value) ? config.value : []
    this.valueMapped = this.value.map((file) => new FileClass(file))
    this.novalidate = config?.novalidate || false

    this.multiple = false
    this.acceptMimes = []
    this.useClipboard = false
    this.dragScoped = false
    this.isDragOver = false
    this.isDragOverEmitted = false
    this.maxFileCount = 1
    this.maxFileSize = 100
    this.maxFileSizeInit = this.maxFileSize
    this.listEl = null
    this.maxFileCountErrMsg = ''
    this.maxFileSizeErrMsg = ''
    this.fileAcceptErrMsg = ''
    this.filesLoadedMsg = ''

    if (this.element) {
      this.init()
    }
  }

  init() {
    const MustacheLib = window.app.MustacheLib

    if (!MustacheLib) return

    const fileApiError = !(window.File && window.FileReader && window.FileList && window.Blob)
    this.input = this.element.querySelector(`.${FILE_DROPZONE_INPUT_CLASS}`)
    this.label = this.element.querySelector(`.${FORM_INPUT_LABEL_CLASS}`)

    this.getAttributes(false)

    if (this.input) {
      this.listEl = this.element.querySelector(`.${FILE_DROPZONE_LIST_CLASS}`)
      this.captiontEl = this.element.querySelector(`.${FILE_DROPZONE_CAPTION_CLASS}`)
      this.multiple = this.input.getAttribute('multiple')
      this.acceptMimes = (this.input.getAttribute('accept') || '').split(',')
      this.useClipboard = this.input.hasAttribute(DATA_USE_CLIPBOARD)
      this.dragScoped = this.input.hasAttribute(DATA_DRAG_SCOPED)
      this.multiple = this.input.hasAttribute('multiple')
      this.maxFileCount = this.multiple ? Number(this.input.getAttribute(DATA_MAX_FILE_COUNT)) || 1 : 1
      this.maxFileSize = (Number(this.input.getAttribute(DATA_MAX_FILE_SIZE)) || 100) * 1024 * 1024
      this.maxFileSizeInit = this.maxFileSize
      this.maxFileCountErrMsg = this.input.getAttribute(DATA_MAX_FILE_COUNT_ERROR_MESSAGE) || ''
      this.maxFileSizeErrMsg = this.input.getAttribute(DATA_FILE_SIZE_ERROR_MESSAGE) || ''
      this.fileAcceptErrMsg = this.input.getAttribute(DATA_FILE_ACCEPT_ERROR_MESSAGE) || ''
      this.filesLoadedMsg = this.input.getAttribute(DATA_FILE_COUNT_MESSAGE) || ''

      this.calcInputPadding()

      const isAcceptedFile = (file) => {
        if (!this.acceptMimes.length) {
          return true
        }

        return this.acceptMimes.some(
          (type) => file?.type?.indexOf(type.trim()) > -1 || file?.name?.indexOf(type.trim()) > -1,
        )
      }

      const isValidSize = (file) => {
        const resultSize = this.maxFileSize - (file?.size || 0)

        if (resultSize >= 0) {
          this.maxFileSize = resultSize
          return true
        } else return false
      }

      const emitDragState = () => {
        if (this.isDragOver && !this.isDragOverEmitted && !this.disabled) {
          this.onDragStart()
          this.isDragOverEmitted = true
          this.element.classList.add(DRAG_OVER_CLASS_NAME)
        } else if (!this.isDragOver && this.isDragOverEmitted) {
          this.onDragEnd()
          this.isDragOverEmitted = false
          this.element.classList.remove(DRAG_OVER_CLASS_NAME)
        }
      }

      const onDragEnter = () => {
        this.isDragOver = true
        emitDragState()
      }
      const onDragLeave = () => {
        this.isDragOver = false
        emitDragState()
      }
      const onDrop = (e) => {
        if (this.disabled) {
          return
        }
        if (e.dataTransfer?.files.length) {
          processFiles(e.dataTransfer.files)
        }
      }

      const processFiles = (fileList) => {
        this.setValid()

        const count = this.multiple ? fileList.length : 1
        const result = []
        let errors = []

        // чтение каждого файла
        for (let i = 0; i < count; i++) {
          /** @type {File} */
          const file = fileList[i]

          if (this.multiple && this.value.length + result.length >= this.maxFileCount) {
            errors = [this.maxFileCountErrMsg]
            continue
          }

          if (!isAcceptedFile(file)) {
            errors.push(MustacheLib.render(this.fileAcceptErrMsg, file))
            continue
          }

          if (!isValidSize(file)) {
            errors.push(MustacheLib.render(this.maxFileSizeErrMsg, file))
            continue
          }

          result.push(file)
        }

        if (errors.length) {
          this.setInvalid(errors.join(' '))
          this.onError(errors)
        }

        if (!result.length) {
          return
        }

        // передача файлов наверх
        this.onAdd(result)

        if (this.multiple) {
          this.value.push(...result)
          this.valueMapped.push(...result.map((file) => new FileClass(file)))
        } else {
          this.value = result
          this.valueMapped = result.map((file) => new FileClass(file))
        }
        this.input.value = ''
        onDragLeave()
        this.setFileList()
      }

      const onChange = (e) => {
        if (fileApiError || this.disabled) {
          return
        }

        e.preventDefault()
        const files = e.target.files
        if (files) {
          processFiles(files)
        }
      }

      const onDropEvent = (e) => {
        onDrop(e)
        onDragLeave()
      }

      const preventPageReload = (e) => {
        e.preventDefault()
      }

      const onPaste = (e) => {
        let clipboardEvent = e
        if (this.disabled || !clipboardEvent.clipboardData) {
          return
        }
        const files = []
        for (const index in clipboardEvent.clipboardData.items) {
          const item = clipboardEvent.clipboardData.items[index]
          if (item.kind === 'file') {
            const file = item.getAsFile()
            if (file) {
              files.push(file)
            }
          }
        }
        if (files.length) {
          processFiles(files)
        }
      }

      if (fileApiError) {
        this.setInvalid('Ваш браузер не поддерживает File API')
      }

      window.addEventListener('dragover', preventPageReload)
      window.addEventListener('drop', preventPageReload)

      // paste to all window
      if (this.useClipboard) {
        window.addEventListener('paste', onPaste)
      }

      this.input.addEventListener('change', onChange)
      this.input.addEventListener('blur', () => {
        if (!this.novalidate) {
          this.checkValid()
        }
      })

      const addEvents = (el) => {
        el.addEventListener('drop', onDropEvent)
        el.addEventListener('dragenter', onDragEnter)
        el.addEventListener('dragover', onDragEnter)
        el.addEventListener('dragleave', onDragLeave)
        el.addEventListener('mouseleave', onDragLeave)
        el.addEventListener('mouseover', onDragLeave)
        el.addEventListener('dragend', onDragLeave)
      }

      addEvents(this.dragScoped ? this.input : window)

      window.addEventListener(CUSTOM_EVENT_HELLO_IS_INIT, () => {
        this.setFileList()
      })
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

  setFileList() {
    if (this.listEl) {
      this.listEl.innerHTML = this.valueMapped.map(dropzoneFile).join(' ')

      const renderCaption = () => {
        const MustacheLib = window.app.MustacheLib

        if (!MustacheLib) return

        if (this.captiontEl) {
          this.captiontEl.innerText = MustacheLib.render(this.filesLoadedMsg, {
            count: this.valueMapped.length,
            size: formatBytes(this.maxFileSizeInit - this.maxFileSize),
          })

          if (this.valueMapped.length) {
            this.captiontEl.classList.remove(HIDDEN_CLASS_NAME)
          } else {
            this.captiontEl.classList.add(HIDDEN_CLASS_NAME)
          }
        }
      }

      if (this.valueMapped.length) {
        this.listEl.classList.remove(HIDDEN_CLASS_NAME)
      } else {
        this.listEl.classList.add(HIDDEN_CLASS_NAME)
      }

      renderCaption()

      const items = this.listEl.querySelectorAll(`.${FILE_DROPZONE_FILE_CLASS}`)

      items.forEach((item) => {
        const btn = item.querySelector(`.${FILE_DROPZONE_DELETE_FILE_CLASS}`)

        if (btn) {
          const fileId = btn.getAttribute(DATA_ID)
          if (fileId) {
            btn.addEventListener('click', () => {
              const fileIndex = this.valueMapped.findIndex((el) => el.id === fileId)

              if (fileIndex > -1) {
                this.maxFileSize += this.valueMapped[fileIndex].file.size
                this.setValid()
                this.valueMapped.splice(fileIndex, 1)
                item.remove()
                this.value = this.valueMapped.reduce((acc, val) => {
                  acc.push(val.file)
                  return acc
                }, [])

                if (!this.valueMapped.length) {
                  this.listEl.classList.add(HIDDEN_CLASS_NAME)
                }
                renderCaption()
              }
            })
          }
        }
      })
    }
  }

  reset() {
    this.value = []
    this.valueMapped = []
    this.maxFileSize = this.maxFileSizeInit
    this.setFileList()

    if (this.input) {
      this.input.value = ''
    }
    this.setValid()
  }
}

class FileClass {
  /** @param file {File}  */
  constructor(file) {
    this.id = generateId()
    this.file = file
  }
}
