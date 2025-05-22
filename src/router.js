import { createWebHistory, createRouter } from 'vue-router'

import ScanerV1View from './views/ScanerV1View.vue'
import ScanerV2View from './views/ScanerV2View.vue'

const routes = [
  { path: '/', component: ScanerV1View },
  { path: '/v2', component: ScanerV2View },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
