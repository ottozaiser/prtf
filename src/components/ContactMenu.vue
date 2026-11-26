<template>
  <div class="contact-menu" ref="root" @keydown.esc="close(true)">
    <!-- Desktop: a yellow "Get in touch" button that opens a small dropdown.
         Mobile (inside the slide-out menu): the same button expands/collapses the options below it. -->
    <button
      ref="toggle"
      class="cta"
      type="button"
      aria-haspopup="true"
      :aria-expanded="open.toString()"
      aria-controls="contact-options"
      @click="open ? close() : show()"
    >
      Get in touch
      <font-awesome-icon icon="chevron-down" class="caret" :class="{ up: open }" aria-hidden="true" />
    </button>

    <ul id="contact-options" class="options" :class="{ open }">
      <li>
        <button type="button" class="option" @click="copyEmail">
          <font-awesome-icon :icon="copied ? 'check' : 'copy'" class="icon" aria-hidden="true" />
          <span class="label">{{ copied ? "Copied!" : "Copy email" }}</span>
        </button>
      </li>
      <li>
        <a class="option" :href="`mailto:${email}?subject=${encodeURIComponent('Hi Otto')}`" @click="close()">
          <font-awesome-icon icon="envelope" class="icon" aria-hidden="true" />
          <span class="label">Email me</span>
        </a>
      </li>
      <li v-if="linkedin">
        <a class="option" :href="linkedin" target="_blank" rel="noopener" @click="close()">
          <font-awesome-icon :icon="['fab', 'linkedin']" class="icon" aria-hidden="true" />
          <span class="label">LinkedIn</span>
        </a>
      </li>
      <li v-if="cv">
        <a class="option" :href="cv" download @click="close()">
          <font-awesome-icon icon="download" class="icon" aria-hidden="true" />
          <span class="label">Download CV</span>
        </a>
      </li>
    </ul>
    <!-- Announces "Email copied" to screen readers -->
    <span class="sr-only" aria-live="polite">{{ copied ? "Email address copied to clipboard" : "" }}</span>
  </div>
</template>

<script>
export default {
  name: "ContactMenu",
  props: {
    email: { type: String, required: true },
    linkedin: { type: String, default: "" },
    cv: { type: String, default: "" },
  },
  data() {
    return { open: false, copied: false, copiedTimer: null };
  },
  beforeUnmount() {
    document.removeEventListener("click", this.onOutsideClick);
    clearTimeout(this.copiedTimer);
  },
  methods: {
    show() {
      this.open = true;
      document.addEventListener("click", this.onOutsideClick);
    },
    close(returnFocus = false) {
      if (!this.open) return;
      this.open = false;
      document.removeEventListener("click", this.onOutsideClick);
      if (returnFocus && this.$refs.toggle) this.$refs.toggle.focus();
    },
    onOutsideClick(e) {
      if (this.$refs.root && !this.$refs.root.contains(e.target)) this.close();
    },
    async copyEmail() {
      try {
        await navigator.clipboard.writeText(this.email);
      } catch {
        // Older browsers / non-secure contexts: fall back to a hidden textarea.
        const ta = document.createElement("textarea");
        ta.value = this.email;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      this.copied = true;
      clearTimeout(this.copiedTimer);
      this.copiedTimer = setTimeout(() => (this.copied = false), 2000);
    },
  },
};
</script>

<style scoped>
.contact-menu {
  position: relative;
}
.cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 0;
  border-radius: 1.5em;
  background: var(--main-highlight);
  color: var(--main-charcoal);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.cta:hover,
.cta:focus-visible {
  box-shadow: 0 0 0 2px var(--main-charcoal);
}
.caret {
  font-size: 0.75em;
  transition: transform 0.2s ease;
}
.caret.up {
  transform: rotate(180deg);
}
.options {
  list-style: none;
  margin: 0;
  padding: 6px;
  position: absolute;
  right: 0; /* right-aligned with the "Get in touch" button, at least as wide, wider if a label needs it */
  min-width: 100%;
  width: max-content;
  top: calc(100% + 8px);
  background: #fff;
  border: 1px solid var(--main-lightgray);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(30, 41, 48, 0.12);
  z-index: 20;
  display: none;
}
.options.open {
  display: block;
}
.option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--main-charcoal);
  font: inherit;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
}
.option:hover,
.option:focus-visible {
  background: var(--main-bg-color);
}
.icon {
  width: 1.1em;
  flex-shrink: 0;
}
.label {
  display: block;
  white-space: nowrap;
}
/* MainNav styles every link inside the menu globally (display:block, big padding, bottom border).
   Re-assert the option layout with a more specific selector so those rules don't leak in. */
nav.main-navigation ul.menu li.menu-item .contact-menu a.option,
nav.main-navigation ul.menu li.menu-item .contact-menu a.option:hover,
nav.main-navigation ul.menu li.menu-item .contact-menu a.option:focus {
  display: flex;
  flex-grow: 0;
  width: 100%;
  padding: 8px 10px;
  border-bottom: 0;
  color: var(--main-charcoal);
  transform: none;
}
nav.main-navigation ul.menu li.menu-item .contact-menu a.option:hover,
nav.main-navigation ul.menu li.menu-item .contact-menu a.option:focus-visible {
  background: var(--main-bg-color);
}
/* Mobile slide-out menu: the button expands/collapses the options in place (accordion),
   aligned with the other menu items. Collapsed options are hidden from tab order too. */
@media (max-width: 991px) {
  /* Full-width button at the end of the drawer list; the options box matches its width. */
  .contact-menu {
    display: block;
    margin: 20px 24px;
  }
  /* Touch targets: at least 44px tall (Apple HIG / WCAG 2.5.5) */
  .cta {
    width: 100%;
    justify-content: center;
    min-height: 44px;
    padding: 10px 18px;
  }
  .option,
  nav.main-navigation ul.menu li.menu-item .contact-menu a.option,
  nav.main-navigation ul.menu li.menu-item .contact-menu a.option:hover,
  nav.main-navigation ul.menu li.menu-item .contact-menu a.option:focus {
    min-height: 44px;
  }
  .options {
    display: block;
    position: static;
    width: auto;
    box-shadow: none;
    max-height: 0;
    margin-top: 0;
    padding: 0 6px;
    overflow: hidden;
    border-width: 0;
    border-color: transparent;
    visibility: hidden;
    transition: max-height 0.25s ease, margin-top 0.25s ease, padding 0.25s ease, border-color 0.25s ease,
      visibility 0s linear 0.25s;
  }
  .options.open {
    max-height: 260px;
    margin-top: 8px;
    padding: 6px;
    border-width: 1px;
    border-color: var(--main-lightgray);
    visibility: visible;
    transition: max-height 0.25s ease, margin-top 0.25s ease, padding 0.25s ease, border-color 0.25s ease,
      visibility 0s;
  }
}
@media (max-width: 991px) and (prefers-reduced-motion: reduce) {
  .options,
  .options.open {
    transition: none;
  }
}
</style>
