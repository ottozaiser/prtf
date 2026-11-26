<template>
  <!-- Full-screen image viewer for case pages: tap an image to open it, then move through the
       rest of its section with the arrows, the keyboard (← → Esc) or a swipe. -->
  <div
    v-if="open && current"
    class="lightbox"
    role="dialog"
    aria-modal="true"
    :aria-label="label"
    tabindex="-1"
    @click.self="close"
  >
    <div class="top">
      <p v-if="items.length > 1" class="counter" aria-live="polite">{{ index + 1 }} / {{ items.length }}</p>
      <button ref="closeBtn" class="icon-btn lb-btn close" type="button" aria-label="Close" @click="close">
        <font-awesome-icon icon="xmark" aria-hidden="true" />
      </button>
    </div>

    <figure class="stage" :class="{ zoomed }" @click.self="close" @touchstart.passive="onTouchStart" @touchend="onTouchEnd">
      <!-- Phones: wide screenshots (desktop pages, tables) stay small when fitted, so a tap
           shows them at full screen height and they scroll sideways; tap again to fit. -->
      <div class="frame" ref="frame">
        <img
          :key="current.src"
          :src="current.src"
          :alt="current.alt || current.caption || ''"
          class="img"
          @load="onImgLoad"
          @click="toggleZoom"
        />
      </div>
      <p v-if="wide && !zoomed" class="hint">Tap the image to zoom</p>
      <figcaption v-if="current.caption || description" class="caption">
        <strong v-if="current.caption">{{ current.caption }}</strong>
        <span v-if="description">{{ description }}</span>
      </figcaption>
    </figure>

    <template v-if="items.length > 1">
      <button class="icon-btn lb-btn nav prev" type="button" aria-label="Previous image" @click="go(-1)">
        <font-awesome-icon icon="chevron-left" aria-hidden="true" />
      </button>
      <button class="icon-btn lb-btn nav next" type="button" aria-label="Next image" @click="go(1)">
        <font-awesome-icon icon="chevron-right" aria-hidden="true" />
      </button>
    </template>
  </div>
</template>

<script>
export default {
  name: "Lightbox",
  props: {
    // [{ src, caption, alt }]
    items: { type: Array, default: () => [] },
    index: { type: Number, default: 0 },
    open: { type: Boolean, default: false },
    // Section heading, for the dialog's accessible name
    title: { type: String, default: "" },
  },
  emits: ["close", "update:index"],
  data() {
    return { touchX: null, touchY: null, opener: null, zoomed: false, wide: false };
  },
  computed: {
    current() {
      return this.items[this.index] || null;
    },
    // The alt text is the longer description; show it unless it just repeats the caption.
    description() {
      const c = this.current;
      if (!c || !c.alt) return "";
      const norm = (s) => (s || "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
      return norm(c.alt) === norm(c.caption) ? "" : c.alt;
    },
    label() {
      return this.title ? `${this.title}: image viewer` : "Image viewer";
    },
  },
  watch: {
    open(isOpen) {
      if (isOpen) {
        this.opener = document.activeElement;
        this.zoomed = false;
        // Keys work wherever focus is (clicking the image moves focus to the page body)
        document.addEventListener("keydown", this.onKey);
        document.documentElement.classList.add("lightbox-open");
        this.$nextTick(() => this.$refs.closeBtn && this.$refs.closeBtn.focus());
      } else {
        this.release();
      }
    },
    index() {
      this.zoomed = false;
      this.preload();
    },
  },
  beforeUnmount() {
    this.release();
  },
  methods: {
    close() {
      this.$emit("close");
    },
    release() {
      document.removeEventListener("keydown", this.onKey);
      document.documentElement.classList.remove("lightbox-open");
      if (this.opener && this.opener.focus) this.opener.focus();
      this.opener = null;
    },
    // Wraps around at either end.
    go(step) {
      const n = this.items.length;
      if (n < 2) return;
      this.$emit("update:index", (this.index + step + n) % n);
    },
    preload() {
      [1, -1].forEach((d) => {
        const it = this.items[(this.index + d + this.items.length) % this.items.length];
        if (it) new Image().src = it.src;
      });
    },
    onKey(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        this.close();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        this.go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        this.go(-1);
      } else if (e.key === "Tab") {
        // Keep focus inside the dialog
        const f = [...this.$el.querySelectorAll("button")];
        if (!f.length) return;
        const i = f.indexOf(document.activeElement);
        const next = e.shiftKey ? (i <= 0 ? f.length - 1 : i - 1) : i === f.length - 1 ? 0 : i + 1;
        e.preventDefault();
        f[next].focus();
      }
    },
    onImgLoad(e) {
      const img = e.target;
      this.wide = window.matchMedia("(max-width: 600px)").matches && img.naturalWidth > img.naturalHeight * 1.3;
    },
    toggleZoom() {
      if (!this.wide) return;
      this.zoomed = !this.zoomed;
    },
    onTouchStart(e) {
      const t = e.changedTouches[0];
      this.touchX = t.clientX;
      this.touchY = t.clientY;
    },
    // Horizontal swipe of 40px+ (and more sideways than vertical) changes image.
    onTouchEnd(e) {
      if (this.touchX === null || this.zoomed) return; // zoomed: a sideways swipe scrolls the image
      const t = e.changedTouches[0];
      const dx = t.clientX - this.touchX;
      const dy = t.clientY - this.touchY;
      this.touchX = this.touchY = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) this.go(dx < 0 ? 1 : -1);
    },
  },
};
</script>

<style>
/* No page scroll behind the viewer */
html.lightbox-open,
html.lightbox-open body {
  overflow: hidden;
}
</style>

<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(20, 26, 30, 0.94);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 72px 24px;
  color: #fff;
}
.close {
  margin-left: auto; /* stays top right even when there's no counter */
}
.top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px 0 20px;
}
.counter {
  margin: 0;
  font-size: 0.9em;
  opacity: 0.8;
}
.stage {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  max-width: 100%;
  max-height: 100%;
  min-height: 0;
}
.img {
  display: block;
  max-width: 100%;
  max-height: calc(100vh - 64px - 24px - 96px);
  max-height: calc(100dvh - 64px - 24px - 96px);
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 6px;
  background: #fff;
}
.frame {
  max-width: 100%;
  display: flex;
  justify-content: center;
}
.hint {
  margin: -4px 0 0;
  font-size: 0.85em;
  opacity: 0.7;
}
.stage.zoomed {
  width: 100%;
}
.stage.zoomed .frame {
  width: 100%;
  overflow-x: auto;
  justify-content: flex-start;
  -webkit-overflow-scrolling: touch;
}
.stage.zoomed .img {
  max-width: none;
  max-height: none;
  height: calc(100vh - 64px - 84px - 96px);
  height: calc(100dvh - 64px - 84px - 96px);
  width: auto;
  cursor: zoom-out;
}
.caption {
  max-width: 640px;
  text-align: center;
  line-height: 1.45;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.caption span {
  opacity: 0.8;
  font-size: 0.95em;
}
.lb-btn {
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
  border: 0;
  cursor: pointer;
}
.lb-btn:hover,
.lb-btn:focus-visible {
  background: var(--main-highlight);
  color: var(--main-charcoal);
  transform: none;
}
.lb-btn:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}
.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.nav:hover,
.nav:focus-visible {
  transform: translateY(-50%);
}
.prev {
  left: 16px;
}
.next {
  right: 16px;
}
/* Phones: image uses the full width; arrows sit at the bottom corners, swipe also works */
@media (max-width: 600px) {
  .lightbox {
    padding: 64px 12px 84px;
  }
  .img {
    max-height: calc(100vh - 64px - 84px - 80px);
    max-height: calc(100dvh - 64px - 84px - 80px);
  }
  .nav {
    top: auto;
    bottom: 20px;
    transform: none;
  }
  .nav:hover,
  .nav:focus-visible {
    transform: none;
  }
  .prev {
    left: 20px;
  }
  .next {
    right: 20px;
  }
}
</style>
