<template>
  <div class="resume wrapper" v-if="this.resumejson">
    <h1 v-html="this.highTitle(this.resumejson.title)"></h1>
    <section>
      <h2>{{ this.resumejson.about.title }}</h2>
      <div class="content">
        <div class="image">
          <progressive-background :src="this.resumejson.about.image" />
        </div>
        <div>
          <div v-html="this.resumejson.about.content" class="dynamic-content" @click="handleClicks"></div>
          <a
            v-if="this.resumejson.resume && this.resumejson.resume.name"
            class="btn download"
            :href="this.resumejson.resume.name"
            download
          >
            <font-awesome-icon icon="download" aria-hidden="true" />
            Download CV (PDF)
          </a>
        </div>
      </div>
    </section>
    <!-- <router-link to='/story'> {{ this.resumejson.label }} </router-link> -->

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
          v-bind:url="post.url"
          v-bind:description="post.description"
          v-bind:from="post.from"
          v-bind:to="post.to"
          v-bind:open="Boolean(post.open)"
        />
      </div>
    </section>

    <section v-if="this.resumejson.volunteering" data-aos="fade-up" data-aos-once="true">
      <h2>{{ this.resumejson.volunteering.volunteering_title }}</h2>
      <div class="jobs">
        <Job
          class="job"
          data-aos="fade-up"
          data-aos-once="true"
          v-for="post in this.resumejson.volunteering.job"
          v-bind:key="post.company"
          v-bind:position="post.position"
          v-bind:company="post.company"
          v-bind:url="post.url"
          v-bind:description="post.description"
          v-bind:from="post.from"
          v-bind:to="post.to"
          v-bind:open="Boolean(post.open)"
        />
      </div>
    </section>

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

    <!-- The page (and the home page, which ends with it) closes with a next step -->
    <aside v-if="settings && settings.contact_email" class="hire" aria-labelledby="resume-hire-title">
      <p id="resume-hire-title" class="hire-title">Like what you see? Let’s talk.</p>
      <div class="hire-actions">
        <ContactMenu
          variant="hero"
          :email="settings.contact_email"
          :linkedin="settings.linkedin_url"
          :cv="settings.cv_url"
        />
        <a v-if="settings.cv_url" class="btn" :href="settings.cv_url" download>
          <font-awesome-icon icon="download" aria-hidden="true" />
          Download CV
        </a>
      </div>
    </aside>
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
import ContactMenu from "@/components/ContactMenu.vue";

export default {
  name: "resume",
  mixins: [ClickHandler],
  components: {
    Job,
    Skill,
    Education,
    ContactMenu,
  },
  data: function () {
    return {
      resumejson: null,
      settings: null,
    };
  },
  created: function () {
    axios
      .get("/_data/settings.json")
      .then((response) => {
        this.settings = response.data;
      })
      .catch(() => {});
    axios
      .get("/_data/resume.json")
      .then((response) => {
        this.resumejson = response.data;
        AOS.init();
      })
      .catch((error) => {
        alert(error);
      });
  },
  methods: {
    highTitle(t) {
      var st1 = t.slice(0, 2);
      var st2 = t.substring(2);
      var ret = "<span class='highlight'>" + st1 + "</span>" + st2;
      return ret;
    },
  },
};
</script>

<style scoped>
/* Contact box at the end, same look as the one on case pages */
.hire {
  margin: 64px 0 48px;
  padding: 24px;
  border: 2px solid var(--main-highlight);
  border-radius: 4px;
  background: #fff;
}
.hire-title {
  font-size: 1.25em;
  font-weight: bold;
  line-height: 1.3;
  color: var(--main-charcoal);
  margin: 0 0 16px;
}
.hire-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.hire .contact-menu {
  width: auto;
}
.hire .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 10px 20px;
}
@media (max-width: 480px) {
  .hire .btn,
  .hire .contact-menu {
    flex: 1 1 100%;
    width: 100%;
  }
}
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
  margin-bottom: 16px;
  margin-top: 120px;
}
/* Phones: half a screen of blank space between sections is too much */
@media (max-width: 640px) {
  section {
    margin-top: 64px;
  }
}
.content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-column-gap: 32px;
}
@media (max-width: 640px) {
  .content {
    grid-template-columns: 1fr;
  }
}
.download {
  display: inline-block;
  margin-top: 8px;
}
.download svg {
  margin-right: 6px;
}
.content .image {
  text-align: center;
  width: 100%;
  margin: 0 auto;
  margin-top: 16px;
  background-color: var(--main-lightgray);
  border: 1px solid var(--main-lightgray);
}
@media (max-width: 640px) {
  .content .image {
    width: 100%;
    height: 300px;
    margin: 0 auto;
  }
}
</style>
