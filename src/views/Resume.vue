<template>
  <div class="resume wrapper" v-if="this.resumejson">
    <h1>{{ this.resumejson.title }}</h1>
    <section>
      <h2>{{ this.resumejson.about.title }}</h2>
      <div class="content">
        <div class="image">
          <progressive-background :src="this.resumejson.about.image" />
        </div>
        <div v-html="this.resumejson.about.content" class="dynamic-content" @click="handleClicks"></div>
      </div>
    </section>
    <!-- <router-link to='/story'> {{ this.resumejson.label }} </router-link> -->

    <section data-aos="fade-up" data-aos-once="true">
      <h2>{{ this.resumejson.education.education_title }}</h2>
      <div class="education">
        <Education
          class="job"
          data-aos="fade-up"
          data-aos-once="true"
          v-bind:position="post.position"
          v-bind:title="post.title"
          v-bind:institution="post.institution"
          v-bind:link="post.link"
          v-bind:finished="post.finished"
          v-for="post in this.resumejson.education.education_items"
          v-bind:key="post.id"
        />
      </div>
    </section>

    <section data-aos="fade-up" data-aos-once="true">
      <h2>{{ this.resumejson.skills.skills_title }}</h2>
      <div class="skills">
        <Skill
          class="skill"
          data-aos="fade-up"
          data-aos-once="true"
          v-for="post in this.resumejson.skills.categories"
          v-bind:key="post.id"
          v-bind:skills="post.category"
          v-bind:title="post.category_title"
        />
      </div>
    </section>

    <section data-aos="fade-up" data-aos-once="true">
      <h2>{{ this.resumejson.experience.experience_title }}</h2>
      <div class="jobs">
        <Job
          class="job"
          data-aos="fade-up"
          data-aos-once="true"
          v-for="post in this.resumejson.experience.job"
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
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import Job from "@/components/Job.vue";
import Skill from "@/components/Skill.vue";
import Education from "@/components/Education.vue";
import ClickHandler from "@/mixins/ClickHandler.js";

export default {
  name: "resume",
  mixins: [ClickHandler],
  components: {
    Job,
    Skill,
    Education
  },
  data: function() {
    return {
      resumejson: null
    };
  },
  created: function() {
    axios
      .get("/_data/resume.json")
      .then(response => {
        this.resumejson = response.data;
        AOS.init();
      })
      .catch(error => {
        alert(error);
      });
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
  grid-template-columns: 1fr 2fr;
  grid-column-gap: 32px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }

  .image {
    text-align: center;
    width: 100%;
    text-align: center;
    margin: 0 auto;
    margin-top: 16px;
    background-color: var(--main-lightgray);
    border: 1px solid var(--main-lightgray);
    @media (max-width: 640px) {
      width: 100%;
      height: 300px;
      margin: 0 auto;
    }
  }
}
</style>
