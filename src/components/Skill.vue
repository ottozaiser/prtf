<template>
  <div class="skill">
    <h3>{{ title }}</h3>
    <ul>
      <li v-bind:key="value.id" v-for="value in skills">
        {{ value.name }}
        <Percentage v-if="value.percentage" v-bind:number="Number(value.percentage)" />
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
    skills: Array,
  },
  components: {
    Percentage,
  },
  created: function () {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.skill {
  border: 1px solid var(--main-lightgray);
  border-radius: 4px;
  h3 {
    border-bottom: 1px solid var(--main-lightgray);
    color: var(--main-charcoal);
    margin: 0px;
    padding: 16px;
    font-size: 1.1em;
    line-height: 1em;
    font-weight: bold;
  }

  li {
    margin: 8px;
  }
}
</style>
