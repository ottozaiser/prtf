<template>
  <div class="project-detail wrapper" v-if="loaded">
    <article v-if="project">
      <header class="intro">
        <!-- The yellow flag runs from the top of the browser down to the title's first word,
             and carries the way back to the portfolio. -->
        <router-link class="back" to="/#portfolio">
          <span aria-hidden="true">←</span> Portfolio
        </router-link>
        <h1 class="case-title"><span class="highlight flag">{{ firstWord }}</span>{{ restOfTitle }}</h1>
        <p v-if="detail.summary" class="summary">{{ detail.summary }}</p>
      </header>

      <div class="hero">
        <progressive-img :src="media(project.image)" :alt="project.title" />
      </div>

      <h2 v-if="detail.client || detail.context || detail.role" class="facts-title">
        <span class="highlight">Overview</span>
      </h2>
      <div class="facts">
        <section v-if="detail.client">
          <h3>About</h3>
          <p v-for="(p, i) in paragraphs(detail.client)" :key="i">{{ p }}</p>
        </section>
        <section v-if="detail.context">
          <h3>Context</h3>
          <p v-for="(p, i) in paragraphs(detail.context)" :key="i">{{ p }}</p>
        </section>
        <section v-if="detail.role">
          <h3>My role</h3>
          <p>{{ detail.role }}</p>
        </section>
      </div>
      <aside v-if="detail.notes && detail.notes.length" class="notes">
        <p class="notes-title">Notes</p>
        <ul>
          <li v-for="(n, i) in detail.notes" :key="i">{{ n }}</li>
        </ul>
      </aside>

      <!-- Jump buttons to the main parts of a long case page (e.g. Visual identity / Case study) -->
      <nav v-if="detail.jumps && detail.jumps.length" class="jumps" aria-label="On this page">
        <router-link
          v-for="(j, i) in detail.jumps"
          :key="i"
          class="btn"
          :to="{ hash: `#${j.target}` }"
        >
          {{ j.label }} <span aria-hidden="true">↓</span>
        </router-link>
      </nav>

      <section
        v-for="(s, i) in detail.sections || []"
        :key="i"
        :id="s.id || null"
        class="block"
        :class="{ side: s.layout === 'side' && s.image }"
      >
        <figure v-if="s.layout === 'side' && s.image" class="media">
          <progressive-img :src="media(s.image)" :alt="s.alt || s.caption || ''" loading="lazy" />
        </figure>

        <div class="copy" v-if="s.heading || s.text || (s.list && s.list.length) || (s.tech && s.tech.length)">
          <!-- level 3 = subheading inside a part (no highlight); default = section heading -->
          <h3 v-if="s.heading && s.level === 3">{{ s.heading }}</h3>
          <h2 v-else-if="s.heading"><span class="highlight">{{ splitFirst(s.heading)[0] }}</span>{{ splitFirst(s.heading)[1] }}</h2>
          <p v-for="(p, j) in paragraphs(s.text)" :key="j">{{ p }}</p>
          <ul v-if="s.list && s.list.length" class="list">
            <li v-for="(item, j) in s.list" :key="j">{{ item }}</li>
          </ul>
          <ul v-if="s.tech && s.tech.length" class="tech" aria-label="Technologies">
            <li v-for="(t, j) in s.tech" :key="j">{{ t }}</li>
          </ul>
        </div>

        <aside v-if="s.notes && s.notes.length" class="notes">
          <ul>
            <li v-for="(n, j) in s.notes" :key="j">{{ n }}</li>
          </ul>
        </aside>

        <figure v-if="s.image && s.layout !== 'side'" class="media" :class="{ device: s.device, wide: s.wide }">
          <!-- width: the image's real pixel width, so low-res screenshots are never stretched -->
          <progressive-img
            :src="media(s.image)"
            :alt="s.alt || s.caption || ''"
            loading="lazy"
            :style="s.width ? { maxWidth: `${s.width}px` } : null"
          />
          <figcaption v-if="s.caption">{{ s.caption }}</figcaption>
        </figure>

        <figure v-if="s.video" class="media video">
          <div class="ratio">
            <iframe
              :src="embedUrl(s.video)"
              :title="s.caption || `${project.title} video`"
              loading="lazy"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowfullscreen
            ></iframe>
          </div>
          <figcaption v-if="s.caption">{{ s.caption }}</figcaption>
        </figure>

        <p v-if="s.link && s.link.url" class="link">
          <a class="btn btn-small" :href="s.link.url" target="_blank" rel="noopener">
            {{ s.link.label || s.link.url }}
            <font-awesome-icon :icon="['fa', 'external-link-alt']" aria-hidden="true" />
          </a>
        </p>
      </section>

      <nav class="pager" aria-label="More projects">
        <router-link v-if="prev" class="prev" :to="`/portfolio/${prev.slug}`">
          <span class="dir">← Previous</span>
          <span class="name">{{ prev.title }}</span>
        </router-link>
        <span v-else></span>
        <router-link v-if="next" class="next" :to="`/portfolio/${next.slug}`">
          <span class="dir">Next →</span>
          <span class="name">{{ next.title }}</span>
        </router-link>
      </nav>
    </article>

    <div v-else class="missing">
      <router-link class="missing-back" to="/#portfolio"><span aria-hidden="true">←</span> Portfolio</router-link>
      <h1>Project not found</h1>
      <p>This project doesn’t exist or isn’t public anymore.</p>
      <router-link class="btn" to="/#portfolio">See all projects</router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ProjectDetail",
  props: { slug: { type: String, required: true } },
  data() {
    return { projects: [], loaded: false };
  },
  computed: {
    // Only public projects that have a detail page; hidden ones stay unreachable.
    visible() {
      return this.projects.filter((p) => p.show && p.slug && p.detail);
    },
    index() {
      return this.visible.findIndex((p) => p.slug === this.slug);
    },
    project() {
      return this.visible[this.index] || null;
    },
    detail() {
      return (this.project && this.project.detail) || {};
    },
    prev() {
      return this.index > 0 ? this.visible[this.index - 1] : null;
    },
    next() {
      return this.index >= 0 && this.index < this.visible.length - 1 ? this.visible[this.index + 1] : null;
    },
    firstWord() {
      const t = (this.project && this.project.title) || "";
      const cut = t.indexOf(" ");
      return cut === -1 ? t : t.slice(0, cut);
    },
    restOfTitle() {
      const t = (this.project && this.project.title) || "";
      const cut = t.indexOf(" ");
      return cut === -1 ? "" : t.slice(cut);
    },
  },
  watch: {
    project: {
      immediate: true,
      handler(p) {
        document.title = p ? `${p.title} - Otto Zaiser [Designer]` : "Project not found - Otto Zaiser [Designer]";
      },
    },
  },
  created() {
    axios
      .get("/_data/portfolio.json")
      .then((response) => {
        this.projects = response.data.portfolio.projects || [];
      })
      .catch((error) => {
        console.warn("Could not load portfolio.json", error);
      })
      .finally(() => {
        this.loaded = true;
      });
  },
  methods: {
    // CMS image paths are stored as /public/_data/...; the site serves them from /_data/...
    media(path) {
      return (path || "").split("/public").pop();
    },
    // ["First", " rest of heading"] — the first word gets the yellow highlight, like page titles.
    // Tiny leading words ("A", "My") take the next word along, so "A brand-new" is highlighted, not "A".
    splitFirst(text) {
      const words = (text || "").split(" ");
      let n = 1;
      while (n < words.length && words.slice(0, n).join(" ").length < 3) n++;
      const first = words.slice(0, n).join(" ");
      const rest = words.slice(n).join(" ");
      return [first, rest ? ` ${rest}` : ""];
    },
    // Accepts a Vimeo URL, a YouTube URL, or a bare YouTube video ID.
    embedUrl(video) {
      const v = (video || "").trim();
      const vimeo = v.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?dnt=1`;
      const yt = v.match(/(?:youtu\.be\/|[?&]v=|\/embed\/)([\w-]{11})/);
      return `https://www.youtube-nocookie.com/embed/${yt ? yt[1] : v}`;
    },
    paragraphs(text) {
      return (text || "")
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
    },
  },
};
</script>

<style scoped>
/* Case pages use one 760px column for everything (title, hero, text, images) — a comfortable
   reading width, and every edge lines up. 48px = the wrapper's 24px side padding. */
.project-detail.wrapper {
  max-width: calc(760px + 48px);
}
.project-detail {
  padding-top: 0;
  padding-bottom: 80px;
}
.intro {
  position: relative;
}
/* Yellow flag: starts at the very top of the page (no menu here) and ends under the first word.
   min-width keeps "← Portfolio" inside it even for short words like "BFA" or ".ar". */
.case-title .flag {
  display: inline-block;
  padding: 120px 10px 0;
  min-width: 150px;
}
.back {
  position: absolute;
  top: 24px;
  left: 10px;
  z-index: 1;
  font-size: 0.9em;
  font-weight: 600;
  color: var(--main-charcoal);
  text-decoration: none;
  white-space: nowrap;
}
.back:hover,
.back:focus {
  text-decoration: underline;
}
h1 {
  font-size: 2.4em;
  line-height: 1.15;
  margin: 0 0 16px;
}
.missing-back {
  display: inline-block;
  margin: 24px 0;
  color: var(--main-charcoal);
}
.summary {
  font-size: 1.25em;
  line-height: 1.5;
  color: var(--main-charcoal);
  margin: 0 0 32px;
}
.hero {
  border: 1px solid var(--main-lightgray);
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
}
.hero img {
  display: block;
  width: 100%;
  height: auto;
}
.facts-title {
  font-size: 1.5em; /* site h2 size */
  margin: 56px 0 16px;
  color: var(--main-charcoal);
}
/* About / Context / My role stacked vertically, one under the other. */
.facts {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin: 0 0 24px;
}
/* Heading scale, shared with the rest of the site:
   h2 = section heading, 1.5em (27px) like Resume / "Client list";
   h3 = label or subheading, 1.1em (19.8px) like the portfolio card titles. */
.copy h2 {
  font-size: 1.5em;
  margin: 0 0 12px;
  color: var(--main-charcoal);
}
.facts h3,
.copy h3 {
  font-size: 1.1em;
  margin: 0 0 8px;
  color: var(--main-charcoal);
}
.facts p,
.copy p {
  margin: 0 0 12px;
  line-height: 1.6;
}
/* Side notes: white box with a yellow outline and dark text. */
.notes {
  display: inline-block;
  background: #fff;
  border: 2px solid var(--main-highlight);
  border-radius: 4px;
  padding: 12px 16px;
  margin: 16px 0 24px;
  color: var(--main-charcoal);
  font-style: italic;
}
.notes ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.notes li {
  margin: 4px 0;
}
.notes-title {
  font-style: normal;
  font-weight: bold;
  color: var(--main-charcoal);
  margin: 0 0 4px;
}
.block {
  margin-top: 64px;
  scroll-margin-top: 24px;
}
.jumps {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 8px 0 0;
}
.jumps .btn {
  display: inline-block;
}
/* A section that starts a new part of the page (it has a jump target) gets a stronger heading,
   and some room above it so it doesn't sit flush against the top edge after a jump. */
.block[id] {
  margin-top: 56px;
  padding-top: 32px;
}
/* Every h2 on a case page: the highlight bleeds off to the left edge of the browser, like the title
   flag. It only extends into negative x (off-screen), so it never causes horizontal scrolling. */
.project-detail h2 .highlight {
  position: relative;
}
.project-detail h2 .highlight::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  right: 100%;
  width: 100vw;
  background: var(--main-highlight);
}
.list {
  padding-left: 20px;
  line-height: 1.6;
}
.list li {
  margin: 6px 0;
}
.media {
  margin: 24px 0 0;
}
.media img {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid var(--main-lightgray);
  border-radius: 4px;
  background: #fff;
}
/* Wide images break out of the text column up to their native 1218px, centered and never wider
   than the viewport (minus the page gutter), so slide screenshots show at 1:1 on desktop. */
.media.wide {
  width: min(1218px, calc(100vw - 48px));
  margin-left: 50%;
  transform: translateX(-50%);
}
/* Device mockups (iPad crops): the source screenshots are only ~590px wide, so never upscale
   them; round the corners to the iPad's own radius so no slide background shows. */
.media.device {
  text-align: center;
}
.media.device img {
  width: 100%;
  max-width: 587px;
  margin: 0 auto;
  border: 0;
  background: transparent;
  border-radius: 3.4% / 4.8%;
}
figcaption {
  margin-top: 10px;
  color: var(--main-txt-gray);
  font-size: 0.95em;
  line-height: 1.5;
}
.video .ratio {
  position: relative;
  padding-top: 56.25%;
  border-radius: 4px;
  overflow: hidden;
  background: #000;
}
.video iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
.tech {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
}
.tech li {
  font-size: 0.85em;
  padding: 4px 10px;
  border: 1px solid var(--main-lightgray);
  border-radius: 1.5em;
  background: #fff;
}
.link {
  margin: 16px 0 0;
}
.link .btn-small {
  display: inline-block;
}
.link svg {
  margin-left: 6px;
  font-size: 0.85em;
}
/* Image beside its text (Viñetas Sueltas years) */
.block.side {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 32px;
  align-items: start;
}
.block.side .media {
  margin: 0;
}
@media (max-width: 760px) {
  .case-title .flag {
    padding-top: 96px;
    min-width: 140px;
  }
  h1 {
    font-size: 1.9em;
  }
  .summary {
    font-size: 1.1em;
  }
  .block {
    margin-top: 48px;
  }
  .block.side {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
.pager {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 96px;
  padding-top: 24px;
  border-top: 1px solid var(--main-lightgray);
}
.pager a {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  border: 1px solid var(--main-lightgray);
  border-radius: 4px;
  text-decoration: none;
  color: var(--main-charcoal);
  transition: all 0.3s ease;
}
.pager a:hover,
.pager a:focus {
  transform: translate(0, -3px);
}
.pager .next {
  text-align: right;
}
.pager .dir {
  font-size: 0.85em;
  color: var(--main-txt-gray);
}
.pager .name {
  font-weight: bold;
}
.missing {
  padding: 48px 0;
}
.missing .btn {
  display: inline-block;
  margin-top: 16px;
}
</style>
