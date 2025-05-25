<template>
  <div>
    <component :is="component" />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'

import VueLoader from './components/VueLoader.vue'
import VueError from './components/VueError.vue'

export default {
  components: {
    VueLoader,
    VueError,
  },
  props: {
    page: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    isError: false,
    isLoaded: false,
  }),
  computed: {
    component() {
      if (!this.isLoaded) {
        return VueLoader
      }
      return this.isError
        ? VueError
        : defineAsyncComponent({
            loader: () => import(`./pages/${this.page}.vue`),
            loadingComponent: VueLoader,
          })
    },
  },
  mounted() {
    this.isLoaded = true
  },
}
</script>
