<template>
  <div class="story">
    <h1>{{ this.djson.story.title }}</h1>
    <p>{{ this.djson.story.content }}</p>
    <div v-bind:key="index" v-for="(item, index) in this.steps" style="margin-bottom: 200px;">
        <p>{{ item.title }}</p>
        {{ item.content }} 
        <br>
        <img v-lazy="item.url" :alt="item.alt"/>
    </div>
  </div>    
</template>


<script>

export default {
  name: 'story',
  props: ['djson'],
  data: function() {
      return {
          steps: undefined,  
      };
  },
  created: function () {
    this.steps = this.djson.story.steps;
  }
}
</script>

