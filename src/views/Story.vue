<template>
  <div class="story" v-if="this.steps">
    <Progress />
    <section v-bind:key="index" v-for="(item, index) in this.steps" :id="'section' + index">
      <!-- v-bind:style="{ backgroundColor: item.color }" -->
      <!-- <a v-show="index > 0" class="backButton" :href="'#'+(index-1)">Back</a> -->
      <div class="content">
        <div class="text-container" data-aos="fade" data-aos-delay="100">
          <div class="titles">
            <h1>{{ item.title }}</h1>
            <h2>
              <a :href="item.song" target="_blank">{{ item.subtitle }}</a>
            </h2>
          </div>
          <p v-html="item.content"></p>
          <!-- Last step: the same social links as the home page (on phones and tablets they're in the menu) -->
          <Social v-if="index == steps.length - 1" class="story-social" />
        </div>
        <div class="img-container" data-aos="fade-up" data-aos-delay="50">
          <progressive-img class="image" :src="item.image" :alt="item.alt" />
        </div>
      </div>

      <a
        :title="'Next ' + steps[index + 1].title"
        v-if="index < steps.length - 1"
        class="icon-btn bottom-btns animate"
        :href="'#section' + (index + 1)"
        v-on:click.stop.prevent="handleClick(index + 1)"
      >
        <font-awesome-icon aria-hidden="true" :icon="['fa', 'chevron-down']" />
        <span class="sr-only">Next {{ steps[index + 1].title }}</span>
      </a>
      <div class="bottom-btns" v-if="index == steps.length - 1">
        <!-- <router-link v-tooltip="'Home'" to="/" class="icon-btn">
          <font-awesome-icon aria-hidden="true" :icon="['fa', 'home']" />
          <span class="sr-only">Home</span>
        </router-link>-->
        <a
          :title="'Read the story again'"
          :href="'#section0'"
          v-on:click.stop.prevent="handleClick(0)"
          class="icon-btn"
        >
          <font-awesome-icon aria-hidden="true" :icon="['fa', 'angle-double-up']" />
          <span class="sr-only">Read the story again</span>
        </a>
      </div>

      <!-- <div class="cover" v-bind:style="{ backgroundImage: 'url(' + getBackground(item.url) + ')' }"></div> -->
    </section>
  </div>
</template>

<script>
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import Progress from "@/components/Progress.vue";
import Social from "@/components/Social.vue";
import ClickHandler from "@/mixins/ClickHandler.js";
import animateScrollTo from "animated-scroll-to";

export default {
  name: "story",
  mixins: [ClickHandler],
  components: {
    Progress,
    Social,
  },
  data: function () {
    return {
      steps: null,
    };
  },
  // Scroll and swipe snap from one chapter to the next (only on this page)
  mounted() {
    document.documentElement.classList.add("story-snap");
  },
  beforeUnmount() {
    document.documentElement.classList.remove("story-snap");
  },
  created: function () {
    axios
      .get("/_data/story.json")
      .then((response) => {
        this.steps = response.data.story;
        AOS.init();
      })
      .catch((error) => {
        alert(error);
      });
  },
  methods: {
    getBackground(url) {
      var imgUrl = url;
      var bgUrl = imgUrl.split("/");
      return bgUrl[0] + "/" + bgUrl[1] + "/" + bgUrl[2] + "/bg" + bgUrl[3];
    },
    handleClick: function (i) {
      // document.getElementById('section'+i).scrollIntoView({ behavior: 'smooth' });
      //document.getElementById('t'+i).focus();
      var d;
      i == 0 ? (d = 500) : (d = 300);
      animateScrollTo(document.querySelector("#section" + i), {
        maxDuration: d,
      }).then((window.location.hash = "section" + i));
    },
  },
};
</script>

<style>
html.story-snap {
  scroll-snap-type: y mandatory;
}
@media (prefers-reduced-motion: reduce) {
  html.story-snap {
    scroll-snap-type: y proximity;
  }
}
</style>

<style scoped>
/* Highlights are nowrap site-wide; in the story text, let long ones (e.g. "Accessibility and User Experience") wrap instead of jumping to a new line. */
.story :deep(.highlight) {
  white-space: normal;
}
.story {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
}
.cover {
  position: absolute;
  background-size: cover;
  background-position: center center;
  top: 0;
  left: 0;
  min-height: 100vh;
  width: 100%;
  opacity: 0.2;
  z-index: -1;
}
section {
  min-height: 100vh;
  min-height: 100svh; /* exactly one screen, with the phone's browser bars showing */
  box-sizing: border-box;
  scroll-snap-align: start;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--main-charcoal-fulltrans);
  width: 100%;
  position: relative;
  z-index: 1;
}
section:nth-child(odd) .content {
  flex-direction: row-reverse;
}
@media (max-width: 640px) {
  section:nth-child(odd) .content {
    flex-direction: column-reverse;
  }
}
section:last-child {
  border-bottom: 0;
}
section .content {
  border-radius: 24px;
  max-width: 640px;
  display: flex;
  align-items: center;
  justify-content: center;
}
section .content .titles {
  display: flex;
  flex-direction: row;
  align-items: center;
}
section .content h1 {
  font-size: 3.5em;
  margin-top: 0px;
  margin-bottom: 0px;
}
section .content h2 {
  margin: 0;
  font-size: 1.4em;
  padding-left: 16px;
}
/* Song links: a taller tap target than the text line alone */
section .content h2 a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
}
.story-social :deep(ul.socialmedia) {
  margin: 16px 0 0;
}
@media (max-width: 991px) {
  .story-social {
    display: none;
  }
}
section .content .text-container {
  padding: 24px;
}
@media (max-width: 640px) {
  section .content {
    display: flex;
    flex-direction: column-reverse;
  }
  section .content .titles {
    justify-content: start;
  }
  section .content h1:after {
    left: calc(50% - 18px);
  }
  section .content h2 {
    text-align: left;
    font-size: 1.2em;
  }
  section .content .text-container {
    padding-top: 12px;
  }
}
@media (max-width: 320px) {
  section {
    font-size: 0.8em;
  }
}
section:last-child h1 {
  font-size: 3.5em;
}
section:last-child h1:after {
  left: 5px;
}
@media (max-width: 640px) {
  section:last-child h1:after {
    left: calc(50% - 16px);
    width: 32px;
  }
}
section .bottom-btns {
  position: absolute;
  text-align: center;
  bottom: 20px;
}
section .animate {
  animation: fadein 1s infinite;
}
@keyframes fadein {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
section .image {
  width: 300px;
  height: 300px;
}
@media (max-width: 400px) {
  section .image {
    width: 250px;
    height: 250px;
  }
}
@media (max-width: 250px) {
  section .image {
    width: 100%;
    height: 100%;
  }
}
/* Phones: the illustration takes all the height the text leaves, so it's as big as possible while
   the whole chapter still fits in one screen. Room at the bottom for the "next" arrow. */
@media (max-width: 640px) {
  section {
    height: 100vh;
    height: 100svh;
    padding: 16px 0 64px;
  }
  section .content,
  section:nth-child(odd) .content {
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  section .img-container {
    order: -1;
    flex: 1 1 auto;
    min-height: 140px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 24px;
    box-sizing: border-box;
    container-type: size; /* lets the image size itself to this box (cqw / cqh) */
  }
  section .text-container {
    flex: none;
    width: 100%;
    box-sizing: border-box;
  }
  /* The largest square that fits the free box: limited by width on tall phones, by height on short ones */
  section .image,
  section:last-child .image {
    width: min(100cqw, 100cqh);
    height: min(100cqw, 100cqh);
  }
}
</style>
