import {
  BTN_UP_VISIBILITY_THRESHOLD_VALUE,
  BTN_UP_VISIBILITY_CLASS,
  BTN_UP_VISIBILITY_BODY_CLASS,
  BTN_UP_SELECTOR,
} from '../../js/constants'

export class BtnUpClass {
  constructor() {
    this.html = document.querySelector('html')
    this.btn = document.querySelector(BTN_UP_SELECTOR)

    if (this.btn) this.init()
  }

  init() {
    this.showBtnUp()
    this.pageScrollToTop()
  }

  pageScrollToTop() {
    this.btn.addEventListener('click', () => {
      this.html.scrollIntoView({ block: 'start', behavior: 'smooth' })
    })
  }

  showBtnUp() {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.pageYOffset
      const hasClass = this.btn.classList.contains(BTN_UP_VISIBILITY_CLASS)

      if (scrollPosition >= BTN_UP_VISIBILITY_THRESHOLD_VALUE) {
        if (hasClass) return

        this.btn.classList.add(BTN_UP_VISIBILITY_CLASS)
        window.app.body.classList.add(BTN_UP_VISIBILITY_BODY_CLASS)
      } else {
        if (!hasClass) return

        this.btn.classList.remove(BTN_UP_VISIBILITY_CLASS)
        window.app.body.classList.remove(BTN_UP_VISIBILITY_BODY_CLASS)
      }
    })
  }
}
