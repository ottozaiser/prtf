#!/usr/bin/env node
/*
 * Responsive check for otto.ar, mobile first.
 *
 * Loads every page (home, resume, portfolio, story and each case page from portfolio.json)
 * at several widths, smallest first, and:
 *   - saves screenshots in slices (easy to read at phone width)
 *   - runs automatic checks: horizontal overflow, small tap targets, tiny text,
 *     broken or soft (upscaled) images, console errors
 *   - opens the mobile menu at phone widths and screenshots it
 * Writes report.json and report.md to the output folder.
 *
 * Usage:
 *   node scripts/responsive-check.cjs [--base http://localhost:5173] [--out /tmp/responsive]
 *                                     [--widths 320,390,768,1280] [--only /portfolio/funcraft,/]
 * Needs the dev server (npm run dev) or a preview build running at --base.
 * Playwright: uses `playwright-core` if installed, else PLAYWRIGHT_CORE=/path/to/playwright-core.
 */
const fs = require("fs");
const path = require("path");

function loadPlaywright() {
  const tries = [process.env.PLAYWRIGHT_CORE, "playwright-core", "playwright"].filter(Boolean);
  for (const t of tries) {
    try {
      return require(t);
    } catch (e) {
      /* try next */
    }
  }
  console.error("playwright-core not found. Set PLAYWRIGHT_CORE=/path/to/node_modules/playwright-core");
  process.exit(1);
}

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith("--")) acc.push([a.slice(2), all[i + 1]]);
    return acc;
  }, [])
);
const BASE = (args.base || "http://localhost:5173").replace(/\/$/, "");
const OUT = path.resolve(args.out || "responsive-report");
const WIDTHS = (args.widths || "320,375,390,430,768,1024,1280,1440").split(",").map(Number).sort((a, b) => a - b);
const PHONE_MAX = 600;
const SLICE = 1400; // px per screenshot slice

function routes() {
  const root = path.resolve(__dirname, "..");
  const data = JSON.parse(fs.readFileSync(path.join(root, "public/_data/portfolio.json"), "utf8"));
  const cases = data.portfolio.projects.filter((p) => p.show && p.slug && p.detail).map((p) => `/portfolio/${p.slug}`);
  const all = ["/", "/resume", "/portfolio", "/story", ...cases];
  return args.only ? args.only.split(",") : all;
}

// Runs inside the page. Returns findings for this route + width.
function pageChecks({ phone }) {
  const vw = document.documentElement.clientWidth;
  const out = { overflow: null, wideElements: [], smallTargets: [], tinyText: [], brokenImages: [], softImages: [] };
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && cs.opacity !== "0";
  };
  const describe = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += "#" + el.id;
    if (el.classList.length) s += "." + [...el.classList].slice(0, 3).join(".");
    const t = (el.innerText || el.alt || el.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 40);
    return t ? `${s} "${t}"` : s;
  };
  // Ancestors that intentionally clip or scroll sideways (carousels, galleries)
  const clipped = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const ox = getComputedStyle(p).overflowX;
      if (ox === "hidden" || ox === "auto" || ox === "scroll" || ox === "clip") return true;
    }
    return false;
  };

  const sw = document.documentElement.scrollWidth;
  if (sw > vw + 1) out.overflow = { scrollWidth: sw, viewport: vw };

  for (const el of document.querySelectorAll("body *")) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if ((r.right > vw + 1 || r.left < -1) && !clipped(el) && getComputedStyle(el).position !== "fixed") {
      // only report the outermost offender
      const parent = el.parentElement && el.parentElement.getBoundingClientRect();
      if (!parent || !(parent.right > vw + 1 || parent.left < -1)) out.wideElements.push(`${describe(el)} (${Math.round(r.left)}..${Math.round(r.right)}px)`);
    }
  }

  if (phone) {
    for (const el of document.querySelectorAll("a, button, [role=button], input, select, summary")) {
      if (!visible(el)) continue;
      // WCAG 2.5.8 exception: links inside a sentence
      if (el.tagName === "A" && el.closest("p, li") && getComputedStyle(el).display === "inline") continue;
      const r = el.getBoundingClientRect();
      if (r.width < 44 || r.height < 44) out.smallTargets.push(`${describe(el)} ${Math.round(r.width)}x${Math.round(r.height)}`);
    }
    const seen = new Set();
    for (const el of document.querySelectorAll("body *")) {
      if (!visible(el) || !el.childNodes.length) continue;
      const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!hasText) continue;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < 12 && !el.closest(".sr-only")) {
        const k = describe(el);
        if (!seen.has(k)) {
          seen.add(k);
          out.tinyText.push(`${k} ${fs}px`);
        }
      }
    }
  }

  const dpr = 2; // judge sharpness for a retina phone
  for (const img of document.querySelectorAll("img")) {
    if (!visible(img)) continue;
    if (img.complete && img.naturalWidth === 0) out.brokenImages.push(img.currentSrc || img.src);
    const r = img.getBoundingClientRect();
    if (img.naturalWidth && r.width * dpr > img.naturalWidth * 1.5 && r.width > 120)
      out.softImages.push(`${(img.currentSrc || img.src).split("/").slice(-2).join("/")} shown ${Math.round(r.width)}px, file ${img.naturalWidth}px`);
  }
  for (const k of ["wideElements", "smallTargets", "tinyText", "softImages"]) {
    const n = out[k].length;
    out[k] = out[k].slice(0, 12);
    if (n > 12) out[k].push(`…and ${n - 12} more`);
  }
  return out;
}

(async () => {
  const { chromium } = loadPlaywright();
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || "chrome", headless: true });
  const report = [];
  const list = routes();
  for (const width of WIDTHS) {
    const phone = width <= PHONE_MAX;
    const ctx = await browser.newContext({ viewport: { width, height: phone ? 844 : 900 }, deviceScaleFactor: 1, isMobile: phone, hasTouch: phone });
    for (const route of list) {
      const page = await ctx.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => {
        if (m.type() === "error" && !/vimeo|cloudflare|Content Security Policy|data:,|401|%c/i.test(m.text())) errors.push(m.text());
      });
      const name = (route === "/" ? "home" : route.slice(1).replace(/\//g, "-")) + `-${width}`;
      try {
        await page.goto(BASE + route, { waitUntil: "load", timeout: 30000 });
        await page.waitForTimeout(1200);
        // scroll through so lazy images and on-scroll animations settle
        await page.evaluate(async () => {
          document.querySelectorAll("img[loading=lazy]").forEach((i) => (i.loading = "eager"));
          for (let y = 0; y < document.body.scrollHeight; y += 500) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 60));
          }
          window.scrollTo(0, 0);
          document.querySelectorAll("[data-aos]").forEach((e) => e.classList.add("aos-animate"));
        });
        await page.waitForTimeout(1200);
        const checks = await page.evaluate(pageChecks, { phone });
        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        const shots = [];
        for (let y = 0, i = 1; y < height; y += SLICE, i++) {
          const file = path.join(OUT, `${name}-${String(i).padStart(2, "0")}.png`);
          await page.screenshot({ path: file, fullPage: true, clip: { x: 0, y, width, height: Math.min(SLICE, height - y) } });
          shots.push(file);
        }
        if (phone && route === "/") {
          // open the mobile menu drawer
          const toggle = page.locator("button[aria-controls], .menu-toggle, .hamburger, button[aria-label*=menu i]").first();
          if (await toggle.count()) {
            await toggle.click().catch(() => {});
            await page.waitForTimeout(500);
            const file = path.join(OUT, `menu-open-${width}.png`);
            await page.screenshot({ path: file });
            shots.push(file);
          }
        }
        report.push({ route, width, height, errors, ...checks, shots });
        const flags = [checks.overflow && "OVERFLOW", checks.wideElements.length && `${checks.wideElements.length} wide`, checks.smallTargets.length && `${checks.smallTargets.length} small targets`, checks.tinyText.length && `${checks.tinyText.length} tiny text`, checks.brokenImages.length && "BROKEN IMG", checks.softImages.length && `${checks.softImages.length} soft img`, errors.length && `${errors.length} errors`].filter(Boolean);
        console.log(`${String(width).padStart(4)} ${route.padEnd(28)} ${flags.join(", ") || "ok"}`);
      } catch (e) {
        report.push({ route, width, fatal: e.message });
        console.log(`${String(width).padStart(4)} ${route.padEnd(28)} FAILED ${e.message}`);
      }
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();

  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
  const md = ["# Responsive check", "", `Base: ${BASE}`, `Widths: ${WIDTHS.join(", ")}`, ""];
  for (const r of report) {
    const items = [];
    if (r.fatal) items.push(`- FAILED: ${r.fatal}`);
    if (r.overflow) items.push(`- Horizontal scroll: page is ${r.overflow.scrollWidth}px wide in a ${r.overflow.viewport}px viewport`);
    for (const k of ["wideElements", "smallTargets", "tinyText", "brokenImages", "softImages", "errors"]) if (r[k] && r[k].length) items.push(`- ${k}: ${r[k].join("; ")}`);
    if (items.length) md.push(`## ${r.route} @ ${r.width}px`, ...items, "");
  }
  fs.writeFileSync(path.join(OUT, "report.md"), md.join("\n"));
  console.log(`\nReport: ${path.join(OUT, "report.md")}`);
})();
