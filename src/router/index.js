import { createRouter, createWebHistory } from "vue-router";

const routes = [
	{
		path: "/",
		name: "home",
		component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"),
		meta: {
			title: "Otto Zaiser – Product Designer for Mobile Games",
		},
	},
	{
		path: "/portfolio",
		name: "portfolio",
		// route level code-splitting
		// this generates a separate chunk (resume.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "portfolio" */ "../views/Portfolio.vue"),
		meta: {
			title: "Portfolio – Otto Zaiser",
		},
	},
	{
		// Case-study page for a portfolio project; the view sets the document title itself.
		path: "/portfolio/:slug",
		name: "project",
		props: true,
		component: () => import(/* webpackChunkName: "project" */ "../views/ProjectDetail.vue"),
	},
	{
		path: "/resume",
		name: "resume",
		// route level code-splitting
		// this generates a separate chunk (resume.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "resume" */ "../views/Resume.vue"),
		meta: {
			title: "Resume – Otto Zaiser",
		},
	},
	{
		path: "/story",
		name: "story",
		props: true,
		component: () => import(/* webpackChunkName: "story" */ "../views/Story.vue"),
		meta: {
			title: "My story – Otto Zaiser",
		},
	},
	{
			// will match everything (vue-router v4)
			path: '/:pathMatch(.*)*',
			name: "error404",
			component: () => import(/* webpackChunkName: "error404" */ "../views/Error404.vue"),
		meta: {
			title: "404 – Page not found",
		},
	},
];

	function findEl(hash) {
		try {
			return document.querySelector(hash);
		} catch {
			return null; // not a valid selector
		}
	}

	// Resolves true once `hash` exists and the page height has been unchanged for ~300ms
	// (or false after `timeout` ms if it never appears).
	function waitForStableEl(hash, timeout = 4000, interval = 100, stableTicks = 3) {
		return new Promise((resolve) => {
			const start = Date.now();
			let lastHeight = -1;
			let stable = 0;
			const tick = () => {
				const el = findEl(hash);
				const height = document.documentElement.scrollHeight;
				stable = el && height === lastHeight ? stable + 1 : 0;
				lastHeight = height;
				if (el && stable >= stableTicks) return resolve(true);
				if (Date.now() - start > timeout) return resolve(Boolean(el));
				setTimeout(tick, interval);
			};
			tick();
		});
	}

	const router = createRouter({
		history: createWebHistory(import.meta.env.BASE_URL),
		routes,
		// preserve existing options
		linkActiveClass: "is-active",
		scrollBehavior(to, from) {
			if (!to.hash) return { left: 0, top: 0 };
			// Desktop (>= 992px) has a fixed menu bar ~61px tall; land the section just below it.
			// Router-driven scrolling ignores CSS scroll-margin-top, so the offset goes here.
			const target = () => ({ el: to.hash, top: window.innerWidth >= 992 ? 72 : 0, behavior: "smooth" });
			// Same page: the section is already rendered, scroll right away.
			if (from.path === to.path && findEl(to.hash)) {
				return target();
			}
			// Coming from another page (e.g. /story -> /#portfolio): Home renders only after its
			// data loads, and each section then fetches its own JSON, so the page keeps growing.
			// Wait until the target exists and the page height settles before scrolling.
			return waitForStableEl(to.hash).then((found) => (found ? target() : { left: 0, top: 0 }));
		},
	});

	router.beforeEach((to, from, next) => {
		document.title = to.meta?.title || document.title;
		next();
	});

	export default router;
