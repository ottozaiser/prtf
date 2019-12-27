<template>
  <div id="app">
    <Loader v-if="loading"/>
    <div v-if="this.djson != null">
      <header>
        <!-- <h1 class="brand">Test</h1> -->
      <button aria-label="Open Navigation" id="open-dialog" @click="$refs.navComponent.toggleMenu()">Menu</button>        
      </header>
      <MainNav ref="navComponent" :djson="djson"/>
      <main>
        <router-view :djson="djson"/>
      </main>
    </div>
  </div>
</template>


<script>
import Loader from '@/components/Loader.vue'
import MainNav from '@/components/MainNav.vue'
import axios from 'axios'

export default {
  name: 'app',
  components: {
    Loader,
    MainNav
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

<style lang="scss"></style>
