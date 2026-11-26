<template>
  <div class="job" :id="anchorId">
    <div class="header">
      <h3>
        <span class="sr-only">Position:</span>
        <span class="title-marker">{{ position }}</span>
      </h3>
      <p v-if="from">
        <span class="sr-only">From:</span>
        {{ from }}
        <span aria-hidden="true">–</span>
        <span class="sr-only">To:</span>
        {{ to }}
      </p>
    </div>
    <div class="subheader">
      <p>
        <span class="sr-only">Company:</span>
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
      <p class="sr-only">Description:</p>
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
    company: String,
    url: String,
    position: String,
    description: String,
    from: String,
    to: String,
    // Start expanded (the recent, relevant jobs), so a recruiter reads them without a tap
    open: Boolean,
  },
  data: function () {
    return {
      show: this.open,
    };
  },
  computed: {
    // Company alone isn't unique (e.g. two "Freelance" entries), so add the start date.
    anchorId() {
      return [this.company, this.from].filter(Boolean).join("-").replace(/[^\w-]+/g, "-");
    },
  },
  methods: {
    toggle() {
      if (this.show) {
        this.show = false;
        document.getElementById(this.anchorId).scrollIntoView();
      } else {
        this.show = true;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3,
p {
  margin: 0px;
  font-weight: normal;
}
.job {
  border: 1px solid var(--main-lightgray);
  border-radius: 4px;
}
.job .header {
  border-bottom: 1px solid var(--main-lightgray);
  color: var(--main-charcoal);
  padding: 16px;
  padding-bottom: 18px;
  display: grid;
  grid-template-columns: 2fr 1fr;
}
@media (max-width: 640px) {
  .job .header {
    grid-template-columns: 1fr;
  }
}
.job .header h3 {
  font-weight: bold;
  display: inline-block;
  font-size: 1.1em; /* site h3 size: labels, card and job titles */
}
.job .header p {
  line-height: 1em;
  align-self: center;
  justify-self: end;
}
@media (max-width: 640px) {
  .job .header p {
    margin-top: 8px;
    justify-self: start;
  }
}
.job .subheader {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 8px 16px;
  border-bottom: 1px solid var(--main-lightgray);
}
.job .company {
  text-transform: uppercase;
}
.job .more {
  align-self: center;
  justify-self: end;
}
.job .less {
  margin-bottom: 16px;
}
.job .content {
  padding: 0 16px;
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
