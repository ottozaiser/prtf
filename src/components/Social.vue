<template>
  <div class="social">
    <h2 class="sr-only">Social media</h2>
    <ul class="socialmedia">
      <li
        class="social-item"
        v-bind:key="index"
        v-for="(item, index) in this.social"
      >
        <a target="_blank" :href="item[2]" class="icon-btn" v-tooltip="item[1]">
          <font-awesome-icon :icon="['fab', item[0]]" aria-hidden="true" />
          <span class="sr-only">{{ item[0] }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Social",
  props: ["djson"],
  data: function() {
    return {
      social: undefined
    };
  },
  created: function() {
    this.social = this.djson.social;
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
