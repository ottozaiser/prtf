<template>
  <div id="app">
    <div class="alert" v-if="ie">
      <p>
        You are using an
        <b>outdated</b> browser. Please
        <a href="https://browsehappy.com/">upgrade your browser</a> to improve your experience and
        security.
      </p>
    </div>
    <Loader v-show="loading" />
    <div v-if="this.settings">
      <MainNav ref="navComponent" :settings="settings" />
      <main>
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/Loader.vue";
import MainNav from "@/components/MainNav.vue";
import axios from "axios";

export default {
  name: "app",
  components: {
    Loader,
    MainNav
  },
  data: function() {
    return {
      settings: null,
      loading: true,
      ie: false
    };
  },
  beforeMount: function() {
    function isIE() {
      var ua = navigator.userAgent;
      /* MSIE used to detect old browsers and Trident used to newer ones*/
      var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;

      return is_ie;
    }
    this.ie = isIE();
  },
  created: function() {
    axios
      .get("/_data/settings.json")
      .then(response => {
        this.settings = response.data;
        this.loading = false;
      })
      .catch(error => {
        alert(error);
      });
  },
  methods: {
    onToggleCanva(menuVisible) {
      this.canvaOffset = menuVisible;
    }
  }
};
</script>

<style lang="scss">
:root {
  --main-txt-color: rgb(3, 3, 3);
  --main-txt-gray: rgba(55, 53, 47, 0.6);
  --main-charcoal: rgb(30, 41, 48);
  --main-gray: rgb(150, 150, 150);
  --main-lightgray: rgb(238, 238, 238);
  --main-bg-color: rgb(248, 248, 248);
  --main-charcoal-trans: rgb(54, 69, 79, 0.8);
  --main-charcoal-fulltrans: rgb(54, 69, 79, 0.3);
  --main-bg-trans: rgb(248, 248, 248, 0.8);
  --main-gray-tras: rgb(150, 150, 150, 0.2);
  --main-highlight: rgb(255, 255, 0);

  box-sizing: border-box;
}
* {
  box-sizing: border-box;
}
html,
body {
  // font-family: 'Courier Prime', monospace;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica,
    "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
  background-color: var(--main-bg-color);
  color: var(--main-txt-color);
  font-size: 18px;
}
a,
a:hover,
a:active,
a:focus {
  color: var(--main-txt-color);
}
a:hover {
  text-decoration: none;
}
a:focus,
button:focus,
[tabindex="-1"]:focus {
  outline-color: rgb(255, 0, 170);
  outline-style: dashed;
  outline-width: 1px;
}
.wrapper {
  margin: 0 auto;
  padding: 0 24px;
  max-width: 992px;
}
.sr-only {
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}
.highlight {
  background-color: var(--main-highlight);
  white-space: nowrap;
}
h1 span.underline {
  position: relative;
  &:after {
    background-color: var(--main-txt-color);
    content: "";
    display: block;
    height: 8px;
    left: 0;
    bottom: -4px;
    position: absolute;
    width: 72px;
    @media (max-width: 350px) {
      content: none;
    }
  }
}
ul {
  list-style-type: square;
}
.content li {
  margin: 8px;
}

.icon-btn {
  background: transparent;
  color: var(--main-charcoal);
  border-radius: 1.5em;
  font-size: 1.2em;
  width: 42px;
  height: 42px;
  padding-top: 7px;
  display: block;
  transition: all 0.2s ease;
  &:hover,
  &:focus {
    background: var(--main-gray-tras);
    transform: scale(1.2);
  }
}
h1 {
  position: relative;
  margin-bottom: 32px;
  // &:after {
  //   background-color: var(--main-txt-color);
  //   content: "";
  //   display: block;
  //   height: 5px;
  //   left: 0;
  //   bottom: -8px;
  //   position: absolute;
  //   width: 42px;
  // }
}
p {
  line-height: 1.5em;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

//TOOLTIP

.tooltip {
  display: block !important;
  z-index: 25;
  font-size: 0.8em;
  line-height: 1em;

  .tooltip-inner {
    background: var(--main-charcoal);
    color: var(--main-bg-color);
    border-radius: 16px;
    padding: 4px 10px 6px;
  }

  .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: black;
    z-index: 1;
  }

  &[x-placement^="top"] {
    margin-bottom: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 0 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="bottom"] {
    margin-top: 5px;

    .tooltip-arrow {
      border-width: 0 5px 5px 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="right"] {
    margin-left: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 5px 0;
      border-left-color: transparent !important;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      left: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[x-placement^="left"] {
    margin-right: 5px;

    .tooltip-arrow {
      border-width: 5px 0 5px 5px;
      border-top-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      right: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &.popover {
    $color: #f9f9f9;

    .popover-inner {
      background: $color;
      color: black;
      padding: 24px;
      border-radius: 4px;
      box-shadow: 0 5px 30px rgba(black, 0.1);
    }

    .popover-arrow {
      border-color: $color;
    }
  }

  &[aria-hidden="true"] {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.15s, visibility 0.15s;
  }

  &[aria-hidden="false"] {
    visibility: visible;
    opacity: 1;
    transition: opacity 0.15s;
  }
}

.progressive-background-image {
  background-position: 0 30% !important;
  border-radius: 4px;
}
</style>
