<template>
  <div :style="bgStyle" class="progressive-background-image" v-bind="$attrs"></div>
</template>

<script>
export default {
  name: 'ProgressiveBackground',
  props: {
    src: {
      type: String,
      required: true
    }
  },
  computed: {
    normalized() {
      const s = this.src || '';
      if (!s) return s;
      if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('//')) return s;
      const base = (import.meta.env && import.meta.env.BASE_URL) || '/';
      if (s.startsWith('/')) return base + s.slice(1);
      return base + s;
    },
    bgStyle() {
      return {
        backgroundImage: `url(${this.normalized})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
  }
}
</script>

<style scoped>
.progressive-background-image {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
