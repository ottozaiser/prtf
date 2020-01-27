<template>
  <div class="resume wrapper">
    <h1>{{ this.djson.resume.title }}</h1>
    <section>
      <h2>{{ this.djson.resume.sections[0] }}</h2>
      <div class="content">
        <progressive-img class="image" :src="this.djson.resume.photo" />
        <div
          v-html="this.djson.resume.content"
          class="dynamic-content"
          @click="handleClicks"
        ></div>
      </div>
    </section>
    <!-- <router-link to='/story'> {{ this.djson.resume.label }} </router-link> -->

    <section>
      <h2>{{ this.djson.resume.sections[1] }}</h2>
      <div class="skills">
        <Skill
          class="skill"
          data-aos="fade-up"
          data-aos-once="true"
          v-for="(post, key) in this.djson.resume.skills[0]"
          v-bind:key="post.id"
          v-bind:skills="post"
          v-bind:title="key"
        />
      </div>
    </section>

    <section>
      <h2>{{ this.djson.resume.sections[2] }}</h2>
      <div class="jobs">
        <Job
          class="job"
          data-aos="fade-up"
          data-aos-once="true"
          v-for="post in this.djson.resume.past"
          v-bind:key="post.id"
          v-bind:position="post.position"
          v-bind:company="post.company"
          v-bind:description="post.description"
          v-bind:from="post.from"
          v-bind:to="post.to"
          v-bind:labels="Object.keys(post)"
        />
      </div>
    </section>
  </div>
</template>

<script>
import AOS from "aos";
import "aos/dist/aos.css";
import Job from "@/components/Job.vue";
import Skill from "@/components/Skill.vue";
import ClickHandler from "@/mixins/ClickHandler.js";

export default {
  name: "resume",
  props: ["djson"],
  mixins: [ClickHandler],
  components: {
    Job,
    Skill
  },
  created: function() {
    AOS.init();
  }
};
</script>

<style lang="scss" scoped>
.skills {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-column-gap: 16px;
  grid-row-gap: 16px;
}
.job {
  margin-bottom: 16px;
}
section {
  margin-top: 48px;
}

.content {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-column-gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }

  .image {
    max-width: 250px !important;
    text-align: center;
    border: 1px solid var(--main-lightgray);
    border-radius: 4px;
    margin: 0 auto;
    margin-top: 16px;
  }
}
</style>
