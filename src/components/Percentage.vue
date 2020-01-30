<template>
  <div class="percentage">
    <div class="container">
      <div class="number">{{ number }}%</div>
      <div class="bar" :style="{
          width: `${number}%`
        }" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Percentage",
  props: {
    number: Number
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.percentage {
  display: inline-block;
  font-size: 0.65em;

  .container {
    border-radius: 4px;
    background-color: var(--main-lightgray);
    min-width: 30px;
    height: 12px;
    text-align: center;
    position: relative;
  }
  .number {
    position: absolute;
    z-index: 3;
    top: 0;
    width: 100%;
  }
  .bar {
    border-radius: 4px;
    position: absolute;
    background-color: var(--main-highlight);
    height: 12px;
    top: 0;
    z-index: 2;
  }
}
</style>
