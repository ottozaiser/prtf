import "normalize.css";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueProgressiveImage from "vue-progressive-image";
import VTooltip from "v-tooltip";

// Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faChevronDown,
  faAngleDoubleUp,
  faHome,
  faExternalLinkAlt
} from "@fortawesome/free-solid-svg-icons";
import {
  faLinkedin,
  faVimeo,
  faInstagram,
  faTumblr,
  faDribbble
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faLinkedin,
  faVimeo,
  faInstagram,
  faTumblr,
  faDribbble,
  faChevronDown,
  faAngleDoubleUp,
  faHome,
  faExternalLinkAlt
);

Vue.component("font-awesome-icon", FontAwesomeIcon);

// import './assets/styles/index.scss';
Vue.use(VueProgressiveImage);
Vue.use(VTooltip);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
