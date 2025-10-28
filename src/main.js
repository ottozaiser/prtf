import "normalize.css";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import VueProgressiveImage from "vue-progressive-image";
import VTooltip from "v-tooltip";

// Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { faChevronDown, faAngleDoubleUp, faHome, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faVimeo, faInstagram, faTumblr, faDribbble } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faLinkedin, faVimeo, faInstagram, faTumblr, faDribbble, faChevronDown, faAngleDoubleUp, faHome, faExternalLinkAlt);

Vue.component("font-awesome-icon", FontAwesomeIcon);

// import './assets/styles/index.scss';
Vue.use(VueProgressiveImage);
Vue.use(VTooltip);
Vue.config.productionTip = false;

// Security: limit maximum response/request sizes to mitigate DoS from very large payloads
// These are conservative defaults; adjust to your app's needs (values are in bytes).
// maxContentLength: limits response content size in browser/node, maxBodyLength: node only
axios.defaults.maxContentLength = 2 * 1024 * 1024; // 2 MB
axios.defaults.maxBodyLength = 2 * 1024 * 1024; // 2 MB

new Vue({
	router,
	render: (h) => h(App),
}).$mount("#app");
