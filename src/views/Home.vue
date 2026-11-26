<template>
  <div class="home-page" v-if="this.homejson && this.animationData">
    <div class="home">
      <div class="layout">
        <div class="heading-home">
          <h1 v-html="this.homejson.subtitle"></h1>
        </div>
        <!-- <div class="img" :style="{ backgroundImage: 'url(' + this.homejson.image + ')'}"></div> -->
        <Lottie :options="defaultOptions" v-on:animCreated="handleAnimation" class="animation" />
        <div class="content">
          <!-- <progressive-img class="image" :src="this.homejson.image" alt /> -->
          <p v-html="this.homejson.content"></p>
          <!-- Next steps for a recruiter: see the work, grab the CV, or write.
               The CV is a file, so it's a plain <a download>, never a router-link (that would hit the 404 route). -->
          <ul class="menu" v-if="this.homejson.links && this.homejson.links.length">
            <li class="menu-item" v-bind:key="index" v-for="(item, index) in this.homejson.links">
              <!-- Same options as the header's "Get in touch": copy email, email, LinkedIn, CV -->
              <ContactMenu
                v-if="item.contact && settings && settings.contact_email"
                variant="hero"
                :email="settings.contact_email"
                :linkedin="settings.linkedin_url"
                :cv="settings.cv_url"
              />
              <a v-else-if="item.download" class="btn" :class="{ primary: item.primary }" :href="item.url" download>{{ item.name }}</a>
              <router-link v-else-if="item.url && item.url.startsWith('/')" class="btn" :class="{ primary: item.primary }" :to="item.url">{{ item.name }}</router-link>
              <a v-else-if="item.url" class="btn" :class="{ primary: item.primary }" :href="item.url">{{ item.name }}</a>
            </li>
          </ul>
          <Social class="social" />
        </div>
      </div>
    </div>
    <!-- Work first: recruiters see the games before the resume. -->
    <section id="portfolio">
      <Portfolio />
    </section>
    <section id="resume">
      <Resume />
    </section>
  </div>
</template>

<script>
import axios from "axios";
import Social from "@/components/Social.vue";
import ContactMenu from "@/components/ContactMenu.vue";
import Lottie from "@/components/Lottie.vue";
import Resume from "@/views/Resume.vue";
import Portfolio from "@/views/Portfolio.vue";

export default {
  name: "home",
  components: {
    Social,
    ContactMenu,
    Lottie,
    Resume,
    Portfolio,
  },
  data: function () {
    return {
      homejson: null,
      settings: null,
      animationData: null,
      defaultOptions: { animationData: this.animationData },
      animationSpeed: 1,
    };
  },
  created: function () {
    const base = (import.meta.env && import.meta.env.BASE_URL) || '/';

    axios
      .get(base + "_data/settings.json")
      .then((response) => {
        this.settings = response.data;
      })
      .catch(() => {});

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

<style scoped>
.home {
  display: grid;
  position: relative;
  padding: 0 24px;
  max-width: 992px;
  margin: 0 auto;
}
@media (min-width: 992px) {
  .home {
    height: 100vh;
    height: 100dvh;
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
  grid-template-columns: 30% 70%;
  grid-template-rows: 70% 30%;
  z-index: 2;
}
@media (max-width: 992px) {
  .layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
}
.heading-home {
  grid-row: 1;
  grid-column: 1;
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
}
.heading-home h1 {
  display: flex;
  align-items: stretch;
  margin: 0;
}
@media (max-width: 992px) {
  .heading-home {
    justify-content: flex-start;
    height: 200px;
  }
}
.animation {
  grid-row: 1;
  grid-column: 2;
  min-height: 200px;
  max-width: 600px;
  align-self: end;
  opacity: 0.9;
  margin: inherit !important;
  margin-left: 10px !important;
}
@media (max-width: 992px) {
  .animation {
    align-self: auto;
    grid-column-start: 1;
    grid-row-start: 2;
    padding-top: 24px !important;
  }
}
@media (max-width: 400px) {
  .animation {
    margin-left: -30px !important;
  }
}
.content {
  padding-top: 16px;
  grid-column: 2;
  grid-row: 2;
  align-self: end;
  justify-self: start;
  width: 100%;
}
@media (max-width: 992px) {
  .content {
    grid-column-start: 1;
    grid-row: 3;
  }
}
ul.menu {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  list-style: none;
  padding: 0;
  margin: 20px 0 8px;
}
/* App.vue gives every ".content li" an 8px margin; the gap above handles spacing here */
ul.menu li,
.social :deep(li) {
  margin: 0;
}
ul.menu .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 10px 20px;
}
/* Main call to action: the site's yellow, like "Get in touch" in the header */
ul.menu .btn.primary {
  background: var(--main-highlight);
  border-color: var(--main-highlight);
  font-weight: 600;
}
ul.menu .btn.primary:hover,
ul.menu .btn.primary:focus-visible {
  color: var(--main-charcoal);
  box-shadow: 0 0 0 2px var(--main-charcoal);
}
/* Phones: one full-width button per row */
@media (max-width: 480px) {
  ul.menu li {
    flex: 1 1 100%;
  }
  ul.menu .btn {
    width: 100%;
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
/* Phones and tablets: the intro fills exactly one screen, like on desktop. The illustration takes
   whatever height is left after the title, text and buttons, so nothing falls below the fold.
   svh = the screen with the browser bars showing; very short screens get at least 620px. */
@media (max-width: 991px) {
  .home {
    display: flex;
    flex-direction: column;
    height: 100vh;
    height: 100svh;
    min-height: 620px;
    padding-bottom: 8px;
  }
  .layout {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
  .heading-home {
    flex: none;
    height: 100px;
  }
  .animation {
    flex: 1 1 0;
    min-height: 120px;
    width: 100%;
    max-width: 600px;
    padding-top: 16px !important;
    align-self: center;
  }
  .content {
    flex: none;
    padding-top: 8px;
  }
  .content p {
    margin: 8px 0 0;
  }
  ul.menu {
    margin: 16px 0 4px;
    gap: 8px;
  }
  /* Social icons spread evenly across the width, centered under the buttons */
  .social :deep(ul.socialmedia) {
    margin: 8px 0 0;
    justify-content: space-evenly;
    /* the floating menu button sits at the right end of this row */
    padding-right: 56px;
  }
}
/* Phones: the main button on its own row, the other two side by side */
@media (max-width: 480px) {
  ul.menu li {
    flex: 1 1 calc(50% - 4px);
  }
  ul.menu li:first-child {
    flex-basis: 100%;
  }
}
section {
  border-top: 5px solid var(--main-highlight);
  margin-top: 48px;
}
section:last-of-type {
  margin-bottom: 48px;
}
</style>
