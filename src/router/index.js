import { createRouter, createWebHistory } from "vue-router";

const routes = [
	{
		path: "/",
		name: "home",
		component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"),
		meta: {
			title: "Otto Zaiser [Designer]",
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
			title: "Portfolio - Otto Zaiser [Designer]",
		},
	},
	// {
	//   path: '/portfolio/proyecto/:id',
	//   name: 'description',
	//   props: true,
	//   component: () => import(/* webpackChunkName: "about" */ '../views/Description.vue'),
	//   meta: {
	//     title: ':id'
	//   }
	// },
	{
		path: "/resume",
		name: "resume",
		// route level code-splitting
		// this generates a separate chunk (resume.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "resume" */ "../views/Resume.vue"),
		meta: {
			title: "CV Resumé - Otto Zaiser [Designer]",
		},
	},
	{
		path: "/story",
		name: "story",
		props: true,
		component: () => import(/* webpackChunkName: "story" */ "../views/Story.vue"),
		meta: {
			title: "My Story - Otto Zaiser [Designer]",
		},
	},
	{
			// will match everything (vue-router v4)
			path: '/:pathMatch(.*)*',
			name: "error404",
			component: () => import(/* webpackChunkName: "error404" */ "../views/Error404.vue"),
		meta: {
			title: "404 - Page not found",
		},
	},
];

	const router = createRouter({
		history: createWebHistory(import.meta.env.BASE_URL),
		routes,
		// preserve existing options
		linkActiveClass: "is-active",
		scrollBehavior() {
			return { left: 0, top: 0 };
		},
	});

	router.beforeEach((to, from, next) => {
		document.title = to.meta?.title || document.title;
		next();
	});

	export default router;
