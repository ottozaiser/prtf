<template>
  <div class="portfolio">
    <h1>{{ this.djson.portfolio.title }}</h1>
    <p>{{ this.djson.portfolio.content }}</p>
    <div>
        <!-- data-aos="fade-up" -->
      <Project 
        v-for="post in this.djson.portfolio.proyectos"
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
  name: 'porfolio',
  props: ['djson'],
  components: {
    Project
  },
  created: function () {
    //console.log(this.djson)
  }
}
</script>
