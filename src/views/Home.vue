<template>
  <div class="home" v-if="this.homejson">
    <div class="layout">
      <div class="heading-home">
        <h1 v-html="this.homejson.subtitle"></h1>
      </div>
      <!-- <div class="img" :style="{ backgroundImage: 'url(' + this.homejson.image + ')'}"></div> -->
      <div class="content">
        <!-- <progressive-img class="image" :src="this.homejson.image" alt /> -->
        <p v-html="this.homejson.content"></p>
        <ul class="menu">
          <li class="menu-item" v-bind:key="index" v-for="(item, index) in this.homejson.links">
            <router-link class="btn" :to="item.url" v-if="item.url.startsWith('/')">{{ item.name }}</router-link>
            <a class="btn" :href="item.url" target="_blank" v-else>{{ item.name }}</a>
          </li>
        </ul>
        <Social class="social" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Social from "@/components/Social.vue";

export default {
  name: "home",
  components: {
    Social,
  },
  data: function () {
    return {
      homejson: null,
    };
  },
  created: function () {
    axios
      .get("/_data/home.json")
      .then((response) => {
        this.homejson = response.data;
      })
      .catch((error) => {
        alert(error);
      });
  },
};
</script>

<style lang="scss" scoped>
.home {
  display: grid;
  position: relative;
  height: 99vh;
  padding: 0 24px;
  max-width: 992px;
  margin: 0 auto;
  //overflow: hidden;
  @media (max-width: 640px) {
    height: auto;
  }
}
.img {
  background-size: 300px;
  background-position: -150px 0;
  background-repeat: no-repeat;
  opacity: 0.5;
}
.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  z-index: 2;
  @media (max-width: 640px) {
    // height: auto;
    // margin-top: 24px;
    grid-template-columns: 1fr;
    grid-template-rows: 2fr 3fr;
  }
}
.heading-home {
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  h1 {
    display: flex;
    align-items: stretch;
    margin: 0;
  }
  @media (max-width: 640px) {
    justify-content: flex-start;
    // height: 200px;
  }
}

.content {
  grid-column-start: 2;
  grid-row-start: 2;
  @media (max-width: 640px) {
    grid-column-start: 1;
    grid-row-start: auto;
  }
}

ul.menu {
  padding: 0;
  margin-top: 36px;
  margin-bottom: 36px;
  li {
    display: inline-block;
    &:first-child {
      margin-left: 0;
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
  align-self: end;
}
</style>
