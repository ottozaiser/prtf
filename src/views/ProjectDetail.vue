<template>
  <div class="project-detail wrapper" v-if="loaded">
    <article v-if="project">
      <header class="intro">
        <!-- The yellow flag runs from the top of the browser down to the title's first word,
             like the page titles on Resume and Portfolio. -->
        <h1 class="case-title"><span class="highlight flag">{{ firstWord }}</span>{{ restOfTitle }}</h1>
        <p v-if="detail.summary" class="summary">{{ detail.summary }}</p>
      </header>

      <!-- Hero: work (detail.hero) when set, else the card cover. When the hero is a section's own
           image, that section is shown here instead (see sections below). -->
      <figure class="hero" :class="{ 'hero-work': detail.hero }">
        <button
          v-if="detail.hero"
          type="button"
          class="zoom"
          :aria-label="`Open image${heroSection && heroSection.caption ? ': ' + heroSection.caption : ''}`"
          @click="openHero"
        >
          <progressive-img
            :src="media(detail.hero)"
            :alt="(heroSection && heroSection.alt) || detail.heroAlt || project.title"
            :style="detail.heroWidth ? { maxWidth: `${detail.heroWidth}px` } : null"
          />
        </button>
        <progressive-img v-else :src="media(project.image)" :alt="project.title" />
      </figure>
      <p v-if="heroSection && heroSection.caption" class="hero-caption">{{ heroSection.caption }}</p>

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
          <!-- &nbsp; keeps the arrow on the label's last line when it wraps -->
          {{ j.label }}&nbsp;<span aria-hidden="true">↓</span>
        </router-link>
      </nav>

      <section
        v-for="(s, i) in detail.sections || []"
        v-show="!isHeroSection(s)"
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
          <!-- Tap to open full screen -->
          <button
            type="button"
            class="zoom"
            :aria-label="`Open image${s.caption ? ': ' + s.caption : ''}`"
            @click="openImage(i)"
          >
            <progressive-img
              :src="media(s.image)"
              :alt="s.alt || s.caption || ''"
              loading="lazy"
              :style="s.width ? { maxWidth: `${s.width}px` } : null"
            />
          </button>
          <figcaption v-if="s.caption">{{ s.caption }}</figcaption>
        </figure>

        <!-- Self-hosted clip (.mp4): plays muted on loop like a GIF, with controls; no autoplay
             for visitors who prefer reduced motion -->
        <figure v-if="s.video && isClip(s.video)" class="media clip">
          <video
            :src="href(s.video)"
            :poster="s.poster ? media(s.poster) : null"
            muted
            loop
            playsinline
            controls
            preload="metadata"
            :aria-label="s.caption || `${project.title} video`"
            :style="s.width ? { maxWidth: `${s.width}px` } : null"
          ></video>
          <figcaption v-if="s.caption">{{ s.caption }}</figcaption>
        </figure>

        <figure
          v-else-if="s.video"
          class="media video"
          :style="s.width ? { maxWidth: `${s.width}px`, marginLeft: 'auto', marginRight: 'auto' } : null"
        >
          <div class="ratio" :style="{ paddingTop: ratioPadding(s.ratio) }">
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

        <!-- Thumbnail grid (e.g. wireframes); each item can link somewhere, like a page of a PDF -->
        <div
          v-if="s.gallery && s.gallery.length"
          class="gallery"
          :style="{
            '--cols': s.columns || 3,
            '--cols-mobile': s.columnsMobile || ((s.columns || 3) >= 4 ? 3 : Math.min(s.columns || 3, 2)),
            maxWidth: s.width ? s.width + 'px' : null,
          }"
        >
          <figure v-for="(g, j) in s.gallery" :key="j" class="gallery-item" :class="g.shape ? 'shape-' + g.shape : null">
            <a v-if="g.link" :href="href(g.link)" target="_blank" rel="noopener" :aria-label="`${g.caption || 'Image'} (opens in a new tab)`">
              <progressive-img :src="media(g.image)" :alt="g.alt || g.caption || ''" loading="lazy" />
            </a>
            <!-- Tap to open full screen, then move through the rest of this gallery -->
            <button
              v-else
              type="button"
              class="zoom"
              :aria-label="`Open image${g.caption ? ': ' + g.caption : ''}`"
              @click="openGallery(i, j)"
            >
              <progressive-img :src="media(g.image)" :alt="g.alt || g.caption || ''" loading="lazy" />
            </button>
            <figcaption v-if="g.caption">{{ g.caption }}</figcaption>
          </figure>
        </div>

        <p v-if="(s.link && s.link.url) || (s.links && s.links.length)" class="link">
          <a
            v-for="(l, k) in [s.link, ...(s.links || [])].filter((l) => l && l.url)"
            :key="k"
            class="btn btn-small"
            :href="href(l.url)"
            target="_blank"
            rel="noopener"
          >
<!-- srText: words only screen readers hear, before the visible label ("Word Yatzy on" + "Google Play") -->
            <span v-if="l.srText" class="sr-only">{{ l.srText }}&nbsp;</span>{{ l.label || l.url }}
            <font-awesome-icon :icon="['fa', 'external-link-alt']" aria-hidden="true" />
          </a>
        </p>
      </section>

      <!-- Next step for a recruiter who read to the end -->
      <aside v-if="settings && settings.contact_email" class="hire" aria-labelledby="hire-title">
        <p id="hire-title" class="hire-title">Hiring a product designer for mobile games?</p>
        <div class="hire-actions">
          <!-- Copy email / Email me / LinkedIn / CV: works for people without a mail app too -->
          <ContactMenu
            variant="hero"
            :email="settings.contact_email"
            :linkedin="settings.linkedin_url"
            :cv="settings.cv_url"
          />
          <a v-if="settings.cv_url" class="btn" :href="settings.cv_url" download>
            <font-awesome-icon icon="download" aria-hidden="true" />
            Download CV
          </a>
        </div>
      </aside>

      <!-- The other public cases, as the same cards used on the Portfolio page -->
      <section v-if="others.length" class="more" aria-labelledby="more-title">
        <div class="more-head">
          <h2 id="more-title"><span class="highlight">More</span> projects</h2>
          <!-- Desktop: each arrow scrolls the row by a whole page of 3 projects (wraps around).
               Phones: hidden; the row is swiped instead. -->
          <div v-if="morePages > 1" class="more-nav">
            <button class="icon-btn" type="button" aria-label="Previous projects" aria-controls="more-track" @click="turnPage(-1)">
              <font-awesome-icon icon="chevron-left" aria-hidden="true" />
            </button>
            <button class="icon-btn" type="button" aria-label="Next projects" aria-controls="more-track" @click="turnPage(1)">
              <font-awesome-icon icon="chevron-right" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div id="more-track" ref="moreTrack" class="more-track">
          <Project
            v-for="p in others"
            :key="p.slug"
            class="more-slide"
            :show="true"
            :title="p.title"
            :content="p.content"
            :file="p.file"
            :cover="p.image"
            :slug="p.slug"
          />
          <!-- Empty slots so the last page lines up as a full page of 3 -->
          <div v-for="n in moreSpacers" :key="`spacer-${n}`" class="more-spacer" aria-hidden="true"></div>
        </div>
      </section>
      <Lightbox
        :open="lightbox.open"
        :items="lightbox.items"
        v-model:index="lightbox.index"
        :title="lightbox.title"
        @close="lightbox.open = false"
      />
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
import Project from "@/components/Project.vue";
import Lightbox from "@/components/Lightbox.vue";
import ContactMenu from "@/components/ContactMenu.vue";

export default {
  name: "ProjectDetail",
  components: { Project, Lightbox, ContactMenu },
  props: { slug: { type: String, required: true } },
  data() {
    return {
      projects: [],
      settings: null,
      loaded: false,
      lightbox: { open: false, items: [], index: 0, title: "" },
      morePage: 0,
      reduceMotion: typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    };
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
    // Every other public case, in portfolio order, for the "More projects" grid.
    others() {
      return this.visible.filter((p) => p.slug !== this.slug);
    },
    // Pages of 3 for the desktop carousel.
    morePages() {
      return Math.ceil(this.others.length / 3);
    },
    moreSpacers() {
      return this.morePages * 3 - this.others.length;
    },
    // When the hero is the page's first image and that section has nothing else (no heading or
    // text), the section moves up into the hero instead of showing the same image twice.
    heroSection() {
      const h = this.detail.hero;
      const first = (this.detail.sections || []).find((s) => s.image);
      return h && first && first.image === h && !first.heading && !first.text && !(first.list && first.list.length)
        ? first
        : null;
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
        document.title = p ? `${p.title} – Otto Zaiser` : "Project not found – Otto Zaiser";
      },
    },
    // New case (or data just loaded): jump the carousel back to its first page,
    // and hook up the new page's video clips.
    others() {
      this.morePage = 0;
      this.$nextTick(() => {
        this.scrollToPage(false);
        this.setupClips();
      });
    },
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
    if (this.clipObserver) this.clipObserver.disconnect();
  },
  created() {
    // Contact email and CV link for the "Hiring…?" prompt; the page works without it.
    axios
      .get("/_data/settings.json")
      .then((response) => {
        this.settings = response.data;
      })
      .catch(() => {});
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
        // The article renders only once loaded, so hook up clips after that render.
        this.$nextTick(() => this.setupClips());
      });
  },
  methods: {
    // Full-screen viewer. A gallery opens on the tapped image and steps through that gallery only
    // (images that link to a file, like PDF pages, keep their link). A single image opens alone.
    openGallery(sectionIndex, itemIndex) {
      const s = this.detail.sections[sectionIndex];
      const withIndex = s.gallery.map((g, j) => ({ g, j })).filter(({ g }) => g.image && !g.link);
      this.lightbox = {
        open: true,
        items: withIndex.map(({ g }) => ({ src: this.media(g.image), caption: g.caption || "", alt: g.alt || "" })),
        index: Math.max(0, withIndex.findIndex(({ j }) => j === itemIndex)),
        title: this.sectionTitle(sectionIndex),
      };
    },
    isHeroSection(s) {
      return s === this.heroSection;
    },
    openHero() {
      const s = this.heroSection;
      this.lightbox = {
        open: true,
        items: [{ src: this.media(this.detail.hero), caption: (s && s.caption) || "", alt: (s && s.alt) || this.detail.heroAlt || "" }],
        index: 0,
        title: (this.project && this.project.title) || "",
      };
    },
    openImage(sectionIndex) {
      const s = this.detail.sections[sectionIndex];
      this.lightbox = {
        open: true,
        items: [{ src: this.media(s.image), caption: s.caption || "", alt: s.alt || "" }],
        index: 0,
        title: this.sectionTitle(sectionIndex),
      };
    },
    // Nearest heading at or above this section, e.g. "The final game" for its untitled galleries.
    sectionTitle(sectionIndex) {
      const secs = this.detail.sections || [];
      for (let k = sectionIndex; k >= 0; k--) if (secs[k].heading) return secs[k].heading;
      return (this.project && this.project.title) || "";
    },
    // Scroll to the previous/next page of 3 projects, wrapping around at either end.
    turnPage(dir) {
      this.morePage = (this.morePage + dir + this.morePages) % this.morePages;
      this.scrollToPage(true);
    },
    // One page = the track's visible width plus one gap (3 cards + 3 gaps).
    scrollToPage(smooth) {
      const track = this.$refs.moreTrack;
      if (!track) return;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      track.scrollTo({ left: this.morePage * (track.clientWidth + gap), behavior: smooth && !reduceMotion ? "smooth" : "auto" });
    },
    // Keep the current page aligned if the window is resized (desktop only: on phones the row is
    // swiped freely, and mobile browsers fire resize when the address bar shows/hides).
    onResize() {
      if (window.matchMedia("(max-width: 760px)").matches) return;
      this.scrollToPage(false);
    },
    // CMS image paths are stored as /public/_data/...; the site serves them from /_data/...
    media(path) {
      return (path || "").split("/public").pop();
    },
    // Links: site files stored CMS-style (/public/_data/...) are rewritten; external URLs untouched.
    href(url) {
      return (url || "").startsWith("/public/") ? this.media(url) : url;
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
    // Self-hosted clips play like GIFs: muted, looping, and only while on screen (paused when
    // scrolled away). Muting must be set on the element before play(), or browsers block autoplay.
    // Visitors who prefer reduced motion get the controls but no autoplay.
    setupClips() {
      if (this.clipObserver) this.clipObserver.disconnect();
      const videos = this.$el && this.$el.querySelectorAll ? this.$el.querySelectorAll(".clip video") : [];
      if (!videos.length || this.reduceMotion || !("IntersectionObserver" in window)) return;
      this.clipObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            const v = e.target;
            if (e.isIntersecting) {
              v.muted = true;
              v.play().catch(() => {});
            } else {
              v.pause();
            }
          });
        },
        { threshold: 0.25 }
      );
      videos.forEach((v) => {
        v.muted = true;
        this.clipObserver.observe(v);
      });
    },
    // A self-hosted video file (vs. a Vimeo/YouTube link).
    isClip(video) {
      return /\.(mp4|webm)(\?|#|$)/i.test(video || "");
    },
    // Video frame height as a % of its width, from a ratio like "4:3" (default 16:9).
    ratioPadding(ratio) {
      const m = /^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/.exec((ratio || "").trim());
      return m ? `${(Number(m[2]) / Number(m[1])) * 100}%` : "56.25%";
    },
    // Accepts a Vimeo URL, a YouTube URL, or a bare YouTube video ID.
    embedUrl(video) {
      const v = (video || "").trim();
      // Also accepts Vimeo "manage" links (vimeo.com/manage/videos/<id>) pasted from the dashboard.
      const vimeo = v.match(/vimeo\.com\/(?:manage\/videos\/|video\/)?(\d+)/);
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
/* Yellow flag: starts at the very top of the page and hugs the title's first word,
   like the page titles elsewhere on the site. */
.case-title .flag {
  display: inline-block;
  padding: 120px 0 0;
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
.hero {
  margin: 0;
}
.hero img {
  display: block;
  width: 100%;
  height: auto;
  margin: 0 auto;
}
.hero-caption {
  margin: 10px 0 0;
  color: var(--main-txt-gray);
  font-size: 0.95em;
  line-height: 1.5;
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
  margin: 10px 0;
}
.notes li:first-child {
  margin-top: 4px;
}
.notes li:last-child {
  margin-bottom: 4px;
}
/* A dash per note, so two-line notes on phones don't read as one paragraph */
.notes li::before {
  content: "– ";
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
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0 0;
}
/* Thumbnail grid: --cols per row (default 3); fewer on phones (--cols-mobile) */
.gallery {
  display: grid;
  /* minmax(0, 1fr): long captions ("Backgammon") can't widen their column and shrink the others */
  grid-template-columns: repeat(var(--cols, 3), minmax(0, 1fr));
  gap: 16px;
  margin: 24px auto 0; /* centered when a section sets a max width */
  align-items: start;
}
/* Self-hosted clips */
.clip video {
  display: block;
  width: 100%;
  height: auto;
  margin: 0 auto; /* portrait phone clips use a max width and sit centered */
  border-radius: 4px;
  background: #000;
}
.clip figcaption {
  text-align: center;
}
.gallery-item {
  margin: 0;
}
.gallery-item img {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid var(--main-lightgray);
  border-radius: 4px;
  background: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.gallery-item a:hover img,
.gallery-item a:focus-visible img {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(30, 41, 48, 0.12);
}
.gallery-item figcaption {
  margin-top: 6px;
  font-size: 0.85em;
  overflow-wrap: break-word;
  hyphens: auto; /* "Backgam-mon" instead of "Backgamm/on" in narrow columns */
}
/* Tap-to-open images: a bare button around the image */
.zoom {
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
  cursor: zoom-in;
  border-radius: 4px;
}
.media .zoom img {
  margin: 0 auto;
}
.zoom:focus-visible {
  outline: 2px solid var(--main-charcoal);
  outline-offset: 3px;
}
.gallery-item .zoom:hover img,
.gallery-item .zoom:focus-visible img {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(30, 41, 48, 0.12);
}
/* App icons: shown the way they look on a phone (rounded square or circle), no frame */
.gallery-item.shape-icon img,
.gallery-item.shape-round img {
  border: 0;
  border-radius: 22.5%;
  box-shadow: 0 4px 14px rgba(30, 41, 48, 0.18);
}
.gallery-item.shape-round img {
  border-radius: 50%;
}
.gallery-item.shape-icon figcaption,
.gallery-item.shape-round figcaption,
.gallery-item.shape-cutout figcaption {
  text-align: center;
}
/* Characters on a white background, shown without a frame: multiply blends the white into the page.
   Same height for every figure in the row; wide poses shrink to fit their column. */
.gallery-item.shape-cutout img {
  width: 100%;
  height: clamp(120px, 26vw, 220px);
  object-fit: contain;
  border: 0;
  border-radius: 0;
  background: transparent;
  mix-blend-mode: multiply;
}
@media (max-width: 600px) {
  .gallery {
    grid-template-columns: repeat(var(--cols-mobile, 2), minmax(0, 1fr));
    gap: 12px;
  }
}
.link .btn-small {
  display: inline-block;
}
/* Very narrow phones: store buttons no longer fit side by side, so stack them at full width */
@media (max-width: 400px) {
  .link .btn-small {
    flex: 1 1 100%;
  }
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
/* "Hiring a product designer…?" prompt between the case and More projects */
.hire {
  margin-top: 96px;
  padding: 24px;
  border: 2px solid var(--main-highlight);
  border-radius: 4px;
  background: #fff;
}
.hire-title {
  font-size: 1.25em;
  font-weight: bold;
  line-height: 1.3;
  color: var(--main-charcoal);
  margin: 0 0 16px;
}
.hire-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.hire .contact-menu {
  width: auto;
}
.hire .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 10px 20px;
}
.hire .btn.primary {
  background: var(--main-highlight);
  border-color: var(--main-highlight);
  font-weight: 600;
}
.hire .btn.primary:hover,
.hire .btn.primary:focus-visible {
  color: var(--main-charcoal);
  box-shadow: 0 0 0 2px var(--main-charcoal);
}
@media (max-width: 480px) {
  .hire .btn,
  .hire .contact-menu {
    flex: 1 1 100%;
    width: 100%;
  }
}
.hire + .more {
  margin-top: 64px;
}
.more {
  margin-top: 96px;
  padding-top: 32px;
  border-top: 1px solid var(--main-lightgray);
}
.more-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 0 0 16px;
}
.more h2 {
  font-size: 1.5em; /* site h2 size */
  margin: 0;
  color: var(--main-charcoal);
}
.more-nav {
  display: flex;
  gap: 8px;
}
.more-nav .icon-btn {
  border: 1px solid var(--main-charcoal);
  cursor: pointer;
}
/* Desktop: one row of cards, 3 visible; the arrows scroll it a whole page at a time. */
.more-track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: calc((100% - 2 * 16px) / 3);
  column-gap: 16px;
  overflow-x: hidden;
  padding: 8px 0 4px; /* room for the cards' hover lift */
}
/* Phones: no arrows; swipe the row, one card plus a peek of the next. */
@media (max-width: 760px) {
  .more-nav,
  .more-spacer {
    display: none;
  }
  .more-track {
    grid-auto-columns: 82%;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
  }
  .more-track::-webkit-scrollbar {
    display: none;
  }
  .more-slide {
    scroll-snap-align: start;
  }
}
.missing {
  padding: 48px 0;
}
.missing .btn {
  display: inline-block;
  margin-top: 16px;
}
</style>
