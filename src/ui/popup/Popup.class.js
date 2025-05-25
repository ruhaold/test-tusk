import {
  ARIA_HIDDEN,
  CUSTOM_EVENT_CLOSE,
  CUSTOM_EVENT_ESCAPE_KEYDOWN,
  CUSTOM_EVENT_HANDLE_CLOSE,
  CUSTOM_EVENT_HANDLE_OPEN,
  CUSTOM_EVENT_OPEN,
  CUSTOM_EVENT_SET_FOCUS_IN_MODAL,
  DATA_INIT,
  DATA_MODAL,
  OPEN_CLASS_NAME,
  POPUP_BTN_CLOSE_CLASS,
  POPUP_CLASS,
  BODY_MENU_OPENED_CLASS_NAME,
  FILTER_FORM_PRELOADER_CLASS,
  POPUP_DYNAMIC_CONTENT_CLASS,
  DATA_URL,
  SHOW_CLASS_NAME,
} from '../../js/constants'

export default class PopupClass {
  constructor(config) {
    if (typeof config === 'object') {
      Object.keys(config).forEach((key) => {
        this[key] = config[key]
      })
    }

    this.init()
  }

  init() {
    const popups = document.querySelectorAll(`.${POPUP_CLASS}`)

    popups.forEach(PopupClass.manualInit)
  }

  static manualInit(popup) {
    if (popup) {
      const isInit = popup.hasAttribute(DATA_INIT)
      const closeBtns = popup.querySelectorAll(`.${POPUP_BTN_CLOSE_CLASS}`)
      const id = popup.id
      let removeFocusInModal
      let popupInPopup = false
      const openBtns = id ? document.querySelectorAll(`[${DATA_MODAL}=${id}]`) : []
      const hashFromUrl = window.location.hash.substring(1)
      // открытие модалки автоматически, если в ссылке присутствует ее id
      const modalOpenFromHash = !!hashFromUrl && hashFromUrl === id
      const dynamicContent = popup.querySelector(`.${POPUP_DYNAMIC_CONTENT_CLASS}`)
      const preloader = popup.querySelector(`.${FILTER_FORM_PRELOADER_CLASS}`)

      const toggleAria = (open = false) => {
        if (open) {
          popup.setAttribute(ARIA_HIDDEN, 'false')
        } else {
          popup.setAttribute(ARIA_HIDDEN, 'true')
        }
      }
      const fetchData = (openBtn) => {
        if (openBtn && dynamicContent) {
          const url = openBtn.getAttribute(DATA_URL)

          if (url) {
            dynamicContent.innerHTML = ''

            if (preloader) {
              preloader.classList.add(SHOW_CLASS_NAME)
            }

            window.app.http
              .get(url)
              .then((res) => {
                const html = res?.object?.html

                if (res?.object?.html) {
                  dynamicContent.innerHTML = html
                }

                if (preloader) {
                  preloader.classList.remove(SHOW_CLASS_NAME)
                }
              })
              .catch((e) => {
                if (e?.code !== 'ERR_CANCELED') {
                  if (preloader) {
                    preloader.classList.remove(SHOW_CLASS_NAME)
                  }
                }
              })
          }
        }
      }
      const toggleOpen = (open = false, openBtn) => {
        toggleAria(open)

        if (open) {
          fetchData(openBtn)

          popup.classList.add(OPEN_CLASS_NAME)
          setTimeout(() => {
            window.app.addOverflowHiddenBody()
          }, 0)
          if (removeFocusInModal) {
            removeFocusInModal(true)
          }
          removeFocusInModal = window.app.setFocusInModal({ modal: popup, openBtn })
          popup.dispatchEvent(new CustomEvent(CUSTOM_EVENT_OPEN))

          if (openBtn) {
            popupInPopup = openBtn.closest(`.${POPUP_CLASS}`)
          } else {
            popupInPopup = false
          }
        } else {
          if (!popupInPopup && !window.app.body.classList.contains(BODY_MENU_OPENED_CLASS_NAME)) {
            window.app.removeOverflowHiddenBody()
          } else {
            popupInPopup = false
          }

          if (removeFocusInModal) {
            removeFocusInModal()
            removeFocusInModal = null
          }

          if (popup.classList.contains(OPEN_CLASS_NAME)) {
            popup.classList.remove(OPEN_CLASS_NAME)
            popup.dispatchEvent(new CustomEvent(CUSTOM_EVENT_CLOSE))
          }

          if (modalOpenFromHash) {
            history.replaceState(null, null, ' ')
          }
        }
      }

      if (!isInit) {
        closeBtns.forEach((btn) => {
          btn.addEventListener('click', () => {
            toggleOpen(false)
          })
        })
      }

      openBtns.forEach((btn) => {
        const isInit = btn.hasAttribute(DATA_INIT)

        if (!isInit) {
          btn.addEventListener('click', () => {
            toggleOpen(true, btn)
          })
          btn.setAttribute(DATA_INIT, '')
        }
      })

      if (modalOpenFromHash) {
        const openBtn = [...openBtns].find((btn) => !window.app.elementIsHidden(btn)) || openBtns[0]

        toggleOpen(true, openBtn)
      }

      if (!isInit) {
        // событие для открытия модалки программно
        popup.addEventListener(CUSTOM_EVENT_HANDLE_OPEN, (e) => {
          toggleOpen(true, e?.detail?.openBtn)
        })

        // событие для закрытия модалки программно
        popup.addEventListener(CUSTOM_EVENT_HANDLE_CLOSE, () => {
          toggleOpen(false)
        })

        // событие ручной установки фокуса внутрь модалки, если она была открыта программно
        popup.addEventListener(CUSTOM_EVENT_SET_FOCUS_IN_MODAL, (e) => {
          let openBtn

          if (removeFocusInModal) {
            openBtn = removeFocusInModal(true)
          }

          if (e?.detail?.openBtn) {
            openBtn = e?.detail?.openBtn
          }

          removeFocusInModal = window.app.setFocusInModal({
            modal: popup,
            openBtn,
            setEventOnly: !!e?.detail?.setEventOnly,
          })
        })

        window.addEventListener(CUSTOM_EVENT_ESCAPE_KEYDOWN, () => toggleOpen(false))
        popup.setAttribute(DATA_INIT, '')
      }
    }
  }
}
