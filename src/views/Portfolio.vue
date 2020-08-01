<template>
  <div class="portfolio wrapper" v-if="this.portjson">
    <h1 v-html="this.highTitle(this.portjson.title)"></h1>
    <div v-html="this.portjson.content"></div>
    <div class="projects" data-aos="fade-up" data-aos-once="true">
      <Project
        class="project"
        v-for="post in this.portjson.projects"
        v-bind:key="post.id"
        v-bind:title="post.title"
        v-bind:content="post.content"
        v-bind:location="post.location"
        v-bind:file="post.file"
        v-bind:cover="post.image"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import Project from "@/components/Project.vue";

export default {
  name: "porfolio",
  components: {
    Project,
  },
  data: function () {
    return {
      portjson: null,
    };
  },
  created: function () {
    axios
      .get("/_data/portfolio.json")
      .then((response) => {
        this.portjson = response.data.portfolio;
        AOS.init();
      })
      .catch((error) => {
        alert(error);
      });
  },
  methods: {
    highTitle(t) {
      var st1 = t.slice(0, 4);
      var st2 = t.substring(4);
      var ret = "<span class='highlight'>" + st1 + "</span>" + st2;
      return ret;
    },
  },
};
</script>

<style lang="scss" scoped>
.projects {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  grid-column-gap: 16px;
  grid-row-gap: 16px;
  margin-top: 42px;
}

.portfolio {
  padding-bottom: 16px;
}
</style>
