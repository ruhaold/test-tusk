import { CUSTOM_EVENT_OPTIMIZED_SCROLL, DATA_GOAL_ID } from '../constants'

export class YMClass {
  constructor() {
    this.scrollPercentages = {
      scroll10: false,
      scroll25: false,
      scroll50: false,
      scroll75: false,
      scroll90: false,
    }

    if (window.app.isProd && window.app.loadYM && !window.app.isLighthouse) {
      this.init()
    }
  }

  init() {
    const items = document.querySelectorAll(`[${DATA_GOAL_ID}]`)

    window.app._reachGoal = (goal) => {
      if (window.ym && window.app.YMNumber && goal) {
        window.ym(window.app.YMNumber, 'reachGoal', goal)
      }
    }

    window.addEventListener(CUSTOM_EVENT_OPTIMIZED_SCROLL, () => {
      const height = Math.max(
        window.app.body.scrollHeight,
        window.app.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
      )
      const percentage = ((document.documentElement.scrollTop + window.innerHeight) / height) * 100

      if (percentage >= 90 && !this.scrollPercentages.scroll90) {
        this.scrollPercentages.scroll90 = true
        window.app._reachGoal('Scrolling-90Percent')
      } else if (percentage >= 75 && !this.scrollPercentages.scroll75) {
        this.scrollPercentages.scroll75 = true
        window.app._reachGoal('Scrolling-75Percent')
      } else if (percentage >= 50 && !this.scrollPercentages.scroll50) {
        this.scrollPercentages.scroll50 = true
        window.app._reachGoal('Scrolling-50Percent')
      } else if (percentage >= 25 && !this.scrollPercentages.scroll25) {
        this.scrollPercentages.scroll25 = true
        window.app._reachGoal('Scrolling-25Percent')
      } else if (percentage >= 10 && !this.scrollPercentages.scroll10) {
        this.scrollPercentages.scroll10 = true
        window.app._reachGoal('Scrolling-10Percent')
      }
    })

    items.forEach((item) => {
      const gid = item.dataset.goalId
      const gev = item.dataset.goalEvent || 'click'

      if (!gid) return

      item.addEventListener(gev, (e) => {
        const el = e?.target

        window.app._reachGoal(gid)

        if (el?.matches('a[href]')) {
          const isBlank = el.getAttribute('target') === '_blank'
          const href = el.getAttribute('href')

          if (href) {
            e.preventDefault()

            if (isBlank) {
              window.open(href, '_blank')
            } else {
              window.location.assign(href)
            }
          }
        }
      })
    })
  }
}
