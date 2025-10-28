<template>
  <img :src="normalized" :alt="alt" v-bind="$attrs" />
</template>

<script>
export default {
  name: 'ProgressiveImg',
  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: ''
    }
  },
  computed: {
    normalized() {
      const s = this.src || '';
      if (!s) return s;
      if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('//')) return s;
      // strip any leading / and prefix BASE_URL
      const base = (import.meta.env && import.meta.env.BASE_URL) || '/';
      if (s.startsWith('/')) return base + s.slice(1);
      return base + s;
    }
  }
}
</script>
