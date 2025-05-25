import {
  ACTIVE_CLASS_NAME,
  ARIA_CONTROLS,
  ARIA_EXPANDED,
  COMMON_COLLAPSE_ITEM_TOGGLE_BTN_CLASS,
  COMMON_TABS_BTN_CLASS,
  COMMON_TABS_CLASS,
  COMMON_TABS_CONTENT_CLASS,
  DATA_ACTIVE_TAB,
  DATA_ARIA_CONTROLS,
  DATA_INIT_FROM_QUERY,
  DATA_PARENT_ID,
  DATA_SCROLL_INTO_VIEW,
  DATA_SCROLL_INTO_VIEW_BLOCK,
  DATA_SCROLL_INTO_VIEW_INLINE,
  OPEN_CLASS_NAME,
} from '@/js/constants.js'

export class TabsClass {
  constructor() {
    this.init()
  }

  init() {
    const items = document.querySelectorAll(`.${COMMON_TABS_CLASS}`)

    items.forEach((item) => {
      const id = item.id // используется для организации вложенных друг в друга табов (в связке с data-parent-id на дочерних)
      const buttonsSelector = id ? `.${COMMON_TABS_BTN_CLASS}[${DATA_PARENT_ID}=${id}]` : `.${COMMON_TABS_BTN_CLASS}`
      const tabsSelector = id
        ? `.${COMMON_TABS_CONTENT_CLASS}[${DATA_PARENT_ID}=${id}]`
        : `.${COMMON_TABS_CONTENT_CLASS}`
      const buttons = item.querySelectorAll(buttonsSelector)
      const tabs = item.querySelectorAll(tabsSelector)
      const initFormQuery = item.hasAttribute(DATA_INIT_FROM_QUERY) // если нужно сохранять открытый таб при перезагрузке страницы

      const hideAll = () => {
        tabs.forEach((tab) => {
          tab.classList.remove(OPEN_CLASS_NAME)
        })
        buttons.forEach((btn) => {
          if (!btn.classList.contains(COMMON_COLLAPSE_ITEM_TOGGLE_BTN_CLASS)) {
            btn.classList.remove(ACTIVE_CLASS_NAME)
            btn.setAttribute(ARIA_EXPANDED, 'false')
          }
        })
      }
      const open = (ids) => {
        if (ids) {
          if (initFormQuery) {
            const browserUrl = new URL(location.href)
            const searchParams = browserUrl.searchParams

            searchParams.delete(DATA_ACTIVE_TAB)
            searchParams.append(DATA_ACTIVE_TAB, ids)
            history.replaceState(null, '', browserUrl)
          }

          ids = ids.split(' ')
          const arrTabs = [...tabs].filter((el) => ids.some((id) => el.id === id))
          const arrButtons = [...buttons].filter((el) => {
            if (!el.classList.contains(COMMON_COLLAPSE_ITEM_TOGGLE_BTN_CLASS)) {
              const idArr = (el.getAttribute(ARIA_CONTROLS) || el.getAttribute(DATA_ARIA_CONTROLS) || '').split(' ')
              return ids.some((id) => idArr.some((str) => str === id))
            } else return false
          })

          if (arrTabs.length) {
            hideAll()
            arrTabs.forEach((el) => {
              el.classList.add(OPEN_CLASS_NAME)
            })
            arrButtons.forEach((el) => {
              const scrollIntoView = el.hasAttribute(DATA_SCROLL_INTO_VIEW)
              const scrollIntoViewBlock = el.getAttribute(DATA_SCROLL_INTO_VIEW_BLOCK)
              const scrollIntoViewInline = el.getAttribute(DATA_SCROLL_INTO_VIEW_INLINE)

              el.classList.add(ACTIVE_CLASS_NAME)
              el.setAttribute(ARIA_EXPANDED, 'true')

              if (scrollIntoView) {
                el.scrollIntoView({
                  block: scrollIntoViewBlock || 'nearest',
                  inline: scrollIntoViewInline || 'nearest',
                  behavior: 'smooth',
                })
              }
            })
          }
        }
      }
      const initOpen = () => {
        const browserUrl = new URL(location.href)
        const searchParams = browserUrl.searchParams
        const ids = searchParams.get(DATA_ACTIVE_TAB)

        open(ids)
      }

      buttons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
          const ids = btn.getAttribute(ARIA_CONTROLS) || btn.getAttribute(DATA_ARIA_CONTROLS)

          open(ids)
        })
      })

      initOpen(initOpen)
    })
  }
}
