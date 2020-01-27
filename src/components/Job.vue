<template>
  <div class="job">
    <div class="header">
      <h3>
        <span class="sr-only">{{ labels[0] }}: </span>{{ company }}
      </h3>
      <p>
        <span class="sr-only">{{ labels[2] }}: </span>{{ from }}
        <span aria-label="hidden">-</span>
        <span class="sr-only">{{ labels[3] }}: </span> {{ to }}
      </p>
    </div>
    <div class="subheader">
      <p>
        <span class="sr-only">{{ labels[1] }}: </span
        ><span class="highlight">{{ position }}</span>
      </p>
    </div>
    <div class="content">
      <p class="sr-only">{{ labels[4] }}:</p>
      <div v-html="description"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Job",
  props: {
    labels: Array,
    company: String,
    position: String,
    description: String,
    from: String,
    to: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3,
p {
  margin: 0px;
}
.job {
  border: 1px solid var(--main-charcoal);
  border-radius: 4px;
  .header {
    background-color: var(--main-charcoal);
    color: var(--main-bg-color);
    padding: 8px;
    text-transform: uppercase;
    font-weight: normal;
    padding-bottom: 12px;
    h3,
    p {
      display: inline-block;
    }
    p {
      float: right;
    }
  }
  .subheader {
    padding: 8px;
    border-bottom: 1px solid var(--main-charcoal);
    font-weight: bold;
  }
  .content {
    padding: 0 16px;
  }
}
.sr-only {
  text-transform: capitalize;
}
li {
  margin: 4px !important;
}
</style>
