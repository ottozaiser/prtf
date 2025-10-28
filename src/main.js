import "normalize.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import '@/styles/index.scss';

// Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { faChevronDown, faAngleDoubleUp, faHome, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faVimeo, faInstagram, faTumblr, faDribbble } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import ProgressiveImg from '@/components/ProgressiveImg.vue';
import ProgressiveBackground from '@/components/ProgressiveBackground.vue';

library.add(faLinkedin, faVimeo, faInstagram, faTumblr, faDribbble, faChevronDown, faAngleDoubleUp, faHome, faExternalLinkAlt);

// Create app using Vue 3 (compat build)
const app = createApp(App);

// Register global component
app.component("font-awesome-icon", FontAwesomeIcon);
app.component('progressive-img', ProgressiveImg);
app.component('progressive-background', ProgressiveBackground);

// import './assets/styles/index.scss';

// Vue 3 removed `config.productionTip`; no-op here to avoid a deprecation warning.

// Security: limit maximum response/request sizes to mitigate DoS from very large payloads
// These are conservative defaults; adjust to your app's needs (values are in bytes).
// maxContentLength: limits response content size in browser/node, maxBodyLength: node only
axios.defaults.maxContentLength = 2 * 1024 * 1024; // 2 MB
axios.defaults.maxBodyLength = 2 * 1024 * 1024; // 2 MB

app.use(router);

// mount app
app.mount("#app");
