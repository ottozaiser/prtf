<template>
  <div class="about">
    <h1>{{ this.djson.about.title }}</h1>
    <p>{{ this.djson.about.content }}</p>
  </div>
</template>


<script>

export default {
  name: 'about',
  props: ['djson'],
  created: function () {
  }
}
</script>

