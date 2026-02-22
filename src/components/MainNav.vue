<template>
  <div>
    <header>
      <nav class="main-navigation" id="nav">
        <button
          class="menu-button"
          id="menuBtn"
          @click="toggleMenu"
          aria-controls="menu"
          aria-label="Toggle navigation"
          :aria-expanded="(!isDesktop && showMenu).toString()"
          v-if="!isDesktop"
        >
          <div class="nav-icon" v-bind:class="{ open: showMenu }">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        <transition name="slide">
          <div class="panel-menu" :class="{ scrolled: isScrolled && isDesktop, 'brand-visible': isDesktop && $route.path === '/story' }" v-show="showMenu || isDesktop" id="menu">
            <div class="panel-menu-inner">
              <h1 class="brand">
                <a href="/" @click="onBrandClick" v-html="this.settings.site_title"></a>
              </h1>
              <h1 id="dialog-title" class="sr-only">Main navigation</h1>
              <ul class="menu">
                <li
                  class="menu-item"
                  @click="!isDesktop && toggleMenu()"
                  v-bind:key="index"
                  v-for="(item, index) in this.menujson"
                >
                  <router-link
                    :to="item.url"
                    custom
                    v-slot="{ href, navigate }"
                    v-if="item.url.startsWith('/')"
                  >
                    <a :href="href" @click="navigate" :class="{ 'is-active': isMenuItemActive(item.url) }"><span class="nav-link-label">{{ item.name }}</span></a>
                  </router-link>
                  <a :href="item.url" target="_blank" v-else><span class="nav-link-label">{{ item.name }}</span></a>
                </li>
              </ul>
            </div>
            <!-- <button aria-label="Close Navigation" @click="toggleMenu">x</button>  -->
            <!-- <Social class="social" /> -->
          </div>
        </transition>
      </nav>
    </header>
    <transition name="fade">
      <div v-show="showMenu && !isDesktop" class="overlay" tabindex="-1" id="overlay" @click="toggleMenu"></div>
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
      isDesktop: false,
      isScrolled: false,
      activeSectionHash: "",
      navEl: undefined,
      menuEl: undefined,
      overlayEl: undefined,
      desktopQuery: undefined,
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
    this.desktopQuery = window.matchMedia("(min-width: 992px)");
    this.handleViewportChange(this.desktopQuery);
    this.desktopQuery.addEventListener("change", this.handleViewportChange);
    window.addEventListener("scroll", this.onWindowScroll);
    this.$nextTick(() => {
      this.syncActiveFromScroll();
    });
    this.close();
  },
  beforeUnmount: function () {
    if (this.desktopQuery) {
      this.desktopQuery.removeEventListener("change", this.handleViewportChange);
    }
    window.removeEventListener("scroll", this.onWindowScroll);
  },
  watch: {
    $route() {
      this.$nextTick(() => {
        this.syncActiveFromScroll();
      });
    },
  },
  methods: {
    onBrandClick(e) {
      e.preventDefault();

      if (!this.isDesktop) {
        this.showMenu = false;
        this.close();
      }

      const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        this.activeSectionHash = "";
      };

      if (this.$route.path === "/") {
        scrollToTop();
        return;
      }

      this.$router.push("/").then(() => {
        this.$nextTick(() => {
          requestAnimationFrame(() => {
            scrollToTop();
          });
        });
      });
    },
    onWindowScroll() {
      this.isScrolled = window.scrollY > 8;
      this.syncActiveFromScroll();
    },
    syncActiveFromScroll() {
      if (this.$route.path !== "/") {
        this.activeSectionHash = "";
        return;
      }

      var resumeEl = document.getElementById("resume");
      var portfolioEl = document.getElementById("portfolio");
      var offset = this.isDesktop ? 120 : 32;
      var scrollPosition = window.scrollY + offset;
      var activeHash = "";

      if (portfolioEl && scrollPosition >= portfolioEl.offsetTop) {
        activeHash = "#portfolio";
      } else if (resumeEl && scrollPosition >= resumeEl.offsetTop) {
        activeHash = "#resume";
      }

      this.activeSectionHash = activeHash;
    },
    isMenuItemActive(url) {
      if (!url || !url.startsWith("/")) {
        return false;
      }

      var pathAndHash = url.split("#");
      var path = pathAndHash[0] || "/";
      var hash = pathAndHash[1] ? `#${pathAndHash[1]}` : "";

      if (hash) {
        return this.$route.path === path && this.activeSectionHash === hash;
      }

      if (path === "/") {
        return this.$route.path === "/" && !this.activeSectionHash;
      }

      return this.$route.path === path;
    },
    handleViewportChange(e) {
      this.isDesktop = e.matches;
      this.showMenu = this.isDesktop;
      this.isScrolled = window.scrollY > 8;
      this.syncActiveFromScroll();
      this.close();
    },
    toggleMenu() {
      if (this.isDesktop) {
        return;
      }
      this.showMenu = !this.showMenu;
      if (this.showMenu) {
        this.open();
      } else {
        this.close();
      }
    },
    open() {
      if (this.isDesktop || !this.menuEl) {
        return;
      }
      this.focusedElBeforeOpen;
      var focusableEls = this.navEl.querySelectorAll(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
      );
      this.focusableEls = Array.prototype.slice.call(focusableEls);
      if (!this.focusableEls.length) {
        return;
      }
      this.firstFocusableEl = this.focusableEls[0];
      this.lastFocusableEl = this.focusableEls[this.focusableEls.length - 1];
      document.body.style.overflow = "hidden";
      var Dialog = this;
      this.menuEl.removeAttribute("aria-hidden");
      if (this.overlayEl) {
        this.overlayEl.removeAttribute("aria-hidden ");
      }
      this.focusedElBeforeOpen = document.activeElement;
      this.menuEl.addEventListener("keydown", function (e) {
        Dialog._handleKeyDown(e);
      });
      if (this.overlayEl) {
        this.overlayEl.addEventListener("click", function () {
          Dialog.close();
        });
      }
      this.firstFocusableEl.focus();
    },
    close() {
      document.body.style.overflow = "visible";
      if (this.menuEl) {
        this.menuEl.setAttribute("aria-hidden", true);
      }
      if (this.overlayEl) {
        this.overlayEl.setAttribute("aria-hidden", true);
      }
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
    display: flex;
    align-items: center;
    justify-content: center;
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
      height: 18px;
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

  @media (min-width: 992px) {
    button.menu-button {
      display: none;
    }
  }
}
h1.brand {
  font-size: 1.2em;
  margin: 18px 32px 18px 0px;

  a {
    color: inherit;
    text-decoration: none;
  }
}

@media (max-width: 991px) {
  h1.brand {
    span.ml {
      padding-left: 32px;
    }
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

.panel-menu-inner {
  width: 100%;
  display: flex;
  flex-direction: column;
}

@media (min-width: 992px) {
  .panel-menu {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    min-width: 0;
    height: auto;
    overflow: visible;
    box-shadow: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: transparent;
    border-bottom: 1px solid transparent;
    padding: 0 24px;
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }

  .panel-menu.scrolled {
    background-color: var(--main-bg-color);
    border-bottom-color: var(--main-gray-tras);
  }

  .panel-menu-inner {
    max-width: 992px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
  }

  h1.brand {
    margin: 0 16px 0 0;
    font-size: 1.2em;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-6px);
    transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
  }

  .panel-menu.scrolled h1.brand {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .panel-menu.brand-visible h1.brand {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  nav.main-navigation {
    ul.menu {
      margin-top: 0;
      width: auto;
      flex-grow: 1;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;

      li.menu-item {
        a {
          width: auto;
          padding: 1em 1.2em;
          border-bottom: 3px solid transparent;
          transition: background-color 0.2s ease, transform 0.2s ease;

          &:hover,
          &:focus {
            border-left: 0;
            border-bottom: 3px solid var(--main-highlight);
            background-color: transparent;
          }
        }

        a.router-link-exact-active,
        a.is-active {
          border-left: 0;
          border-bottom: 3px solid var(--main-charcoal);

          &:hover,
          &:focus {
            border-left: 0;
            border-bottom: 3px solid var(--main-highlight);
          }
        }
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
          border-left: 5px solid var(--main-highlight);
          background-color: var(--main-lightgray);
        }
      }
      a.router-link-exact-active,
      a.is-active {
        border-left: 5px solid var(--main-charcoal);
        &:hover,
        &:focus {
          border-left: 5px solid var(--main-charcoal);
        }
      }
    }
  }
}

@media (min-width: 992px) {
  nav.main-navigation {
    ul.menu {
      margin-top: 0;
      width: auto;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;

      li.menu-item {
        a {
          width: auto;
          padding: 1em 1.2em;
          border-bottom: 3px solid transparent;
          transition: background-color 0.2s ease, transform 0.2s ease;

          &:hover,
          &:focus {
            border-left: 0;
            border-bottom: 3px solid var(--main-highlight);
            background-color: transparent;
          }
        }

        a.router-link-exact-active,
        a.is-active {
          border-left: 0;
          border-bottom: 3px solid var(--main-charcoal);

          &:hover,
          &:focus {
            border-left: 0;
            border-bottom: 3px solid var(--main-highlight);
          }
        }
      }
    }
  }
}

nav.main-navigation {
  ul.menu {
    li.menu-item {
      @media (min-width: 992px) {
        a:hover,
        a:focus {
          box-shadow: inset 0 0 0 0 var(--main-highlight);
          animation: nav-link-stroke-bounce 0.3s ease;
        }
      }

      a:hover .nav-link-label,
      a:focus .nav-link-label {
        display: inline-block;
        animation: nav-link-bounce 0.3s ease;
      }
    }
  }
}

@keyframes nav-link-bounce {
  0% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-4px);
  }
  70% {
    transform: translateY(-1px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes nav-link-stroke-bounce {
  0% {
    box-shadow: inset 0 0 0 0 var(--main-highlight);
  }
  40% {
    box-shadow: inset 0 -6px 0 0 var(--main-highlight);
  }
  70% {
    box-shadow: inset 0 -4px 0 0 var(--main-highlight);
  }
  100% {
    box-shadow: inset 0 0 0 0 var(--main-highlight);
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
