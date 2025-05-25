<template>
  <div
    ref="container"
    class="error503"
  >
    <div class="error503__head">
      <p class="error503__title">Заголовок</p>
      <p class="error503__lead">текст</p>
    </div>
  </div>
</template>

<script>
import { LOADED_CLASS, VUE_CONTAINER_CLASS_NAME } from '../../constants'

export default {
  mounted() {
    const rootEl = this.$refs.container.closest(`.${VUE_CONTAINER_CLASS_NAME}`)

    if (rootEl) {
      rootEl.classList.add(LOADED_CLASS)
    }
  },
}
</script>
