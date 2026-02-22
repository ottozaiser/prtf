<template>
  <div class="contact wrapper">
    <h1 v-html="this.highTitle('Contact')"></h1>
    <div class="contact-content">
      <div class="contact-copy">
        <p>Have a project in mind or just want to say hi?</p>
        <a class="btn" href="mailto:hola@otto.com.ar?subject=Hi!">Get in touch</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "contact",
  methods: {
    highTitle(t) {
      var st1 = t.slice(0, 3);
      var st2 = t.substring(3);
      var ret = "<span class='highlight'>" + st1 + "</span>" + st2;
      return ret;
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;
.contact {
  .contact-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    align-items: center;
  }

  .contact-copy {
    p {
      margin-top: 0;
      margin-bottom: 16px;
    }
  }

  .btn {
    display: inline-block;
    width: auto;
  }

  @media (max-width: 640px) {
    .contact-content {
      grid-template-columns: 1fr;
    }

    .btn {
      display: block;
      width: 100%;
    }
  }
}
</style>
