<template>
  <div>
    <header>
      <nav class="main-navigation" id="nav">
        <button
          class="menu-button"
          id="menuBtn"
          :class="{ tucked: tucked && !showMenu }"
          @click="toggleMenu"
          aria-controls="menu"
          aria-label="Menu"
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
                <!-- "Get in touch" call to action: copy email / email / LinkedIn -->
                <li v-if="settings && settings.contact_email" class="menu-item menu-cta">
                  <ContactMenu :email="settings.contact_email" :linkedin="settings.linkedin_url" :cv="settings.cv_url" />
                </li>
              </ul>
              <!-- Phones and tablets: the social links live here instead of under the home intro -->
              <Social v-if="!isDesktop" class="sheet-social" />
            </div>
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
import Social from "@/components/Social.vue";
import axios from "axios";
import ContactMenu from "@/components/ContactMenu.vue";
export default {
  name: "MainNav",
  components: {
    ContactMenu,
    Social,
  },
  props: {
    settings: Object,
  },
  data: function () {
    return {
      menujson: null,
      showMenu: false,
      isDesktop: false,
      isScrolled: false,
      // Phones: the floating menu button slides away while scrolling down, back on scroll up
      tucked: false,
      lastScrollY: 0,
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
      const y = window.scrollY;
      const nearBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 80;
      if (y < 80 || nearBottom || y < this.lastScrollY - 4) this.tucked = false;
      else if (y > this.lastScrollY + 4) this.tucked = true;
      this.lastScrollY = y;
      this.syncActiveFromScroll();
    },
    syncActiveFromScroll() {
      if (this.$route.path !== "/") {
        this.activeSectionHash = "";
        return;
      }

      // The section you're in is the last one whose top you've scrolled past (works whatever
      // order the home sections are in).
      var offset = this.isDesktop ? 120 : Math.round(window.innerHeight / 3);
      var scrollPosition = window.scrollY + offset;
      var activeHash = "";
      ["portfolio", "resume"]
        .map((id) => document.getElementById(id))
        .filter(Boolean)
        .sort((a, b) => a.offsetTop - b.offsetTop)
        .forEach((el) => {
          if (scrollPosition >= el.offsetTop) activeHash = "#" + el.id;
        });

      this.activeSectionHash = activeHash;
    },
    isMenuItemActive(url) {
      if (!url || !url.startsWith("/")) {
        return false;
      }

      var pathAndHash = url.split("#");
      var path = pathAndHash[0] || "/";
      var hash = pathAndHash[1] ? `#${pathAndHash[1]}` : "";

      // Case-study pages (/portfolio/<slug>) belong to the Portfolio menu item.
      if (this.$route.path.startsWith("/portfolio/") && (hash === "#portfolio" || path === "/portfolio")) {
        return true;
      }

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

<style>
header button.menu-button {
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
}
header button.menu-button:hover,
header button.menu-button:focus,
header button.menu-button:active {
  background-color: var(--main-gray-tras);
}
header button.menu-button:hover .nav-icon,
header button.menu-button:focus .nav-icon,
header button.menu-button:active .nav-icon {
  opacity: 1;
}
header button.menu-button .nav-icon {
  position: relative;
  height: 18px;
  width: 24px;
  transform: rotate(0deg);
  transition: 0.5s ease-in-out;
  opacity: 0.6;
}
header button.menu-button .nav-icon span {
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
header button.menu-button .nav-icon span:nth-child(1) {
  top: 0px;
}
header button.menu-button .nav-icon span:nth-child(2),
header button.menu-button .nav-icon span:nth-child(3) {
  top: 8px;
}
header button.menu-button .nav-icon span:nth-child(4) {
  top: 16px;
}
header button.menu-button .open span:nth-child(1) {
  top: 8px;
  width: 0%;
  left: 50%;
}
header button.menu-button .open span:nth-child(2) {
  transform: rotate(45deg);
}
header button.menu-button .open span:nth-child(3) {
  transform: rotate(-45deg);
}
header button.menu-button .open span:nth-child(4) {
  top: 8px;
  width: 0%;
  left: 50%;
}
@media (min-width: 992px) {
  header button.menu-button {
    display: none;
  }
}

h1.brand {
  font-size: 1.2em;
  margin: 18px 32px 18px 0px;
}
h1.brand a {
  color: inherit;
  text-decoration: none;
}
@media (max-width: 991px) {
  h1.brand span.ml {
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
}
.panel-menu .social {
  padding: 8px 0 0;
}
.panel-menu .social ul.socialmedia li.social-item {
  padding: 0;
}
.panel-menu .social ul.socialmedia li.social-item a {
  font-size: 1.2em;
  width: 44px;
  height: 44px;
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
  nav.main-navigation ul.menu {
    margin-top: 0;
    width: auto;
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  nav.main-navigation ul.menu li.menu-item a {
    width: auto;
    padding: 1em 1.2em;
    border-bottom: 3px solid transparent;
    transition: background-color 0.2s ease, transform 0.2s ease;
  }
  nav.main-navigation ul.menu li.menu-item a:hover,
  nav.main-navigation ul.menu li.menu-item a:focus-visible {
    border-left: 0;
    border-bottom: 3px solid var(--main-highlight);
    background-color: transparent;
    box-shadow: inset 0 0 0 0 var(--main-highlight);
    animation: nav-link-stroke-bounce 0.3s ease;
  }
  nav.main-navigation ul.menu li.menu-item a.router-link-exact-active,
  nav.main-navigation ul.menu li.menu-item a.is-active {
    border-left: 0;
    border-bottom: 3px solid var(--main-charcoal);
  }
  nav.main-navigation ul.menu li.menu-item a.router-link-exact-active:hover,
  nav.main-navigation ul.menu li.menu-item a.router-link-exact-active:focus-visible,
  nav.main-navigation ul.menu li.menu-item a.is-active:hover,
  nav.main-navigation ul.menu li.menu-item a.is-active:focus-visible {
    border-left: 0;
    border-bottom: 3px solid var(--main-highlight);
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

nav.main-navigation ul.menu {
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
}
nav.main-navigation ul.menu li.menu-item a {
  flex-grow: 1;
  display: block;
  width: 100%;
  color: var(--main-txt-color);
  padding: 2em;
  text-decoration: none;
  transition: all 0.2s ease;
}
nav.main-navigation ul.menu li.menu-item a:hover,
nav.main-navigation ul.menu li.menu-item a:focus-visible {
  border-left: 5px solid var(--main-highlight);
  background-color: var(--main-lightgray);
}
nav.main-navigation ul.menu li.menu-item a.router-link-exact-active,
nav.main-navigation ul.menu li.menu-item a.is-active {
  border-left: 5px solid var(--main-charcoal);
}
nav.main-navigation ul.menu li.menu-item a.router-link-exact-active:hover,
nav.main-navigation ul.menu li.menu-item a.router-link-exact-active:focus-visible,
nav.main-navigation ul.menu li.menu-item a.is-active:hover,
nav.main-navigation ul.menu li.menu-item a.is-active:focus-visible {
  border-left: 5px solid var(--main-charcoal);
}

@media (min-width: 992px) {
  nav.main-navigation ul.menu {
    margin-top: 0;
    width: auto;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
  nav.main-navigation ul.menu li.menu-item a {
    width: auto;
    padding: 1em 1.2em;
    border-bottom: 3px solid transparent;
    transition: background-color 0.2s ease, transform 0.2s ease;
  }
  nav.main-navigation ul.menu li.menu-item a:hover,
  nav.main-navigation ul.menu li.menu-item a:focus-visible {
    border-left: 0;
    border-bottom: 3px solid var(--main-highlight);
    background-color: transparent;
  }
  nav.main-navigation ul.menu li.menu-item a.router-link-exact-active,
  nav.main-navigation ul.menu li.menu-item a.is-active {
    border-left: 0;
    border-bottom: 3px solid var(--main-charcoal);
  }
  nav.main-navigation ul.menu li.menu-item a.router-link-exact-active:hover,
  nav.main-navigation ul.menu li.menu-item a.router-link-exact-active:focus-visible,
  nav.main-navigation ul.menu li.menu-item a.is-active:hover,
  nav.main-navigation ul.menu li.menu-item a.is-active:focus-visible {
    border-left: 0;
    border-bottom: 3px solid var(--main-highlight);
  }
}

nav.main-navigation ul.menu li.menu-item a:hover .nav-link-label,
nav.main-navigation ul.menu li.menu-item a:focus-visible .nav-link-label {
  display: inline-block;
  animation: nav-link-bounce 0.3s ease;
}

@keyframes nav-link-bounce {
  0% { transform: translateY(0); }
  40% { transform: translateY(-4px); }
  70% { transform: translateY(-1px); }
  100% { transform: translateY(0); }
}

@keyframes nav-link-stroke-bounce {
  0% { box-shadow: inset 0 0 0 0 var(--main-highlight); }
  40% { box-shadow: inset 0 -6px 0 0 var(--main-highlight); }
  70% { box-shadow: inset 0 -4px 0 0 var(--main-highlight); }
  100% { box-shadow: inset 0 0 0 0 var(--main-highlight); }
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
  transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter,
.slide-leave-to {
  transform: translateZ(0) translateX(300px);
}

/* Phones and tablets: thumb-friendly navigation. The menu button floats at the bottom right (and
   slides away while scrolling down), and the menu opens as a bottom sheet with centered links. */
@media (max-width: 991px) {
  header button.menu-button {
    top: auto;
    right: 16px;
    bottom: calc(16px + env(safe-area-inset-bottom, 0px));
    width: 48px;
    height: 48px;
    background-color: var(--main-charcoal);
    box-shadow: 0 4px 14px rgba(30, 41, 48, 0.28);
    transition: transform 0.25s ease, background-color 0.2s ease;
  }
  header button.menu-button:hover,
  header button.menu-button:focus,
  header button.menu-button:active {
    background-color: var(--main-charcoal);
  }
  /* Out of the way while scrolling down, so it doesn't sit on page buttons */
  header button.menu-button.tucked {
    transform: translateY(calc(100% + 32px));
  }
  header button.menu-button:focus-visible {
    outline: 3px solid var(--main-highlight);
    outline-offset: 2px;
  }
  header button.menu-button .nav-icon {
    width: 20px;
    height: 16px;
    opacity: 1;
  }
  header button.menu-button .nav-icon span {
    background: #fff;
  }
  header button.menu-button .nav-icon span:nth-child(2),
  header button.menu-button .nav-icon span:nth-child(3),
  header button.menu-button .open span:nth-child(1),
  header button.menu-button .open span:nth-child(4) {
    top: 7px;
  }
  header button.menu-button .nav-icon span:nth-child(4) {
    top: 14px;
  }
  header button.menu-button .open span:nth-child(1),
  header button.menu-button .open span:nth-child(4) {
    top: 7px;
  }

  .panel-menu {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    min-width: 0;
    height: auto;
    max-height: 85vh;
    max-height: 85dvh;
    border-radius: 16px 16px 0 0;
    box-shadow: 0 -6px 24px rgba(30, 41, 48, 0.18);
    /* room below the links for the floating close button */
    padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px));
  }
  .slide-enter-from,
  .slide-leave-to {
    transform: translateY(100%);
  }
  h1.brand {
    margin: 20px 24px 12px;
    text-align: center;
  }
  h1.brand span.ml {
    padding-left: 0;
  }
  nav.main-navigation ul.menu {
    margin-top: 0;
    flex-grow: 0;
    justify-content: flex-start;
  }
  nav.main-navigation ul.menu li.menu-item a {
    padding: 14px 24px;
    border-left: 0;
  }
  /* Page links only (not the Get in touch options inside the same list) */
  nav.main-navigation ul.menu li.menu-item > a {
    text-align: center;
    font-size: 1.15em;
  }
  nav.main-navigation ul.menu li.menu-item a:hover,
  nav.main-navigation ul.menu li.menu-item a:focus-visible {
    border-left: 0;
    background-color: var(--main-gray-tras);
  }
  /* Current page: a yellow highlighter stroke under the label, like the portfolio cards */
  nav.main-navigation ul.menu li.menu-item a.router-link-exact-active,
  nav.main-navigation ul.menu li.menu-item a.is-active,
  nav.main-navigation ul.menu li.menu-item a.router-link-exact-active:hover,
  nav.main-navigation ul.menu li.menu-item a.router-link-exact-active:focus-visible,
  nav.main-navigation ul.menu li.menu-item a.is-active:hover,
  nav.main-navigation ul.menu li.menu-item a.is-active:focus-visible {
    border-left: 0;
    font-weight: 600;
  }
  nav.main-navigation ul.menu li.menu-item a.router-link-exact-active .nav-link-label,
  nav.main-navigation ul.menu li.menu-item a.is-active .nav-link-label {
    background: linear-gradient(var(--main-highlight), var(--main-highlight)) no-repeat 0 88% / 100% 0.4em;
    padding: 0 2px;
  }
}
@media (max-width: 991px) and (prefers-reduced-motion: reduce) {
  .slide-enter-active,
  .slide-leave-active,
  header button.menu-button {
    transition: none;
  }
}
/* Social icons at the bottom of the sheet, spread evenly */
nav.main-navigation .panel-menu .sheet-social ul.socialmedia {
  justify-content: space-evenly;
  margin: 4px 24px 0;
}
/* Pages leave room at the bottom so the floating menu button never covers the last lines */
@media (max-width: 991px) {
  body {
    padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px));
  }
}
/* Touch screens: no hover state, so the last tapped link doesn't look selected */
@media (max-width: 991px) and (hover: none) {
  nav.main-navigation ul.menu li.menu-item a:hover {
    background-color: transparent;
    box-shadow: none;
  }
}
</style>
