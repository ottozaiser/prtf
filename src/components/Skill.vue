<template>
  <div class="skill">
        {{title}}
        <ul v-if="typeof skills[0] == 'string'" >
            <li v-bind:key="value.id" v-for="value in skills">
                {{ value }}
            </li>
        </ul>
        <ul v-if="typeof skills[0]  == 'object'" >
            <li v-bind:key="value.id" v-for="value in skills">
                {{ value[0] }} , {{ value[1] }}
            </li>
        </ul>
  </div>
</template>

<script>
export default {
  name: 'Skill',
  props: {
    title: String,
    skills: Array
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.skill{
  border: 1px solid red;
  width: 30%;
  margin-right: 1%;
  float: left;
}
</style>
