<template>
  <div class="home">
    <Project 
      title="Welcome to Your Vue.js App"
      content="fasdfas fasd fasd fasd"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import Project from '@/components/Project.vue'

export default {
  name: 'home',
  components: {
    Project
  }
}
</script>
