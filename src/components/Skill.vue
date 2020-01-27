<template>
  <div class="skill">
    <h3>{{ title }}</h3>
    <ul v-if="typeof skills[0] == 'string'">
      <li v-bind:key="value.id" v-for="value in skills">
        {{ value }}
      </li>
    </ul>
    <ul v-if="typeof skills[0] == 'object'">
      <li v-bind:key="value.id" v-for="value in skills">
        {{ value[0] }}
        <Percentage v-bind:number="value[1]" />
      </li>
    </ul>
  </div>
</template>

<script>
import Percentage from "@/components/Percentage.vue";
export default {
  name: "Skill",
  props: {
    title: String,
    skills: Array
  },
  components: {
    Percentage
  },
  created: function() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.skill {
  border: 1px solid var(--main-charcoal);
  border-radius: 4px;
  h3 {
    background-color: var(--main-charcoal);
    color: var(--main-bg-color);
    margin: 0px;
    padding: 8px;
    padding-bottom: 12px;
    font-weight: normal;
  }

  li {
    margin: 8px;
  }
}
</style>
