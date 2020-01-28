<template>
  <div class="story" v-if="this.steps">
    <Progress />
    <section
      v-bind:key="index"
      v-for="(item, index) in this.steps"
      :id="'section' + index"
      v-bind:style="{ backgroundColor: item.color }"
    >
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
        </div>
        <div class="img-container" data-aos="fade-up" data-aos-delay="50">
          <progressive-img class="image" :src="item.image" :alt="item.alt" />
        </div>
      </div>

      <a
        v-tooltip="'Next ' + steps[index + 1].title"
        v-if="index < steps.length - 1"
        class="icon-btn bottom-btns animate"
        :href="'#section' + (index + 1)"
        v-on:click.stop.prevent="handleClick(index + 1)"
      >
        <font-awesome-icon aria-hidden="true" :icon="['fa', 'chevron-down']" />
        <span class="sr-only">Next {{ steps[index + 1].title }}</span>
      </a>
      <div class="bottom-btns" v-if="index == steps.length - 1">
        <router-link v-tooltip="'Home'" to="/" class="icon-btn">
          <font-awesome-icon aria-hidden="true" :icon="['fa', 'home']" />
          <span class="sr-only">Home</span>
        </router-link>
        <a
          v-tooltip="'Read story again'"
          :href="'#section0'"
          v-on:click.stop.prevent="handleClick(0)"
          class="icon-btn"
        >
          <font-awesome-icon aria-hidden="true" :icon="['fa', 'angle-double-up']" />
          <span class="sr-only">Read story again</span>
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
import ClickHandler from "@/mixins/ClickHandler.js";
import animateScrollTo from "animated-scroll-to";

export default {
  name: "story",
  mixins: [ClickHandler],
  components: {
    Progress
  },
  data: function() {
    return {
      steps: null
    };
  },
  created: function() {
    axios
      .get("/_data/story.json")
      .then(response => {
        this.steps = response.data.story;
        AOS.init();
      })
      .catch(error => {
        console.log(error);
      });
  },
  methods: {
    getBackground(url) {
      var imgUrl = url;
      var bgUrl = imgUrl.split("/");
      return bgUrl[0] + "/" + bgUrl[1] + "/" + bgUrl[2] + "/bg" + bgUrl[3];
    },
    handleClick: function(i) {
      // document.getElementById('section'+i).scrollIntoView({ behavior: 'smooth' });
      //document.getElementById('t'+i).focus();
      var d;
      i == 0 ? (d = 500) : (d = 300);
      animateScrollTo(document.querySelector("#section" + i), {
        maxDuration: d
      }).then((window.location.hash = "section" + i));
    }
  }
};
</script>

<style lang="scss" scoped>
.story {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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
  display: flex;
  align-items: center;
  justify-content: center;
  // background: yellow;
  border-bottom: 1px solid var(--main-charcoal-fulltrans);
  width: 100%;
  position: relative;
  z-index: 1;
  &:nth-child(odd) {
    .content {
      flex-direction: row-reverse;
      @media (max-width: 640px) {
        flex-direction: column-reverse;
      }
    }
  }
  &:last-child {
    border-bottom: 0;
  }
  .content {
    // background-color: rgba(255, 255, 255, 0.6);
    // box-shadow: 0 0 24px 24px rgba(255, 255, 255, 0.6);
    border-radius: 24px;
    max-width: 640px;
    display: flex;
    align-items: center;
    justify-content: center;

    .titles {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
    }
    h1 {
      font-size: 3.5em;
      margin-top: 0px;
      margin-bottom: 0px;
      &:after {
        left: 21px;
        width: 54px;
        height: 8px;
      }
    }

    h2 {
      margin: 0;
      font-size: 1.4em;
      padding-left: 16px;
    }

    .text-container {
      padding: 24px;
    }

    @media (max-width: 640px) {
      display: flex;
      text-align: center;
      flex-direction: column-reverse;

      .titles {
        justify-content: center;
      }

      h1:after {
        left: calc(50% - 18px);
      }
      h2 {
        text-align: left;
        font-size: 1.2em;
      }

      .text-container {
        padding-top: 12px;
      }
    }
  }

  @media (max-width: 320px) {
    font-size: 0.8em;
  }

  &:last-child {
    h1 {
      font-size: 3.5em;
    }
    h1:after {
      left: 5px;
      @media (max-width: 640px) {
        left: calc(50% - 16px);
        width: 32px;
      }
    }
  }

  .bottom-btns {
    position: absolute;
    text-align: center;
    bottom: 20px;
    a {
      display: inline-block;
    }
  }
  .icon-btn {
    &:hover,
    &:focus {
      background: var(--main-bg-trans);
    }
  }
  .animate {
    animation: fadein 1s infinite;
  }
  @keyframes fadein {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

  .image {
    width: 300px;
    height: 300px;
    @media (max-width: 400px) {
      width: 250px;
      height: 250px;
    }
    @media (max-width: 250px) {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
