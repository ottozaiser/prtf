<template>
  <div class="project">
    <img v-lazy="cover" alt=""/>
    <h2>{{ title }}</h2>
    <p>{{ content }}</p>
    <router-link :to="location">Go</router-link> 
  </div>
</template>

<script>
export default {
  name: 'Project',
  props: {
    title: String,
    content: String,
    location: String,
    cover: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.project{
  border: 1px solid red;
  width: 30%;
  margin-right: 1%;
  float: left;
}
img{
  width: 100%;
}

</style>
