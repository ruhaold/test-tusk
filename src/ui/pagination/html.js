import { DATA_PAGE, DATA_PAGES, PAGINATION_COMMON_ITEM_CLASS } from '../../js/constants'

export const paginationItem = (pages, page, isActive = false, more = false) => {
  const content = more ? '...' : page < 10 ? `0${page}` : page
  let classList = ''
  let attrs = ''
  let tag = 'button'

  if (isActive) {
    classList += ' _active'
    attrs += ' tabindex="-1" aria-current="page"'
    tag = 'div'
  } else if (!more) {
    attrs += ' type="button"'
  }

  if (pages && !more) {
    attrs += ` ${DATA_PAGES}="${pages}"`
  }

  if (page && !more) {
    attrs += ` ${DATA_PAGE}="${page}" aria-label="страница ${page}"`
  }

  if (!more) {
    classList += ` ${PAGINATION_COMMON_ITEM_CLASS}`
  } else {
    tag = 'div'
    classList += ' _ellipsis'
    attrs += ' aria-hidden="true"'
  }

  return `<li>
              <${tag}
                ${attrs}
                class="pagination-common-item ${classList}"
              >
                ${content}
              </${tag}>
            </li>`
}
