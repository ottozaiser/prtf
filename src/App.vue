<template>
  <div id="app">
    <Loader v-if="loading"/>
    <nav v-if="this.djson != null">
      <router-link to="/">{{this.djson.home.title}}</router-link> 
      <router-link to="/about">{{this.djson.about.title}}</router-link>
      <router-link to="/story">{{this.djson.story.title}}</router-link>
    </nav>
    <router-view
      v-if="this.djson != null"
      :djson="djson"
    />
  </div>
</template>


<script>
import Loader from '@/components/Loader.vue'
import axios from 'axios'


export default {
  name: 'app',
  components: {
    Loader
  },
  data: function() {
      return {
          loading: true,  
          djson: null,
      };
  },
  created: function () {
      this.loader(true);
      this.loadData('/ptrf.json');
  },
  methods: {
    loadData(json){   
      var self = this;   
      axios.get(json)
      .then(function (response) {
        // handle success
        self.djson = response.data;  
        self.loader(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
    },
    loader(show){
      this.loading = show;
    }
  }
  
}
</script>

<style lang="scss">
nav{
  position: fixed;
  z-index: 100;
}
</style>
