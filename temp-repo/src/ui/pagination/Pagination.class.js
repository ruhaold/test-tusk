import { paginationItem } from './html'
import {
  CUSTOM_EVENT_ALT_ZOOM_CHANGE,
  CUSTOM_EVENT_OPTIMIZED_RESIZE,
  DATA_NOT_CREATE_PAGES,
  DATA_PAGE,
  DATA_PAGES,
  HIDDEN_CLASS_NAME,
  PAGINATION_COMMON_CLASS,
  PAGINATION_COMMON_ITEM_CLASS,
  PAGINATION_COMMON_SHOW_MORE_CLASS,
  PAGINATION_COMMON_WRAP_CLASS,
} from '../../js/constants'

export default class PaginationClass {
  constructor(config) {
    this.callback = () => {}

    this.document = document

    if (typeof config === 'object') {
      Object.keys(config).forEach((key) => {
        this[key] = config[key]
      })
    }
    this.pagination = null
    this.showMoreBtn = null
    this.totalPages = 1
    this.page = 1
    this.notCreatePages = false

    this.init()
  }

  init() {
    this.pagination = this.document.querySelector(`.${PAGINATION_COMMON_CLASS}`)
    this.paginationWrap = this.document.querySelector(`.${PAGINATION_COMMON_WRAP_CLASS}`)
    this.showMoreBtn = this.document.querySelector(`.${PAGINATION_COMMON_SHOW_MORE_CLASS}`)

    if (!this.pagination) return

    const initPages = Number(this.pagination.getAttribute(DATA_PAGES))
    const initPage = Number(this.pagination.getAttribute(DATA_PAGE))

    this.notCreatePages = this.pagination.hasAttribute(DATA_NOT_CREATE_PAGES)

    this.setPagination(initPages, initPage)

    window.addEventListener(CUSTOM_EVENT_OPTIMIZED_RESIZE, (e) => {
      this.setPagination(this.totalPages, this.page)
    })

    window.addEventListener(CUSTOM_EVENT_ALT_ZOOM_CHANGE, () => {
      this.setPagination(this.totalPages, this.page)
    })

    if (this.showMoreBtn) {
      this.toggleShowMore()

      this.showMoreBtn.addEventListener('click', () => {
        if (this.page < this.totalPages) {
          this.page++
          this.setPagination(this.totalPages, this.page)
          this.callback({
            page: this.page,
            isShowMore: true,
          })
        }
      })
    }
  }

  setEvents() {
    if (!this.pagination) return

    const items = this.pagination.querySelectorAll(`.${PAGINATION_COMMON_ITEM_CLASS}`)

    items.forEach((item) => {
      item.addEventListener(
        'click',
        () => {
          const pages = Number(item.getAttribute(DATA_PAGES))
          const page = Number(item.getAttribute(DATA_PAGE))

          this.setPagination(pages, page)
          this.callback({ page })
        },
        { once: true },
      )
    })
  }

  setPagination(pages, page) {
    if (pages && page && this.pagination) {
      const result = this.createPagination(pages, page)
      this.totalPages = pages
      this.page = page
      this.pagination.setAttribute(DATA_PAGES, pages)
      this.pagination.setAttribute(DATA_PAGE, page)
      this.pagination.innerHTML = result
      this.pagination.classList.toggle(HIDDEN_CLASS_NAME, !result)
      this.setEvents()
      this.toggleShowMore()

      if (this.paginationWrap) {
        this.paginationWrap.classList.toggle(HIDDEN_CLASS_NAME, !result)
      }
    } else if (this.pagination) {
      this.totalPages = 1
      this.page = 1
      this.pagination.classList.add(HIDDEN_CLASS_NAME)
      this.toggleShowMore()

      if (this.paginationWrap) {
        this.paginationWrap.classList.add(HIDDEN_CLASS_NAME)
      }
    }
  }

  toggleShowMore() {
    if (this.showMoreBtn) {
      this.showMoreBtn.classList.toggle(HIDDEN_CLASS_NAME, this.totalPages === this.page || this.totalPages <= 1)
    }
  }

  createPagination(totalPages, page) {
    if (totalPages <= 1 || this.notCreatePages) return ''

    let str = ''
    let PADDING = 1
    const GAP = 2

    for (let pageIndex = 1; pageIndex <= totalPages; pageIndex++) {
      // Always display current, first, and last pages
      if (pageIndex === page || pageIndex < GAP || pageIndex > totalPages - GAP + 1) {
        str += paginationItem(totalPages, pageIndex, pageIndex === page, false)
        continue
      }
      let minimum
      let maximum
      if (page <= GAP + PADDING) {
        minimum = GAP
        maximum = minimum + PADDING * 2
      } else if (page >= totalPages - GAP - PADDING + 1) {
        maximum = totalPages - GAP + 1
        minimum = maximum - PADDING * 2
      } else {
        minimum = page - PADDING
        maximum = page + PADDING
      }
      // Display padded window of pages
      if ((pageIndex >= minimum && pageIndex <= page) || (pageIndex >= page && pageIndex <= maximum)) {
        str += paginationItem(totalPages, pageIndex, pageIndex === page, false)
        continue
      }
      // Handle start gap
      if (pageIndex === GAP) {
        const condition = window.app.isMobile
          ? minimum > GAP && page > GAP + PADDING
          : minimum > GAP + 1 && page > GAP + PADDING + 1

        if (condition) {
          str += paginationItem(totalPages, pageIndex, false, true)
        } else {
          str += paginationItem(totalPages, pageIndex, pageIndex === page, false)
        }
        continue
      }
      // Handle end gap
      if (pageIndex === totalPages - GAP + 1) {
        const condition = window.app.isMobile
          ? maximum < totalPages - GAP + 1 && page < totalPages - GAP - PADDING + 1
          : maximum < totalPages - GAP && page < totalPages - GAP - PADDING

        if (condition) {
          str += paginationItem(totalPages, pageIndex, false, true)
        } else {
          str += paginationItem(totalPages, pageIndex, pageIndex === page, false)
        }
        continue
      }
    }

    return str
  }

  disablePagination() {
    if (this.pagination) {
      const items = this.pagination.querySelectorAll(`.${PAGINATION_COMMON_ITEM_CLASS}`)

      items.forEach((el) => {
        el.setAttribute('disabled', '')
      })
    }

    if (this.showMoreBtn) {
      this.showMoreBtn.setAttribute('disabled', '')
    }
  }

  enablePagination() {
    if (this.pagination) {
      const items = this.pagination.querySelectorAll(`.${PAGINATION_COMMON_ITEM_CLASS}`)

      items.forEach((el) => {
        el.removeAttribute('disabled')
      })
    }

    if (this.showMoreBtn) {
      this.showMoreBtn.removeAttribute('disabled')
    }
  }
}
