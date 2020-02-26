<template>
  <article>
    <a :href="file" target="_blank">
      <div class="project">
        <div class="img-container">
          <div class="open">
            <font-awesome-icon aria-hidden="true" :icon="['fa', 'external-link-alt']" />
            <span class="sr-only">Open in new window</span>
          </div>
          <progressive-img class="image" :src="cover.split('/public').pop()" alt />
        </div>
        <h2>{{ title }}</h2>
        <div class="content">
          <p v-html="content"></p>
        </div>
      </div>
    </a>
  </article>
</template>

<script>
export default {
  name: "Project",
  props: {
    title: String,
    content: String,
    location: String,
    file: String,
    cover: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
* {
  transition: all 0.2s ease;
}
a {
  text-decoration: none;
  transition: all 0.2s ease;
  &:hover,
  &:focus {
    h2 {
      background-color: var(--main-txt-color);
    }
    .image {
      filter: grayscale(0%);
    }
    .open {
      opacity: 1;
    }
  }
}
.img-container {
  position: relative;
  background: var(--main-gray);
}
.open {
  opacity: 0;
  background: var(--main-bg-trans);
  color: var(--main-charcoal);
  font-size: 1.2em;
  position: absolute;
  z-index: 1;
  width: 42px;
  height: 42px;
  padding-top: 7px;
  border-radius: 56px;
  top: 8px;
  right: 8px;
  text-align: center;
}
.project {
  h2 {
    background-color: var(--main-charcoal);
    color: var(--main-bg-color);
    margin: 0px;
    padding: 16px;
    font-size: 1.1em;
    // text-transform: uppercase;
    font-weight: normal;
  }
}
.image {
  width: 100%;
  margin-bottom: -3px;
  filter: grayscale(100%);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.content {
  padding: 16px;
  background-color: transparent;
}
p {
  margin: 0;
}
</style>
