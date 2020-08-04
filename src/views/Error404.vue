<template>
  <div class="error404">
    <div class="window" v-if="!fixed">
      <div class="content">
        <h1>Fatal Error</h1>
        <div class="textContent">
          <p>An error ocurred: Connection refused (0x6546FAE36B654E54). Version=2.03. Display(String value, Type objectType) =0000077765464654.</p>
        </div>
        <div class="btns">
          <button v-on:click="fixed = true">Fix UX Error</button>
        </div>
      </div>
    </div>
    <div class="window fixed" v-if="fixed">
      <div class="content">
        <h1>404 - Page not found</h1>
        <div class="textContent">
          <p>Sorry. Sometimes I make mistakes but that’s ok.</p>
        </div>
        <div class="btns">
          <router-link class="btn" to="/">Go back home</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "error404",
  data: function () {
    return {
      fixed: false,
    };
  },
};
</script>

<style scoped lang="scss">
.error404 {
  display: flex;
  flex: 1;
  position: relative;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 98vh;
  overflow: hidden;
  padding: 0 24px;
  @media (max-width: 640px) {
    padding: 24px;
  }
}

.window {
  max-width: 500px;
  width: 100%;
  border: 1px solid red;
  z-index: 2;
}
.content {
  h1 {
    margin: 0;
    padding: 16px;
    color: white;
    background-color: red;
    font-size: 1.1em;
  }
  .textContent {
    word-wrap: break-word;
    padding: 16px;
    p {
      margin: 0;
    }
  }
  .btns {
    padding: 16px;
    text-align: right;
    button {
      padding: 8px;
      border: 1px solid black;
      background-color: transparent;
      cursor: pointer;
      &:hover,
      &:focus {
        background-color: var(--main-lightgray);
      }
    }
  }
}
.fixed {
  border: 1px solid black;
  border-radius: 10px;
  h1 {
    background-color: transparent;
    color: var(--main-charcoal);
  }
}
</style>
