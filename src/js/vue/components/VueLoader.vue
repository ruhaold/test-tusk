<template>
  <div
    class="vue-loader"
    :class="[variant]"
    role="alert"
    aria-live="assertive"
  >
    <span class="screen-reader-only">загрузка</span>
  </div>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      default: '',
    },
  },
}
</script>
