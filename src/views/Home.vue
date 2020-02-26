<template>
  <div class="home wrapper" v-if="this.homejson">
    <div class="layout">
      <div class="content">
        <progressive-img class="image" :src="this.homejson.image" alt />
        <h1 v-html="this.homejson.subtitle"></h1>
        <p v-html="this.homejson.content"></p>
        <ul class="menu">
          <li class="menu-item" v-bind:key="index" v-for="(item, index) in this.homejson.links">
            <router-link :to="item.url" v-if="item.url.startsWith('/')">{{ item.name }}</router-link>
            <a :href="item.url" target="_blank" v-else>{{ item.name }}</a>
          </li>
        </ul>
      </div>
    </div>
    <Social class="social" />
  </div>
</template>

<script>
import axios from "axios";
import Social from "@/components/Social.vue";

export default {
  name: "home",
  components: {
    Social
  },
  data: function() {
    return {
      homejson: null
    };
  },
  created: function() {
    axios
      .get("/_data/home.json")
      .then(response => {
        this.homejson = response.data;
      })
      .catch(error => {
        alert(error);
      });
  }
};
</script>

<style scoped lang="scss">
.home {
  display: flex;
  flex: 1;
  position: relative;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  padding: 0 24px;
  @media (max-width: 640px) {
    height: auto;
  }
}
.layout {
  height: 100vh;
  display: flex;
  align-items: center;
  width: 100%;
  z-index: 2;
  font-size: 1.5em;
  @media (max-width: 640px) {
    height: auto;
    margin-top: 24px;
  }
}

ul.menu {
  padding: 0;
  li {
    display: inline-block;
    margin: 8px 16px;
    &:first-child {
      margin-left: 0;
    }
    a {
      color: black;
    }
    @media (max-width: 640px) {
      display: block;
      margin: 0;
      margin-bottom: 24px;
    }
  }
}
.image {
  width: 150px;
  max-width: 150px;
  max-height: 150px;
}

.social {
  position: fixed;
  bottom: 0;
  z-index: 2;
  max-width: 992px;
  width: 100%;
  padding: 0 24px;
  @media (max-width: 640px) {
    position: relative;
    padding: 0;
  }
}
</style>
