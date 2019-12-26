<template>
  <div id="app">
    <Loader v-if="loading"/>
    <div v-if="this.djson != null">
      <header>
        <!-- <h1 class="brand">Test</h1> -->
        <button @click="handleHamburger">Ver</button>
        <nav class="main-navigation">
          <ul class="menu">
            <li class="menu-item"><router-link to="/">{{this.djson.home.title}}</router-link> </li>
            <li class="menu-item"><router-link to="/resume">{{this.djson.resume.title}}</router-link></li>
            <li class="menu-item"><router-link to="/story">{{this.djson.story.title}}</router-link>   </li>
            <li class="menu-item"><router-link to="/portfolio">{{this.djson.portfolio.title}}</router-link></li>
          </ul>
        </nav>
      </header>
      <main>
      <router-view      
        :djson="djson"
      />
      </main>
    </div>
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
    },
    handleHamburger(){
      console.log(this.$refs.myDiv)
      
    }
  }
  
}
</script>

<style lang="scss">

</style>
