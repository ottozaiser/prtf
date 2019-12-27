<template>
  <div id="nav">
    <transition name="fade">
      <div  v-show="showMenu">
        <nav class="main-navigation" id="dialog" tabindex="-1" role="dialog" aria-labelledby="dialog-title">
          <h1 id="dialog-title">Main navigation</h1>
          <ul class="menu" role="document">
            <li class="menu-item" @click="toggleMenu"><router-link to="/">{{this.djson.home.title}}</router-link> </li>
            <li class="menu-item" @click="toggleMenu"><router-link to="/resume">{{this.djson.resume.title}}</router-link></li>
            <li class="menu-item" @click="toggleMenu"><router-link to="/story">{{this.djson.story.title}}</router-link>   </li>
            <li class="menu-item" @click="toggleMenu"><router-link to="/portfolio">{{this.djson.portfolio.title}}</router-link></li>
          </ul>
          <button aria-label="Close Navigation" @click="toggleMenu">x</button> 
        </nav>
        <div class="dialog-overlay" tabindex="-1" id="dialog-overlay" @click="toggleMenu"></div>
      </div>
    </transition>
  </div>
</template>


<script>

export default {
  name: 'MainNav',
  props: ['djson'],
  data: function() {
      return {        
          showMenu: false,
          dialogEl: undefined,  
          overlayEl: undefined,  
          focusedElBeforeOpen: undefined,
      };
  },
  mounted: function () {
      this.dialogEl = document.getElementById('dialog');
      this.overlayEl = document.getElementById('dialog-overlay');
      this.focusedElBeforeOpen;
      var focusableEls = this.dialogEl.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]');
      this.focusableEls = Array.prototype.slice.call(focusableEls);
      this.firstFocusableEl = this.focusableEls[0];
      this.lastFocusableEl = this.focusableEls[this.focusableEls.length - 1];
      this.close(); // Reset
  },
  methods: {
    toggleMenu(){
      this.showMenu = !this.showMenu;    
      if(this.showMenu){
        this.open();
      }else{
        this.close();
      }
    },   
    open() {
      var Dialog = this;
      this.dialogEl.removeAttribute('aria-hidden');
      this.overlayEl.removeAttribute('aria-hidden');
      this.focusedElBeforeOpen = document.activeElement;
      this.dialogEl.addEventListener('keydown', function (e) {
        Dialog._handleKeyDown(e);
      });
      this.overlayEl.addEventListener('click', function () {
        Dialog.close();
      });
      this.firstFocusableEl.focus();
    },
    close() {
      this.dialogEl.setAttribute('aria-hidden', true);
      this.overlayEl.setAttribute('aria-hidden', true);
      if (this.focusedElBeforeOpen) {
        this.focusedElBeforeOpen.focus();
      }
    },
    _handleKeyDown(e) {
      var Dialog = this;
      var KEY_TAB = 9;
      var KEY_ESC = 27;
      function handleBackwardTab() {
        if (document.activeElement === Dialog.firstFocusableEl) {
          e.preventDefault();
          Dialog.lastFocusableEl.focus();
        }
      }
      function handleForwardTab() {
        if (document.activeElement === Dialog.lastFocusableEl) {
          e.preventDefault();
          Dialog.firstFocusableEl.focus();
        }
      }
      switch (e.keyCode) {
        case KEY_TAB:
          if (Dialog.focusableEls.length === 1) {
            e.preventDefault();
            break;
          }
          if (e.shiftKey) {
            handleBackwardTab();
          }
          else {
            handleForwardTab();
          }
          break;
        case KEY_ESC:
          Dialog.close();
          break;
        default:
          break;
      }
    }
  }
  
}
</script>

<style lang="scss"></style>
