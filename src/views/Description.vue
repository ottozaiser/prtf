<template>
  <div class="description">
    <router-link to="/">BACK</router-link>
    <h1>{{ this.proyecto.title }}</h1>
    <img v-lazy="this.proyecto.cover" alt=""/>
    <p>{{ this.proyecto.content }}</p>
    <ul>
      <li v-bind:key="value.id" v-for="value in this.proyecto.imagenes">
        <img v-lazy="value.url" :alt="value.alt"/>
        {{ value.ep }}
      </li>
    </ul>
  </div>
</template>


<script>
export default {
  name: 'description',
  props: ['djson','id'],
  data: function() {
      return {
          proyecto: undefined,  
      };
  },
  created: function () {
    this.proyecto = this.filterIt(this.djson.proyectos,this.id)[0];
  },
  methods: {
     filterIt(arr, searchKey) {
      return arr.filter(obj => Object.keys(obj).some(key => obj[key].includes(searchKey)));
    }
  }
}
</script>
