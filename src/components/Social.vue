<template>
  <div class="social">
    <h2 class="sr-only">Social media</h2>
    <ul class="socialmedia">
      <li class="social-item" v-bind:key="item.name" v-for="item in items">
        <a target="_blank" rel="noopener" :href="item.url" class="icon-btn" :title="item.hover" :aria-label="item.hover">
          <font-awesome-icon :icon="['fab', item.name]" aria-hidden="true" />
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Social",
  props: {
    // false (home): only the networks without "home": false, i.e. LinkedIn and Vimeo.
    // true (My story): every network, art ones included.
    all: { type: Boolean, default: false },
  },
  data: function () {
    return {
      social: null,
    };
  },
  computed: {
    items() {
      return (this.social || []).filter((s) => this.all || s.home !== false);
    },
  },
  created: function () {
    axios
      .get(import.meta.env.BASE_URL + "_data/socialmedia.json")
      .then((response) => {
        this.social = response.data.socialitem;
      })
      .catch((error) => {
        // fail gracefully
        console.warn('Could not load socialmedia.json', error);
      });
  },
};
</script>

<style scoped>
.social ul.socialmedia {
  padding: 0;
  display: flex;
  justify-content: flex-start;
  gap: 8px;
}
.social ul.socialmedia li.social-item {
  list-style-type: none;
  text-align: center;
}
.social ul.socialmedia li.social-item:first-child {
  margin-left: 0;
}
.social ul.socialmedia li.social-item:last-child {
  margin-right: 0;
}
</style>
