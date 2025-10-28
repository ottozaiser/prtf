<template>
  <div>
    <header>
      <nav class="main-navigation" id="nav">
        <button
          class="menu-button"
          id="menuBtn"
          @click="toggleMenu"
          aria-controls="navbarCollapse"
          aria-label="Toggle navigation"
          :aria-expanded="[showMenu]"
        >
          <div class="nav-icon" v-bind:class="{ open: showMenu }">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        <transition name="slide">
          <div class="panel-menu" v-show="showMenu" id="menu">
            <h1 class="brand" v-html="this.settings.site_title"></h1>
            <h1 id="dialog-title" class="sr-only">Main navigation</h1>
            <ul class="menu">
              <li
                class="menu-item"
                @click="toggleMenu"
                v-bind:key="index"
                v-for="(item, index) in this.menujson"
              >
                <router-link :to="item.url" v-if="item.url.startsWith('/')">{{ item.name }}</router-link>
                <a :href="item.url" target="_blank" v-else>{{ item.name }}</a>
              </li>
            </ul>
            <!-- <button aria-label="Close Navigation" @click="toggleMenu">x</button>  -->
            <!-- <Social class="social" /> -->
          </div>
        </transition>
      </nav>
    </header>
    <transition name="fade">
      <div v-show="showMenu" class="overlay" tabindex="-1" id="overlay" @click="toggleMenu"></div>
    </transition>
  </div>
</template>

<script>
// import Social from "@/components/Social.vue";
import axios from "axios";
export default {
  name: "MainNav",
  // components: {
  //   Social,
  // },
  props: {
    settings: Object,
  },
  data: function () {
    return {
      menujson: null,
      showMenu: false,
      navEl: undefined,
      menuEl: undefined,
      overlayEl: undefined,
      focusedElBeforeOpen: undefined,
    };
  },
  created: function () {
    axios
      .get("/_data/menu.json")
      .then((response) => {
        this.menujson = response.data.menuitem;
      })
      .catch((error) => {
        alert(error);
      });
  },
  mounted: function () {
    //this.menujson = this.loadData("/_data/menu.json");
    this.navEl = document.getElementById("nav");
    this.menuEl = document.getElementById("menu");
    this.overlayEl = document.getElementById("overlay");
    this.close(); // Reset
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
      if (this.showMenu) {
        this.open();
      } else {
        this.close();
      }
    },
    open() {
      this.focusedElBeforeOpen;
      var focusableEls = this.navEl.querySelectorAll(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
      );
      this.focusableEls = Array.prototype.slice.call(focusableEls);
      this.firstFocusableEl = this.focusableEls[0];
      this.lastFocusableEl = this.focusableEls[this.focusableEls.length - 1];
      document.body.style.overflow = "hidden";
      var Dialog = this;
      this.menuEl.removeAttribute("aria-hidden");
      this.overlayEl.removeAttribute("aria-hidden ");
      this.focusedElBeforeOpen = document.activeElement;
      this.menuEl.addEventListener("keydown", function (e) {
        Dialog._handleKeyDown(e);
      });
      this.overlayEl.addEventListener("click", function () {
        Dialog.close();
      });
      this.firstFocusableEl.focus();
    },
    close() {
      document.body.style.overflow = "visible";
      this.menuEl.setAttribute("aria-hidden", true);
      this.overlayEl.setAttribute("aria-hidden", true);
      if (this.focusedElBeforeOpen) {
        this.focusedElBeforeOpen.focus();
      }
    },
    _handleKeyDown(e) {
      var Dialog = this;
      var KEY_TAB = 9;
      var KEY_ESC = 27;
      function handleBackwardTab() {
        if (document.activeElement === Dialog.firstFocusableEl) {
          e.preventDefault();
          Dialog.lastFocusableEl.focus();
        }
      }
      function handleForwardTab() {
        if (document.activeElement === Dialog.lastFocusableEl) {
          e.preventDefault();
          Dialog.firstFocusableEl.focus();
        }
      }
      switch (e.keyCode) {
        case KEY_TAB:
          if (Dialog.focusableEls.length === 1) {
            e.preventDefault();
            break;
          }
          if (e.shiftKey) {
            handleBackwardTab();
          } else {
            handleForwardTab();
          }
          break;
        case KEY_ESC:
          this.showMenu = false;
          Dialog.close();
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss">
@use 'sass:math';
@use 'sass:color';
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

header {
  button.menu-button {
    position: fixed;
    padding: 0;
    top: 8px;
    right: 8px;
    width: 48px;
    height: 48px;
    border: 0px;
    z-index: 15;
    background-color: var(--main-bg-trans);
    border-radius: 24px;
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover,
    &:focus,
    &:active {
      background-color: var(--main-gray-tras);
      .nav-icon {
        opacity: 1;
      }
    }
    .nav-icon {
      position: relative;
      margin: 0 auto;
      margin-top: -9px;
      width: 24px;
      transform: rotate(0deg);
      transition: 0.5s ease-in-out;
      opacity: 0.6;
      span {
        display: block;
        position: absolute;
        height: 2px;
        width: 100%;
        background: var(--main-txt-color);
        border-radius: 2px;
        opacity: 1;
        left: 0;
        transform: rotate(0deg);
        transition: 0.2s ease-in-out;
      }
      span:nth-child(1) {
        top: 0px;
      }

      span:nth-child(2),
      span:nth-child(3) {
        top: 8px;
      }

      span:nth-child(4) {
        top: 16px;
      }
    }
    .open span:nth-child(1) {
      top: 8px;
      width: 0%;
      left: 50%;
    }

    .open span:nth-child(2) {
      transform: rotate(45deg);
    }

    .open span:nth-child(3) {
      transform: rotate(-45deg);
    }

    .open span:nth-child(4) {
      top: 8px;
      width: 0%;
      left: 50%;
    }
  }
}
h1.brand {
  font-size: 1.2em;
  margin: 18px 32px 18px 0px;
  span.ml {
    padding-left: 32px;
  }
}
.panel-menu {
  position: fixed;
  background-color: var(--main-bg-color);
  box-shadow: 0px 0px 4px var(--main-txt-color);
  top: 0;
  right: 0;
  width: 0;
  height: 100%;
  min-width: 240px;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 14;
  transition: all 0.5s ease;
  display: flex;
  flex-direction: column;
  //transform: translateZ(0) translateX(260px);
  .social {
    padding: 1em 2em;
    ul.socialmedia li.social-item {
      padding: 0;
      a {
        font-size: 1em;
        width: 36px;
        height: 36px;
      }
    }
  }
}
.panel-menu.open {
  transition: all 0.5s ease;
  transform: translateZ(0) translateX(0);
}
.nombre {
  font-size: 1.3em;
  margin-left: 24px;
}
nav.main-navigation {
  ul.menu {
    list-style-type: none;
    margin: 0;
    margin-top: 32px;
    padding: 0;
    color: var(--main-txt-color);
    width: 100%;
    border-radius: 1px solid red;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    li.menu-item {
      a {
        flex-grow: 1;
        display: block;
        width: 100%;
        color: var(--main-txt-color);
        padding: 2em;
        text-decoration: none;
        // text-transform: uppercase;
        transition: all 0.2s ease;
        &:hover,
        &:focus {
          border-left: 5px solid var(--main-charcoal);
          background-color: var(--main-lightgray);
        }
      }
      a.router-link-exact-active {
        border-left: 5px solid var(--main-charcoal-trans);
        &:hover,
        &:focus {
          border-left: 5px solid var(--main-charcoal);
        }
      }
    }
  }
}
.overlay {
  z-index: 13;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--main-charcoal-trans);
}

.fade-enter-active,
.fade-leave-active {
  @include transition(opacity);
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  @include transition(transform);
}
.slide-enter, .slide-leave-to {
  transform: translateZ(0) translateX(300px);
}
</style>
