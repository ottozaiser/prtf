<template>
  <div class="container">
    <div
      class="bar"
      :style="{
        width: `${width}%`
      }"
    />
  </div>
</template>

<script>
export default {
  name: "Progress",
  data() {
    return {
      width: 0
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    window.dispatchEvent(new Event("scroll"));
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      this.width = (window.scrollY / height) * 100;
      const eventWidth = Math.ceil(this.width);
      if (eventWidth === 0) {
        this.$emit("begin");
      }
      if (eventWidth === 100) {
        this.$emit("complete");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  background-color: var(--main-bg-trans);
  z-index: 2;
}
.bar {
  background-color: var(--main-charcoal);
  height: 8px;
}
</style>
