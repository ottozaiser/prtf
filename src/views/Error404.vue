<template>
  <div class="error404" v-if="this.homejson">
    <div class="layout">
      <progressive-img class="image" src="/images/error.png" alt />
      <div class="content">
        <h1>Error 404</h1>
        <p>This shitty vuerouter couldn't find this page. Try these instead:</p>
        <ul class="menu">
          <li class="menu-item" v-bind:key="index" v-for="(item, index) in this.homejson.links">
            <router-link :to="item.url" v-if="item.url.startsWith('/')">{{ item.name }}</router-link>
            <a :href="item.url" target="_blank" v-else>{{ item.name }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "error404",
  data: function () {
    return {
      homejson: null,
    };
  },
  created: function () {
    axios
      .get("/_data/home.json")
      .then((response) => {
        this.homejson = response.data;
      })
      .catch((error) => {
        alert(error);
      });
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

.layout {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  z-index: 2;
  @media (max-width: 640px) {
    display: block;
    text-align: center;
    flex-direction: row;
    min-height: auto;
  }
}
.content {
  max-width: 256px;

  @media (max-width: 640px) {
    margin: 0 auto;
    h1 {
      display: inline-block;
      &:after {
        left: 0px;
      }
    }
  }
  @media (max-width: 300px) {
    h1:after {
      content: none;
    }
  }
}

ul.menu {
  padding: 0;
  li {
    display: block;
    margin: 8px 0;
    padding: 8px;
    a {
      color: black;
    }
  }
  @media (max-width: 640px) {
    text-align: center;
  }
}
.image {
  width: 256px;
  max-width: 256px;
  max-height: 256px;
  @media (max-width: 300px) {
    width: 100%;
  }
}
</style>
