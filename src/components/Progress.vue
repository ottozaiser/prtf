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
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: "Progress",
  setup(props, { emit }) {
    const width = ref(0);

    const handleScroll = () => {
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      width.value = (window.scrollY / height) * 100;
      const eventWidth = Math.ceil(width.value);
      if (eventWidth === 0) {
        emit("begin");
      }
      if (eventWidth === 100) {
        emit("complete");
      }
    };

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
      window.dispatchEvent(new Event("scroll"));
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    return {
      width
    };
  }
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.container {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  background-color: var(--main-bg-trans);
  z-index: 2;
  @include transition(background-color);
}

.bar {
  background-color: var(--main-charcoal);
  height: 8px;
  @include transition(width);
}
</style>
