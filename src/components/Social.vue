<template>
  <div class="social">
    <h2 class="sr-only">Social media</h2>
    <ul class="socialmedia">
      <li class="social-item" v-bind:key="index" v-for="(item, index) in this.social">
        <a target="_blank" :href="item.url" class="icon-btn" v-tooltip="item.hover">
          <font-awesome-icon :icon="['fab', item.name]" aria-hidden="true" />
          <span class="sr-only">{{ item.name }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Social",
  data: function() {
    return {
      social: null
    };
  },
  created: function() {
    axios
      .get("/_data/socialmedia.json")
      .then(response => {
        this.social = response.data.socialitem;
      })
      .catch(error => {
        alert(error);
      });
  }
};
</script>

<style scoped lang="scss">
.social {
  ul.socialmedia {
    padding: 0;
    display: flex;
    justify-content: space-between;
    li.social-item {
      list-style-type: none;
      // margin-right: 8px;
      text-align: center;
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
