import VueClass from './components/Vue'
import { CUSTOM_EVENT_APP_INITIALIZED, VUE_CONTAINER_CLASS_NAME } from './constants'

let vueIsInit = false

class InitVueClass {
  constructor() {
    this.initVue()
  }

  initVue() {
    const containers = document.querySelectorAll(`.${VUE_CONTAINER_CLASS_NAME}`)
    if (containers.length) {
      vueIsInit = true
      new VueClass(containers)
    }
  }
}

if (document.readyState !== 'loading' && !vueIsInit && window.app?.isInitialized) {
  new InitVueClass()
}

window.addEventListener(CUSTOM_EVENT_APP_INITIALIZED, () => {
  if (!vueIsInit) {
    new InitVueClass()
  }
})
