<template>
  <div class="job" :id="company">
    <div class="header">
      <h3>
        <span class="sr-only">{{ labels[0] }}:</span>
        {{ position }}
      </h3>
      <p>
        <span class="sr-only">{{ labels[2] }}:</span>
        {{ from }}
        <span aria-label="hidden">-</span>
        <span class="sr-only">{{ labels[3] }}:</span>
        {{ to }}
      </p>
    </div>
    <div class="subheader">
      <p>
        <span class="sr-only">{{ labels[1] }}:</span>
        <span class="company">
          <span v-if="url">
            <a :href="url" target="_blank" rel="nofollow">{{ company }}</a>
          </span>
          <span v-else>{{ company }}</span>
        </span>
      </p>
      <div class="more">
        <button v-if="!show" id="showBtn" v-on:click="toggle()" class="btn btn-small">
          See more
          <span class="sr-only">about {{ company }}</span>
        </button>
      </div>
    </div>
    <div class="content" v-if="show">
      <p class="sr-only">{{ labels[4] }}:</p>
      <div v-html="description"></div>
      <button id="hideBtn" v-on:click="toggle()" class="btn btn-small less">
        See less
        <span class="sr-only">about {{ company }}</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Job",
  props: {
    labels: Array,
    company: String,
    url: String,
    position: String,
    description: String,
    from: String,
    to: String,
  },
  data: function () {
    return {
      show: false,
    };
  },
  methods: {
    toggle() {
      if (this.show) {
        this.show = false;
        document.getElementById(this.company).scrollIntoView();
      } else {
        this.show = true;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3,
p {
  margin: 0px;
  font-weight: normal;
}
.job {
  border: 1px solid var(--main-lightgray);
  border-radius: 4px;
  .header {
    border-bottom: 1px solid var(--main-lightgray);
    color: var(--main-charcoal);
    padding: 16px;
    padding-bottom: 18px;
    display: grid;
    grid-template-columns: 2fr 1fr;
    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
    h3 {
      font-weight: bold;
      display: inline-block;
    }
    p {
      line-height: 1em;
      align-self: center;
      justify-self: end;
      @media (max-width: 640px) {
        margin-top: 8px;
        justify-self: start;
      }
    }
  }
  .subheader {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 8px 16px;
    border-bottom: 1px solid var(--main-lightgray);
  }
  .company {
    text-transform: uppercase;
  }
  .more {
    align-self: center;
    justify-self: end;
  }
  .less {
    margin-bottom: 16px;
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
.highlight {
  white-space: normal;
}
</style>
