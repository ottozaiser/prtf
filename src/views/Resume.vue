<template>
  <div class="resume">
    <h1>{{ this.djson.resume.title }}</h1>
    <h2>{{ this.djson.resume.sections[0] }}</h2>
    <p v-html="this.djson.resume.content" class="dynamic-content" @click="handleClicks"></p>
    
    <!-- <router-link to='/story'> {{ this.djson.resume.label }} </router-link> -->
    

    

    <h2>{{ this.djson.resume.sections[1] }}</h2>

    <Skill 
        v-for="(post, key) in this.djson.resume.skills[0]"
        v-bind:key="post.id"
        v-bind:skills="post"
        v-bind:title="key"
    />

    <h2>{{ this.djson.resume.sections[2] }}</h2>
    <Job 
        v-for="post in this.djson.resume.past"
        v-bind:key="post.id"
        v-bind:title="post.title"
        v-bind:company="post.company"
        v-bind:description="post.description"
        v-bind:started="post.started"
        v-bind:finished="post.finished"
    />

  </div>
</template>


<script>

import Job from '@/components/Job.vue'
import Skill from '@/components/Skill.vue'

export default {
  name: 'resume',
  props: ['djson'],
  components: {
    Job,
    Skill
  },
  created: function () {
  },
  methods: {
    handleClicks ($event) {
        // ensure we use the link, in case the click has been received by a subelement
        let { target } = $event
        while (target && target.tagName !== 'A') target = target.parentNode
        // handle only links that occur inside the component and do not reference external resources
        if (target && target.matches(".dynamic-content a:not([href*='://'])") && target.href) {
          // some sanity checks taken from vue-router:
          // https://github.com/vuejs/vue-router/blob/dev/src/components/link.js#L106
          const { altKey, ctrlKey, metaKey, shiftKey, button, defaultPrevented } = $event
          // don't handle with control keys
          if (metaKey || altKey || ctrlKey || shiftKey) return
          // don't handle when preventDefault called
          if (defaultPrevented) return
          // don't handle right clicks
          if (button !== undefined && button !== 0) return
          // don't handle if `target="_blank"`
          if (target && target.getAttribute) {
            const linkTarget = target.getAttribute('target')
            if (/\b_blank\b/i.test(linkTarget)) return
          }
          // don't handle same page links/anchors
          const url = new URL(target.href)
          const to = url.pathname
          if (window.location.pathname !== to && $event.preventDefault) {
            $event.preventDefault()
            this.$router.push(to)
          }
        }
      }
    }
}
</script>

