<template>
  <div class="client">
    <div class="img-container">
      <!-- <div class="open">
            <font-awesome-icon aria-hidden="true" :icon="['fa', 'external-link-alt']" />
            <span class="sr-only">Open in new window</span>
      </div>-->
      <progressive-img class="image" :src="cover.split('/public').pop()" :alt="title" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Client",
  props: {
    title: String,
    cover: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
* {
  transition: all 0.2s ease;
}

a {
  border-radius: 4px;
  border: 1px solid var(--main-lightgray);
  text-decoration: none;
  transition: all 0.2s ease;
  &:hover {
    transform: translate(0, -5px);
  }
}
.img-container {
  position: relative;
  // background: var(--main-lightgray);
}
.client {
  h2 {
    color: var(--main-charcoal);
    margin-top: 0;
    font-size: 1.1em;
    // text-transform: uppercase;
    font-weight: bold;
  }
}
.image {
  width: 100%;
  margin-bottom: -3px;
  // filter: grayscale(100%);
}
p {
  margin: 0;
}
</style>
