<template>
  <div class="home" v-if="this.homejson && this.animationData">
    <div class="layout">
      <div class="heading-home">
        <h1 v-html="this.homejson.subtitle"></h1>
      </div>
      <!-- <div class="img" :style="{ backgroundImage: 'url(' + this.homejson.image + ')'}"></div> -->
      <Lottie :options="defaultOptions" v-on:animCreated="handleAnimation" class="animation" />
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
import Lottie from "@/components/Lottie.vue";

export default {
  name: "home",
  components: {
    Social,
    Lottie,
  },
  data: function () {
    return {
      homejson: null,
      animationData: null,
      defaultOptions: { animationData: this.animationData },
      animationSpeed: 1,
    };
  },
  created: function () {
    const base = (import.meta.env && import.meta.env.BASE_URL) || '/';

    axios
      .get(base + "_data/home.json")
      .then((response) => {
        this.homejson = response.data;
      })
      .catch((error) => {
        // fail gracefully
        console.warn('Could not load home.json', error);
      });

    axios
      .get(base + "home-animation-data.json")
      .then((response) => {
        // validate animation data
        const data = response.data;
        if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
          console.warn('Animation data is empty or invalid, using fallback animation');
          // minimal fallback animation (no-op)
          this.animationData = { v: '5.0.0', fr: 30, ip: 0, op: 1, w: 100, h: 100, layers: [] };
        } else {
          this.animationData = data;
        }
        this.defaultOptions = { animationData: this.animationData };
      })
      .catch((error) => {
        console.warn('Could not load animation data', error);
        this.animationData = { v: '5.0.0', fr: 30, ip: 0, op: 1, w: 100, h: 100, layers: [] };
        this.defaultOptions = { animationData: this.animationData };
      });
  },
  methods: {
    handleAnimation: function (anim) {
      this.anim = anim;
    },

    stop: function () {
      this.anim.stop();
    },

    play: function () {
      this.anim.play();
    },

    pause: function () {
      this.anim.pause();
    },

    onSpeedChange: function () {
      this.anim.setSpeed(this.animationSpeed);
    },
  },
};
</script>

<style lang="scss" scoped>
@use 'sass:math';
@use '@/styles/variables' as *;

.home {
  display: grid;
  position: relative;
  height: 92vh;
  padding: 0 24px;
  max-width: 992px;
  padding-bottom: 24px;
  margin: 0 auto;
  //overflow: hidden;
}
.img {
  background-size: 300px;
  background-position: -150px 0;
  background-repeat: no-repeat;
  opacity: 0.5;
}
.layout {
  display: grid;
  // grid-template-columns: 2fr 3fr;
  // grid-template-rows: 50%;
  z-index: 2;
  // @media (max-width: 780px) {
  // 	grid-template-columns: 1fr 1fr;
  // }
  @media (max-width: 700px) {
    // height: auto;
    // margin-top: 24px;
    grid-template-rows: 30%;
    grid-template-columns: 1fr;
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
  @media (max-width: 700px) {
    justify-content: flex-start;
  }
}
.animation {
  min-height: 200px;
  max-width: 600px;
  align-self: end;
  opacity: 0.9;
  margin: inherit !important;
  margin-left: 10px !important;
  @media (max-width: 700px) {
    align-self: auto;
    grid-column-start: 1;
    grid-row-start: auto;
    padding-top: 24px !important;
  }
  @media (max-width: 400px) {
    margin-left: -30px !important;
  }
}
.content {
  padding-top: 16px;
  grid-column-start: 2;
  grid-row-start: 2;
  @media (max-width: 700px) {
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
    @media (max-width: 700px) {
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
