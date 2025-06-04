import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/agentes",
      name: "agentes",
      component: () => import("../views/AgentesView.vue"),
    },
    {
      path: "/mapas",
      name: "mapas",
      component: () => import("../views/MapasView.vue"),
    },
    {
      path: "/arsenal",
      name: "arsenal",
      component: () => import("../views/ArsenalView.vue"),
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
