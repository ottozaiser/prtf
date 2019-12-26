<template>
  <div class="home">
    <h1>{{ this.djson.home.title }}</h1>
    <p>{{ this.djson.home.content }}</p>
  </div>
</template>

<script>

export default {
  name: 'home',
  props: ['djson'],
  created: function () {
    //console.log(this.djson)
  }
}
</script>
