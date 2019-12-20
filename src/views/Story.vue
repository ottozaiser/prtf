<template>
  <div class="story">
    <!-- <h1>{{ this.djson.story.title }}</h1> -->
    <!-- <p>{{ this.djson.story.content }}</p> -->
    <section  v-bind:key="index" v-for="(item, index) in this.steps" :id="index" >
      <!-- <a v-show="index > 0" class="backButton" :href="'#'+(index-1)">Back</a> -->
      <div class="content" data-aos="fade-up">
        <img v-lazy="item.url" :alt="item.alt" />
        <div>
          <h1>{{ item.title }}</h1>
          <p>{{ item.content }}</p>
        </div>
      </div>
      <a v-show="index < steps.length-1" class="nextButton" :href="'#'+(index+1)">Next</a>
    </section>
  </div>    
</template>


<script>

export default {
  name: 'story',
  props: ['djson'],
  data: function() {
      return {
          steps: undefined,  
      };
  },
  created: function () {
    this.steps = this.djson.story.steps;
    // window.scrollTo(0, 0);
  }
}
</script>


<style lang="scss" scoped>

.story{
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  

}
section{
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: yellow;
  border: 2px dotted gray;
  width: 100%;
  position: relative;
  &:nth-child(even){
    .content{
      flex-direction: row-reverse;
    }
  }
  .content{
    border: 1px solid red;
    max-width: 640px;
    display: flex;
    align-items: center;
    justify-content: center;

    

    div{
      padding: 30px;
    }

    @media (max-width: 640px) {
      display: block;
      text-align: center;
      flex-direction: row;
    
    }
  }

  a.nextButton{
    position: absolute;
    bottom: 20px;
  }
  a.backButton{
    position: absolute;
    top: 20px;
  }

  img{
    min-width: 300px;
    min-height: 300px;
    @media (max-width: 300px) {
      width: 100%;
      min-width: 100%;
      min-height: 100%;
    
    }
  }
  

}
</style>