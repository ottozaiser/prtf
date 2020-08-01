import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import { wrapRouter } from "oaf-vue-router";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "home",
		component: Home,
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
		// will match everything
		path: "*",
		name: "error404",
		component: () => import(/* webpackChunkName: "error404" */ "../views/Error404.vue"),
		meta: {
			title: "404 - Page not found",
		},
	},
];

const router = new VueRouter({
	mode: "history",
	scrollBehavior() {
		return { x: 0, y: 0 };
	},
	linkActiveClass: "is-active",
	base: process.env.BASE_URL,
	routes,
});

wrapRouter(router);

router.beforeEach((to, from, next) => {
	document.title = to.meta.title;
	next();
});

export default router;
