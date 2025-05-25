import { createApp } from 'vue'
import App from '../vue/App.vue'

export default class VueClass {
  constructor(containers) {
    containers.forEach(async (cnt) => {
      try {
        const cntId = cnt.getAttribute('id')
        const lexiconKey = cnt.getAttribute('data-lexicon')
        const app = createApp(App, {
          page: cntId,
          lexiconKey: lexiconKey,
        })

        app.mount(cnt)
      } catch (e) {
        console.error(e)
      }
    })
  }
}
