<template>
  <div class="job">
    {{ company }}
    {{ title }}
    {{ started }} {{ finished }}
    {{ description }}
  </div>
</template>

<script>
export default {
  name: 'Job',
  props: {
    company: String,
    title: String,
    description: String,
    started: String,
    finished: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.job{
  border: 1px solid red;
  width: 30%;
  margin-right: 1%;
  float: left;
}
</style>
