<template>
  <a :href="file" target="_blank" rel="external nofollow" v-if="show">
    <article>
      <div class="project">
        <div class="img-container">
          <!-- <div class="open">
            <font-awesome-icon aria-hidden="true" :icon="['fa', 'external-link-alt']" />
            <span class="sr-only">Open in new window</span>
          </div>-->
          <progressive-img class="image" :src="cover.split('/public').pop()" alt />
        </div>
        <div class="content">
          <h2>{{ title }}</h2>
          <p v-html="content"></p>
        </div>
      </div>
    </article>
  </a>
</template>

<script>
export default {
  name: "Project",
  props: {
    show: Boolean,
    title: String,
    content: String,
    location: String,
    file: String,
    cover: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  transition: all 0.3s ease;
}
a {
  border-radius: 4px;
  border: 1px solid var(--main-lightgray);
  text-decoration: none;
  transition: all 0.3s ease;
}
a:hover {
  transform: translate(0, -5px);
}
.img-container {
  position: relative;
}
.project h2 {
  color: var(--main-charcoal);
  margin-top: 0;
  font-size: 1.1em;
  font-weight: bold;
}
.image {
  width: 100%;
  max-width: 100% !important;
  margin-bottom: -3px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom: 1px solid var(--main-lightgray);
}
.content {
  padding: 16px;
  background-color: transparent;
}
p {
  margin: 0;
}
</style>
