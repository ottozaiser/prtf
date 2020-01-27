<template>
  <div class="home">
    <div class="layout">
      <progressive-img class="image" :src="this.djson.home.url" alt="" />
      <div class="content">
        <h1 v-html="this.djson.home.subtitle"></h1>
        <p v-html="this.djson.home.content"></p>
        <ul class="menu">
          <li class="menu-item">
            <router-link to="/resume">{{
              this.djson.resume.title
            }}</router-link>
          </li>
          <li class="menu-item">
            <router-link to="/story">{{ this.djson.story.title }}</router-link>
          </li>
          <li class="menu-item">
            <router-link to="/portfolio">{{
              this.djson.portfolio.title
            }}</router-link>
          </li>
        </ul>
      </div>
    </div>
    <Social class="social" :djson="djson" />
  </div>
</template>

<script>
import Social from "@/components/Social.vue";

export default {
  name: "home",
  components: {
    Social
  },
  props: ["djson"]
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
  min-height: 100vh;
  overflow: hidden;
  padding: 0 24px;
  @media (max-width: 640px) {
    padding: 24px;
  }
}
.layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  z-index: 2;
  @media (max-width: 640px) {
    display: block;
    text-align: center;
    flex-direction: row;
    min-height: auto;
  }
}
.content {
  max-width: 256px;

  @media (max-width: 640px) {
    margin: 0 auto;
    h1 {
      display: inline-block;
      &:after {
        left: 0px;
      }
    }
  }
  @media (max-width: 300px) {
    h1:after {
      content: none;
    }
  }
}
ul.menu {
  padding: 0;
  li {
    display: block;
    margin: 8px 0;
    padding: 8px;
    a {
      color: black;
    }
  }
  @media (max-width: 640px) {
    text-align: center;
  }
}
.image {
  width: 256px;
  max-width: 256px;
  max-height: 256px;
  @media (max-width: 300px) {
    width: 100%;
  }
}

.social {
  position: fixed;
  bottom: 0;
  z-index: 2;

  @media (max-width: 640px) {
    position: relative;
  }
}
</style>
