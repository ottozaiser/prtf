<template>
  <div class="education">
    <div class="header">
      <h3>
        {{ finished }} -
        <span>{{ title }}</span>
      </h3>
      <p>
        <a :href="link" target="_blank">{{ institution }}</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Education",
  props: {
    title: String,
    institution: String,
    link: String,
    finished: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3,
p {
  margin: 0px;
}
.education {
  border-bottom: 1px solid var(--main-lightgray);
  .header {
    font-weight: normal;
    padding-bottom: 12px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
    h3,
    p {
      font-weight: normal;
      display: inline-block;
    }
    p {
      align-self: center;
      justify-self: end;
      @media (max-width: 640px) {
        justify-self: start;
        margin-left: 65px;
      }
    }
  }
}
</style>
