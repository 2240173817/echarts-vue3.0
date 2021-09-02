import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/sellerpage',
    component: () => import("@/views/SellerPage.vue")
  },
  {
    path: '/trendpage',
    component: () => import("@/views/TrendPage.vue")
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
