<template>
  <div id="app">
    <Loader v-if="loading"/>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>


<script>
import Loader from '@/components/Loader.vue'
import axios from 'axios'

export default {
  components: {
    Loader
  },
  data: function() {
      return {
          loading: true,   
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
        console.log(response.data);  
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

</style>
