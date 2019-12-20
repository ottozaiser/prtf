w<template>
  <div class="home">
    <h1>{{ this.djson.home.title }}</h1>
    <p>{{ this.djson.home.content }}</p>
    <div class="portfolio">
        <!-- data-aos="fade-up" -->
      <Project 
        v-for="post in this.djson.proyectos"
        v-bind:key="post.id"
        v-bind:title="post.title"
        v-bind:content="post.content"
        v-bind:location="post.location"
        v-bind:cover="post.cover"
      />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Project from '@/components/Project.vue'

export default {
  name: 'home',
  props: ['djson'],
  components: {
    Project
  },
  created: function () {
    //console.log(this.djson)
  }
}
</script>
